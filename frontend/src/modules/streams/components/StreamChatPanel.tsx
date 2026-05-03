import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiEye, FiMoreVertical, FiSend, FiShield, FiTrash2, FiVolume2, FiXCircle } from "react-icons/fi";
import { isAuthenticated } from "../../auth/utils/authStorage";

type Message = {
  id: string;
  user: string;
  badge?: string;
  text: string;
  time: string;
};

const initialMessages: Message[] = [
  { id: "1", user: "GamerX", badge: "MOD", text: "Bienvenidos al directo real.", time: "Ahora" },
  { id: "2", user: "LunaVibes", badge: "VIP", text: "Esperando senal de OBS.", time: "Ahora" },
  { id: "3", user: "ToxicUser", text: "Mensaje de prueba para moderacion.", time: "Ahora" },
];

type StreamChatPanelProps = {
  allowInput: boolean;
};

export default function StreamChatPanel({ allowInput }: StreamChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("Chat por stream listo para conectar a Firebase o WebSocket.");
  const loggedIn = isAuthenticated();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text.trim() || !loggedIn || !allowInput) return;

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        user: "usuario_123",
        badge: "TU",
        text: text.trim(),
        time: "Ahora",
      },
    ]);
    setText("");
  }

  function runAction(action: string, message: Message) {
    if (action === "Eliminar mensaje") {
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, text: "Mensaje eliminado por moderacion." }
            : item
        )
      );
    }

    setFeedback(`${action}: ${message.user} en este canal.`);
    setActiveId(null);
  }

  return (
    <ChatBox>
      <Header>
        <strong>Chat en vivo</strong>
        <span>{loggedIn ? "Viewer logueado" : "Solo lectura"}</span>
      </Header>

      <Feedback>{feedback}</Feedback>

      <Messages>
        {messages.map((message) => (
          <MessageRow key={message.id}>
            <Avatar>{message.user.slice(0, 2).toUpperCase()}</Avatar>
            <Bubble>
              <Name>
                {message.user}
                {message.badge && <Badge>{message.badge}</Badge>}
                <time>{message.time}</time>
              </Name>
              <p>{message.text}</p>
            </Bubble>
            <MenuButton
              type="button"
              aria-label="Acciones de chat"
              onClick={() => setActiveId((current) => (current === message.id ? null : message.id))}
            >
              <FiMoreVertical />
            </MenuButton>
            {activeId === message.id && (
              <ActionMenu>
                <button type="button" onClick={() => runAction("Ver perfil", message)}><FiEye /> Ver perfil</button>
                <button type="button" onClick={() => runAction("Hacer moderador", message)}><FiShield /> Hacer moderador</button>
                <button type="button" onClick={() => runAction("Eliminar mensaje", message)}><FiTrash2 /> Eliminar mensaje</button>
                <button type="button" onClick={() => runAction("Silenciar usuario", message)}><FiVolume2 /> Silenciar usuario</button>
                <button type="button" onClick={() => runAction("Bloquear usuario", message)}><FiXCircle /> Bloquear usuario</button>
              </ActionMenu>
            )}
          </MessageRow>
        ))}
      </Messages>

      {loggedIn && allowInput ? (
        <ChatForm onSubmit={submit}>
          <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Enviar mensaje..." />
          <button type="submit"><FiSend /></button>
        </ChatForm>
      ) : (
        <LoginNotice>
          Inicia sesion para escribir en el chat.
          <Link to="/login">Iniciar sesion</Link>
        </LoginNotice>
      )}
    </ChatBox>
  );
}

const ChatBox = styled.aside`
  height: calc(100vh - 92px);
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
  width: 190px;
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
