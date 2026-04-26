import { database } from "./firebase";
import { ref, push, onValue, off } from "firebase/database";

export type ChatMessage = {
  usuarioId: string;
  nombre: string;
  mensaje: string;
  timestamp: number;
};

const CHAT_ROOM_ID = "general";

export function subscribeToChat(
  callback: (messages: Array<{ id: string; data: ChatMessage }>) => void
) {
  const messagesRef = ref(database, `chats/${CHAT_ROOM_ID}/messages`);

  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const data = snapshot.val() || {};
    const formatted = Object.entries(data).map(([id, value]) => ({
      id,
      data: value as ChatMessage,
    }));

    formatted.sort((a, b) => a.data.timestamp - b.data.timestamp);
    callback(formatted);
  });

  return () => off(messagesRef, "value", unsubscribe);
}

export async function sendChatMessage(message: ChatMessage) {
  const messagesRef = ref(database, `chats/${CHAT_ROOM_ID}/messages`);
  await push(messagesRef, message);
}