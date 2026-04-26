import { useEffect, useState } from "react";
import { sendChatMessage, subscribeToChat, type ChatMessage } from "../services/chatService";

const FirebaseChatTest = () => {
  const [messages, setMessages] = useState<Array<{ id: string; data: ChatMessage }>>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToChat((incomingMessages) => {
      setMessages(incomingMessages);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendChatMessage({
      usuarioId: "test-user-1",
      nombre: "Prueba Rootblend",
      mensaje: text,
      timestamp: Date.now(),
    });

    setText("");
  };

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        background: "#0b0b0f",
        minHeight: "100vh",
      }}
    >
      <h2>Prueba Firebase Chat</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje"
          style={{
            padding: "10px",
            width: "300px",
            background: "#111",
            color: "white",
            border: "1px solid #444",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#00e5ff",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </div>

      <div style={{ display: "grid", gap: "10px" }}>
        {messages.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#1a1a1a",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <strong>{item.data.nombre}</strong>
            <div>{item.data.mensaje}</div>
            <small>{new Date(item.data.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirebaseChatTest;