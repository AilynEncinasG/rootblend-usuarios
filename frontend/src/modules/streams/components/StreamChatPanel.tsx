import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FiAlertTriangle,
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
  clearStreamChatMessages,
  createChatSanction,
  deleteChatMessage,
  removeChatModerator,
  sendChatMessage,
  subscribeToChannelModerators,
  subscribeToChat,
  subscribeToStreamSanctions,
  upsertStreamChatInfo,
  type ChatMessageRecord,
  type ChatModeratorRecord,
  type ChatSanctionRecord,
} from "../../../services/chatService";

import { getMyChannel } from "../services/streamsService";
import { recordStreamStatsEvent } from "../services/streamStatsService";

type StreamChatPanelProps = {
  streamId: string | number;
  channelId: string | number;
  allowInput: boolean;
  isLive: boolean;
};

type CurrentUser = {
  id: string;
  name: string;
};

const MAX_CHAT_MESSAGE_LENGTH = 500;
const CHAT_COOLDOWN_MS = 3000;

function getCurrentUser(): CurrentUser {
  const user = getStoredUser() as {
    id_usuario?: number;
    id?: number;
    nombre_visible?: string;
    nombre?: string;
    username?: string;
    correo?: string;
    email?: string;
  } | null;

  const id =
    user?.id_usuario ||
    user?.id ||
    user?.correo ||
    user?.email ||
    "viewer";

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

function isUserModerator(
  moderators: ChatModeratorRecord[],
  currentUser: CurrentUser,
) {
  return moderators.some(
    (item) =>
      item.data.active &&
      (item.data.usuarioId === currentUser.id ||
        item.data.nombre === currentUser.name),
  );
}
function isMessageAuthorModerator(
  moderators: ChatModeratorRecord[],
  message: ChatMessageRecord,
) {
  return moderators.some(
    (item) =>
      item.data.active &&
      (item.data.usuarioId === message.data.usuarioId ||
        item.data.nombre === message.data.nombre),
  );
}
function getUserSanction(
  sanctions: ChatSanctionRecord[],
  currentUser: CurrentUser,
) {
  return (
    sanctions.find(
      (item) =>
        item.data.active &&
        (item.data.usuarioId === currentUser.id ||
          item.data.nombre === currentUser.name),
    ) || null
  );
}

export default function StreamChatPanel({
  streamId,
  channelId,
  allowInput,
  isLive,
}: StreamChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [moderators, setModerators] = useState<ChatModeratorRecord[]>([]);
  const [sanctions, setSanctions] = useState<ChatSanctionRecord[]>([]);
  const [text, setText] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("Conectando chat con Firebase...");
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastSentAt, setLastSentAt] = useState(0);

  const loggedIn = isAuthenticated();
  const currentUser = useMemo(() => getCurrentUser(), []);
  const userIsModerator = isUserModerator(moderators, currentUser);
  const canModerate = isOwner || userIsModerator;
  const currentSanction = getUserSanction(sanctions, currentUser);

  const cleanText = text.trim();
  const messageTooLong = cleanText.length > MAX_CHAT_MESSAGE_LENGTH;

  const canSendMessage =
    loggedIn &&
    allowInput &&
    isLive &&
    !currentSanction &&
    !sending &&
    cleanText.length > 0 &&
    !messageTooLong;

  useEffect(() => {
    let active = true;

    setLoading(true);
    setMessages([]);
    setFeedback(`Conectando chat del stream #${streamId} con Firebase...`);

    upsertStreamChatInfo(streamId, channelId, isLive).catch((error) => {
      console.error("FIREBASE_CHAT_INFO_ERROR", error);

      if (active) {
        setFeedback("El chat lee mensajes, pero no pudo actualizar su info.");
      }
    });

    const unsubscribe = subscribeToChat(streamId, (incomingMessages) => {
      if (!active) return;

      setMessages(incomingMessages);
      setLoading(false);
      setFeedback(
        `Chat conectado al stream #${streamId}. Mensajes: ${incomingMessages.length}.`,
      );
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [streamId, channelId, isLive]);

  useEffect(() => {
    const unsubscribe = subscribeToChannelModerators(channelId, setModerators);

    return () => unsubscribe();
  }, [channelId]);

  useEffect(() => {
    const unsubscribe = subscribeToStreamSanctions(streamId, setSanctions);

    return () => unsubscribe();
  }, [streamId]);

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

        setIsOwner(
          role === "streamer" && String(userChannelId) === String(channelId),
        );
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

    const now = Date.now();
    const remainingCooldown = CHAT_COOLDOWN_MS - (now - lastSentAt);

    if (!cleanText) {
      setFeedback("No puedes enviar mensajes vacíos.");
      return;
    }

    if (messageTooLong) {
      setFeedback(
        `El mensaje supera el límite de ${MAX_CHAT_MESSAGE_LENGTH} caracteres.`,
      );
      return;
    }

    if (!loggedIn || !allowInput) {
      setFeedback("Debes iniciar sesión para escribir en el chat.");
      return;
    }

    if (!isLive) {
      setFeedback("El chat está cerrado porque el stream no está en vivo.");
      return;
    }

    if (currentSanction?.data.tipo === "bloqueado") {
      setFeedback("No puedes escribir porque estás bloqueado en este chat.");
      return;
    }

    if (currentSanction?.data.tipo === "silenciado") {
      setFeedback("No puedes escribir porque estás silenciado temporalmente.");
      return;
    }

    if (remainingCooldown > 0) {
      setFeedback(
        `Espera ${Math.ceil(
          remainingCooldown / 1000,
        )} segundo(s) antes de enviar otro mensaje.`,
      );
      return;
    }

    try {
      setSending(true);

      const messagePayload = {
        usuarioId: currentUser.id,
        nombre: currentUser.name,
        mensaje: cleanText,
        timestamp: Date.now(),
        ...(canModerate ? { badge: "MOD" } : {}),
      };

      await sendChatMessage(streamId, messagePayload);

      await recordStreamStatsEvent({
        event_type: "chat.message",
        id_stream: Number(streamId),
        usuarios_activos: messages.length + 1,
      });

      setText("");
      setLastSentAt(Date.now());
      setFeedback("Mensaje enviado correctamente.");
    } catch (error) {
      console.error("FIREBASE_CHAT_SEND_ERROR", error);
      setFeedback("No se pudo enviar el mensaje en Firebase.");
    } finally {
      setSending(false);
    }
  }

  async function clearChatForTesting() {
    if (!canModerate) {
      setFeedback("Necesitas ser dueño o moderador para limpiar el chat.");
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que deseas limpiar todos los mensajes de este stream?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await clearStreamChatMessages(streamId);
      setMessages([]);
      setActiveId(null);
      setFeedback("Chat limpiado correctamente para nuevas pruebas.");
    } catch (error) {
      console.error("FIREBASE_CHAT_CLEAR_ERROR", error);
      setFeedback("No se pudo limpiar el chat en Firebase.");
    }
  }

  async function runAction(action: string, message: ChatMessageRecord) {
    const targetName = message.data.nombre;
    const targetUserId = message.data.usuarioId;

    try {
      if (action === "Hacer moderador") {
        if (!isOwner) {
          setFeedback("Solo el dueño del canal puede asignar moderadores.");
          return;
        }

        await assignChatModerator(channelId, {
          usuarioId: targetUserId,
          nombre: targetName,
        });

        setFeedback(`${targetName} ahora es moderador de este canal.`);
      }
      if (action === "Quitar moderador") {
        if (!isOwner) {
          setFeedback("Solo el dueño del canal puede retirar moderadores.");
          return;
        }

        await removeChatModerator(channelId, targetUserId);

        setFeedback(`${targetName} ya no es moderador de este canal.`);
      }
      if (action === "Eliminar mensaje") {
        if (!canModerate) {
          setFeedback("Necesitas rol de moderador en este canal.");
          return;
        }

        await deleteChatMessage(streamId, message.id, currentUser.name);

        await recordStreamStatsEvent({
          event_type: "chat.message.deleted",
          id_stream: Number(streamId),
          usuarios_activos: messages.length,
        });

        setFeedback(`Mensaje de ${targetName} eliminado para todos.`);
      }

      if (action === "Silenciar usuario") {
        if (!canModerate) {
          setFeedback("Necesitas rol de moderador en este canal.");
          return;
        }

        await createChatSanction(streamId, {
          usuarioId: targetUserId,
          nombre: targetName,
          tipo: "silenciado",
          motivo: "Moderación temporal",
          active: true,
          createdAt: Date.now(),
          createdBy: currentUser.name,
          expiresAt: Date.now() + 10 * 60 * 1000,
        });

        setFeedback(`${targetName} fue silenciado por 10 minutos.`);
      }

      if (action === "Bloquear usuario") {
        if (!canModerate) {
          setFeedback("Necesitas rol de moderador en este canal.");
          return;
        }

        await createChatSanction(streamId, {
          usuarioId: targetUserId,
          nombre: targetName,
          tipo: "bloqueado",
          motivo: "Bloqueo de chat",
          active: true,
          createdAt: Date.now(),
          createdBy: currentUser.name,
          expiresAt: null,
        });

        setFeedback(`${targetName} fue bloqueado en este stream.`);
      }

      if (action === "Ver perfil") {
        setFeedback(`Perfil de ${targetName}.`);
      }
    } catch (error) {
      console.error("FIREBASE_CHAT_ACTION_ERROR", error);
      setFeedback("No se pudo completar la acción en Firebase.");
    } finally {
      setActiveId(null);
    }
  }

  return (
    <ChatBox>
      <Header>
        <div>
          <strong>Chat en vivo</strong>
          <small>Stream #{streamId}</small>
        </div>

        <span>
          {canModerate ? "MOD activo" : loggedIn ? "Viewer" : "Solo lectura"}
        </span>
      </Header>

      <Feedback>{feedback}</Feedback>

      {canModerate && messages.length > 0 && (
        <ClearChatButton type="button" onClick={clearChatForTesting}>
          <FiTrash2 /> Limpiar chat de prueba
        </ClearChatButton>
      )}

      {currentSanction && (
        <WarningBox>
          <FiAlertTriangle />
          <span>
            {currentSanction.data.tipo === "bloqueado"
              ? "Estás bloqueado en este chat."
              : "Estás silenciado temporalmente."}
          </span>
        </WarningBox>
      )}

      <Messages>
        {loading && <EmptyState>Cargando mensajes...</EmptyState>}

        {!loading && messages.length === 0 && (
          <EmptyState>Aún no hay mensajes en este directo.</EmptyState>
        )}

        {messages.map((message) => {
          const messageUserIsModerator = isMessageAuthorModerator(
            moderators,
            message,
          );

          return (
            <MessageRow key={message.id}>
              <Avatar>{message.data.nombre.slice(0, 2).toUpperCase()}</Avatar>

              <Bubble>
                <Name>
                  {message.data.nombre}

                  {(message.data.badge || messageUserIsModerator) && (
                    <Badge>{message.data.badge || "MOD"}</Badge>
                  )}

                  {message.data.deleted && (
                    <DeletedBadge>Eliminado</DeletedBadge>
                  )}

                  <time>{formatMessageTime(message.data.timestamp)}</time>
                </Name>

                <p>{message.data.mensaje}</p>
              </Bubble>

              <MenuButton
                type="button"
                aria-label="Acciones de chat"
                onClick={() =>
                  setActiveId((current) =>
                    current === message.id ? null : message.id,
                  )
                }
              >
                <FiMoreVertical />
              </MenuButton>

              {activeId === message.id && (
                <ActionMenu>
                  <button
                    type="button"
                    onClick={() => runAction("Ver perfil", message)}
                  >
                    <FiEye /> Ver perfil
                  </button>

                  {isOwner && !messageUserIsModerator && (
                    <button
                      type="button"
                      onClick={() => runAction("Hacer moderador", message)}
                    >
                      <FiShield /> Hacer moderador
                    </button>
                  )}

                  {isOwner && messageUserIsModerator && (
                    <button
                      type="button"
                      onClick={() => runAction("Quitar moderador", message)}
                    >
                      <FiXCircle /> Quitar moderador
                    </button>
                  )}

                  {canModerate && (
                    <>
                      <button
                        type="button"
                        onClick={() => runAction("Eliminar mensaje", message)}
                      >
                        <FiTrash2 /> Eliminar mensaje
                      </button>

                      <button
                        type="button"
                        onClick={() => runAction("Silenciar usuario", message)}
                      >
                        <FiVolume2 /> Silenciar usuario
                      </button>

                      <button
                        type="button"
                        onClick={() => runAction("Bloquear usuario", message)}
                      >
                        <FiXCircle /> Bloquear usuario
                      </button>
                    </>
                  )}
                </ActionMenu>
              )}
            </MessageRow>
          );
        })}
      </Messages>

      {loggedIn && allowInput && isLive ? (
        <ChatForm onSubmit={submit}>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={MAX_CHAT_MESSAGE_LENGTH}
            placeholder={
              currentSanction
                ? "No puedes escribir por una sanción activa..."
                : sending
                  ? "Enviando mensaje..."
                  : "Enviar mensaje..."
            }
            disabled={Boolean(currentSanction) || sending}
          />

          <button
            type="submit"
            aria-label="Enviar mensaje"
            disabled={!canSendMessage}
          >
            <FiSend />
          </button>

          <small>
            {cleanText.length}/{MAX_CHAT_MESSAGE_LENGTH} caracteres
          </small>
        </ChatForm>
      ) : !isLive ? (
        <LoginNotice>
          <FiWifiOff />
          El chat está cerrado porque el stream no está en vivo.
        </LoginNotice>
      ) : (
        <LoginNotice>
          <FiLock />
          Inicia sesión para escribir en el chat.
          <Link to="/login">Iniciar sesión</Link>
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
  gap: 10px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);

  div {
    display: grid;
    gap: 3px;
  }

  small {
    color: rgba(226, 232, 240, 0.52);
    font-size: 11px;
    font-weight: 700;
  }

  span {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 850;
    white-space: nowrap;
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

const ClearChatButton = styled.button`
  margin: 0 10px 10px;
  height: 36px;
  border: 1px solid rgba(239, 68, 68, 0.32);
  border-radius: 10px;
  color: #fecaca;
  background: rgba(239, 68, 68, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 850;
  cursor: pointer;

  &:hover {
    background: rgba(239, 68, 68, 0.18);
  }
`;

const WarningBox = styled.div`
  margin: 0 10px 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  color: #fecaca;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.28);
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

const DeletedBadge = styled.span`
  padding: 2px 5px;
  border-radius: 6px;
  color: #fecaca;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.22);
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
    height: 38px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 10px;
    color: #fff;
    background: rgba(2, 6, 23, 0.78);
    padding: 0 10px;
  }

  input:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  button {
    border: 0;
    border-radius: 10px;
    color: #03111c;
    background: #00e5ff;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  small {
    grid-column: 1 / -1;
    color: rgba(226, 232, 240, 0.52);
    font-size: 11px;
    text-align: right;
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