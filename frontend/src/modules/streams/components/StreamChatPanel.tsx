import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FiEye,
  FiLock,
  FiMoreVertical,
  FiSend,
  FiShield,
  FiTrash2,
  FiVolume2,
  FiWifiOff,
  FiXCircle,
} from "react-icons/fi";
import { getStoredUser, isAuthenticated } from "../../auth/utils/authStorage";
import {
  assignChatModerator,
  createChatSanction,
  deleteChatMessage,
  sendChatMessage,
  subscribeToChat,
  type ChatMessageRecord,
} from "../../../services/chatService";
import { getMyChannel } from "../services/streamsService";

type StreamChatPanelProps = {
  streamId: string | number;
  channelId: string | number;
  allowInput: boolean;
  isLive: boolean;
};

function safeLocalKey(value: string | number) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function moderatorsStorageKey(channelId: string | number) {
  return `rootblend:moderators:${safeLocalKey(channelId)}`;
}

function readModerators(channelId: string | number) {
  const stored = localStorage.getItem(moderatorsStorageKey(channelId));

  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function saveModerators(channelId: string | number, moderators: string[]) {
  localStorage.setItem(moderatorsStorageKey(channelId), JSON.stringify(moderators));
}

function getCurrentUser() {
  const user = getStoredUser() as {
    id_usuario?: number;
    id?: number;
    nombre_visible?: string;
    nombre?: string;
    username?: string;
    correo?: string;
    email?: string;
  } | null;

  const id = user?.id_usuario || user?.id || user?.correo || user?.email || "viewer";
  const name =
    user?.nombre_visible ||
    user?.nombre ||
    user?.username ||
    user?.correo ||
    user?.email ||
    "Viewer ROOTBLEND";

  return {
    id: String(id),
    name,
  };
}

function formatMessageTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StreamChatPanel({
  streamId,
  channelId,
  allowInput,
  isLive,
}: StreamChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [text, setText] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [moderators, setModerators] = useState<string[]>(() => readModerators(channelId));
  const [feedback, setFeedback] = useState("Chat conectado a Firebase por stream.");
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const loggedIn = isAuthenticated();
  const currentUser = useMemo(() => getCurrentUser(), []);
  const canModerate = isOwner || moderators.includes(currentUser.name);

  useEffect(() => {
    setLoading(true);
    setMessages([]);

    const unsubscribe = subscribeToChat(streamId, (incomingMessages) => {
      setMessages(incomingMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [streamId]);

  useEffect(() => {
    setModerators(readModerators(channelId));
  }, [channelId]);

  useEffect(() => {
    let active = true;

    async function loadOwnerState() {
      if (!loggedIn) {
        setIsOwner(false);
        return;
      }

      try {
        const result = await getMyChannel();

        if (!active) return;

        const userChannelId = result.canal?.id_canal;
        const role = result.canal?.tipo_canal?.nombre_tipo;
        setIsOwner(role === "streamer" && String(userChannelId) === String(channelId));
      } catch {
        if (active) {
          setIsOwner(false);
        }
      }
    }

    loadOwnerState();

    return () => {
      active = false;
    };
  }, [channelId, loggedIn]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanText = text.trim();

    if (!cleanText || !loggedIn || !allowInput || !isLive) return;

    try {
      await sendChatMessage(streamId, {
        usuarioId: currentUser.id,
        nombre: currentUser.name,
        mensaje: cleanText,
        timestamp: Date.now(),
        badge: canModerate ? "MOD" : undefined,
      });

      setText("");
      setFeedback("Mensaje enviado.");
    } catch (error) {
      console.error("FIREBASE_CHAT_SEND_ERROR", error);
      setFeedback("No se pudo enviar el mensaje en Firebase.");
    }
  }

  async function runAction(action: string, message: ChatMessageRecord) {
    const targetName = message.data.nombre;

    try {
      if (action === "Hacer moderador") {
        if (!isOwner) {
          setFeedback("Solo el duenio del canal puede asignar moderadores.");
          return;
        }

        const nextModerators = Array.from(new Set([...moderators, targetName]));
        saveModerators(channelId, nextModerators);
        setModerators(nextModerators);
        await assignChatModerator(channelId, targetName);
        setFeedback(`${targetName} ahora es moderador de este canal.`);
      }

      if (action === "Eliminar mensaje") {
        if (!canModerate) {
          setFeedback("Necesitas rol de moderador en este canal.");
          return;
        }

        await deleteChatMessage(streamId, message.id, currentUser.name);
        setFeedback(`Mensaje de ${targetName} eliminado para todos.`);
      }

      if (action === "Silenciar usuario" || action === "Bloquear usuario") {
        if (!canModerate) {
          setFeedback("Necesitas rol de moderador en este canal.");
          return;
        }

        await createChatSanction(streamId, {
          usuarioId: message.data.usuarioId,
          nombre: targetName,
          tipo: action === "Silenciar usuario" ? "silenciado" : "bloqueado",
          motivo: action === "Silenciar usuario" ? "Moderacion temporal" : "Bloqueo de chat",
          createdAt: Date.now(),
          createdBy: currentUser.name,
        });
        setFeedback(`${targetName} fue ${action === "Silenciar usuario" ? "silenciado" : "bloqueado"} en este stream.`);
      }

      if (action === "Ver perfil") {
        setFeedback(`Perfil de ${targetName}.`);
      }
    } catch (error) {
      console.error("FIREBASE_CHAT_ACTION_ERROR", error);
      setFeedback("No se pudo completar la accion en Firebase.");
    } finally {
      setActiveId(null);
    }
  }

  return (
    <ChatBox>
      <Header>
        <strong>Chat en vivo</strong>
        <span>{canModerate ? "MOD" : loggedIn ? "Viewer" : "Solo lectura"}</span>
      </Header>

      <Feedback>{feedback}</Feedback>

      <Messages>
        {loading && <EmptyState>Cargando mensajes...</EmptyState>}

        {!loading && messages.length === 0 && (
          <EmptyState>Aun no hay mensajes en este directo.</EmptyState>
        )}

        {messages.map((message) => (
          <MessageRow key={message.id}>
            <Avatar>{message.data.nombre.slice(0, 2).toUpperCase()}</Avatar>
            <Bubble>
              <Name>
                {message.data.nombre}
                {(message.data.badge || moderators.includes(message.data.nombre)) && (
                  <Badge>{message.data.badge || "MOD"}</Badge>
                )}
                <time>{formatMessageTime(message.data.timestamp)}</time>
              </Name>
              <p>{message.data.mensaje}</p>
            </Bubble>

            <MenuButton
              type="button"
              aria-label="Acciones de chat"
              onClick={() =>
                setActiveId((current) => (current === message.id ? null : message.id))
              }
            >
              <FiMoreVertical />
            </MenuButton>

            {activeId === message.id && (
              <ActionMenu>
                <button type="button" onClick={() => runAction("Ver perfil", message)}>
                  <FiEye /> Ver perfil
                </button>
                {isOwner && (
                  <button type="button" onClick={() => runAction("Hacer moderador", message)}>
                    <FiShield /> Hacer moderador
                  </button>
                )}
                {canModerate && (
                  <>
                    <button type="button" onClick={() => runAction("Eliminar mensaje", message)}>
                      <FiTrash2 /> Eliminar mensaje
                    </button>
                    <button type="button" onClick={() => runAction("Silenciar usuario", message)}>
                      <FiVolume2 /> Silenciar usuario
                    </button>
                    <button type="button" onClick={() => runAction("Bloquear usuario", message)}>
                      <FiXCircle /> Bloquear usuario
                    </button>
                  </>
                )}
              </ActionMenu>
            )}
          </MessageRow>
        ))}
      </Messages>

      {loggedIn && allowInput && isLive ? (
        <ChatForm onSubmit={submit}>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enviar mensaje..."
          />
          <button type="submit" aria-label="Enviar mensaje">
            <FiSend />
          </button>
        </ChatForm>
      ) : !isLive ? (
        <LoginNotice>
          <FiWifiOff />
          El chat esta cerrado porque el stream no esta en vivo.
        </LoginNotice>
      ) : (
        <LoginNotice>
          <FiLock />
          Inicia sesion para escribir en el chat.
          <Link to="/login">Iniciar sesion</Link>
        </LoginNotice>
      )}
    </ChatBox>
  );
}

const ChatBox = styled.aside`
  height: calc(100vh - 92px);
  min-height: 560px;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.84);
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 14px;
  overflow: hidden;
`;

const Header = styled.div`
  min-height: 54px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);

  span {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 850;
  }
`;

const Feedback = styled.div`
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  color: #a7f3d0;
  background: rgba(20, 184, 166, 0.12);
  border: 1px solid rgba(20, 184, 166, 0.22);
  font-size: 12px;
`;

const Messages = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 10px;
`;

const EmptyState = styled.div`
  padding: 18px 10px;
  color: rgba(226, 232, 240, 0.58);
  text-align: center;
  font-size: 13px;
`;

const MessageRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 32px 1fr 28px;
  gap: 8px;
  padding: 8px 0;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #03111c;
  background: #00e5ff;
  font-size: 11px;
  font-weight: 950;
`;

const Bubble = styled.div`
  min-width: 0;

  p {
    margin: 3px 0 0;
    color: rgba(226, 232, 240, 0.82);
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-weight: 850;
  font-size: 13px;

  time {
    margin-left: auto;
    color: rgba(226, 232, 240, 0.46);
    font-size: 11px;
    font-weight: 500;
  }
`;

const Badge = styled.span`
  padding: 2px 5px;
  border-radius: 6px;
  color: #03111c;
  background: #22c55e;
  font-size: 10px;
`;

const MenuButton = styled.button`
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  color: #e2e8f0;
  background: transparent;
  cursor: pointer;
`;

const ActionMenu = styled.div`
  position: absolute;
  right: 26px;
  top: 34px;
  z-index: 10;
  width: 202px;
  padding: 6px;
  border-radius: 10px;
  background: #111827;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);

  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: 0;
    border-radius: 8px;
    color: #e5e7eb;
    background: transparent;
    cursor: pointer;
    text-align: left;
  }

  button:hover {
    background: rgba(0, 229, 255, 0.1);
  }
`;

const ChatForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 38px;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);

  input {
    min-width: 0;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 10px;
    color: #fff;
    background: rgba(2, 6, 23, 0.78);
    padding: 0 10px;
  }

  button {
    border: 0;
    border-radius: 10px;
    color: #03111c;
    background: #00e5ff;
    cursor: pointer;
  }
`;

const LoginNotice = styled.div`
  padding: 12px;
  display: grid;
  gap: 8px;
  color: rgba(226, 232, 240, 0.72);
  border-top: 1px solid rgba(148, 163, 184, 0.12);

  a {
    color: #00e5ff;
    font-weight: 850;
  }
`;
