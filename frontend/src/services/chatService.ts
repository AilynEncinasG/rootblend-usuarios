import { database } from "./firebase";
import { onValue, push, ref, remove, set, update } from "firebase/database";

export type ChatMessage = {
  usuarioId: string;
  nombre: string;
  mensaje: string;
  timestamp: number;
  badge?: string;
  deleted?: boolean;
  deletedAt?: number;
  deletedBy?: string;
};

export type ChatSanction = {
  usuarioId: string;
  nombre: string;
  tipo: "silenciado" | "bloqueado";
  motivo: string;
  createdAt: number;
  createdBy: string;
};

export type ChatMessageRecord = {
  id: string;
  data: ChatMessage;
};

function safeKey(value: string | number) {
  return String(value)
    .replaceAll(".", "_")
    .replaceAll("#", "_")
    .replaceAll("$", "_")
    .replaceAll("/", "_")
    .replaceAll("[", "_")
    .replaceAll("]", "_");
}

function streamChatPath(streamId: string | number) {
  return `stream_chats/${safeKey(streamId)}`;
}

export function subscribeToChat(
  streamId: string | number,
  callback: (messages: ChatMessageRecord[]) => void
) {
  const messagesRef = ref(database, `${streamChatPath(streamId)}/messages`);

  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val() || {};
    const formatted = Object.entries(data).map(([id, value]) => ({
      id,
      data: value as ChatMessage,
    }));

    formatted.sort((a, b) => a.data.timestamp - b.data.timestamp);
    callback(formatted);
  });
}

export async function sendChatMessage(
  streamId: string | number,
  message: ChatMessage
) {
  const messagesRef = ref(database, `${streamChatPath(streamId)}/messages`);
  await push(messagesRef, message);
}

export async function deleteChatMessage(
  streamId: string | number,
  messageId: string,
  moderatorName: string
) {
  const messageRef = ref(
    database,
    `${streamChatPath(streamId)}/messages/${safeKey(messageId)}`
  );

  await update(messageRef, {
    mensaje: "Mensaje eliminado por moderacion.",
    deleted: true,
    deletedAt: Date.now(),
    deletedBy: moderatorName,
  });
}

export async function assignChatModerator(
  channelId: string | number,
  userName: string
) {
  const moderatorRef = ref(
    database,
    `channel_moderators/${safeKey(channelId)}/${safeKey(userName)}`
  );

  await set(moderatorRef, {
    nombre: userName,
    active: true,
    assignedAt: Date.now(),
  });
}

export async function createChatSanction(
  streamId: string | number,
  sanction: ChatSanction
) {
  const sanctionsRef = ref(database, `${streamChatPath(streamId)}/sanctions`);
  await push(sanctionsRef, sanction);
}

export async function clearStreamChatMessages(streamId: string | number) {
  const messagesRef = ref(database, `${streamChatPath(streamId)}/messages`);
  await remove(messagesRef);
}
