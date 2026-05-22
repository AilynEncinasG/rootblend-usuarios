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

export type ChatModerator = {
  usuarioId: string;
  nombre: string;
  active: boolean;
  assignedAt: number;
};

export type ChatSanction = {
  usuarioId: string;
  nombre: string;
  tipo: "silenciado" | "bloqueado";
  motivo: string;
  active: boolean;
  createdAt: number;
  createdBy: string;
  expiresAt?: number | null;
};

export type StreamChatInfo = {
  id_stream: string;
  id_canal: string;
  estado_chat: "activo" | "cerrado";
  updatedAt: number;
};

export type ChatMessageRecord = {
  id: string;
  data: ChatMessage;
};

export type ChatModeratorRecord = {
  id: string;
  data: ChatModerator;
};

export type ChatSanctionRecord = {
  id: string;
  data: ChatSanction;
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

function channelModeratorsPath(channelId: string | number) {
  return `channel_moderators/${safeKey(channelId)}`;
}

export async function upsertStreamChatInfo(
  streamId: string | number,
  channelId: string | number,
  isLive: boolean,
) {
  const infoRef = ref(database, `${streamChatPath(streamId)}/info`);

  await set(infoRef, {
    id_stream: String(streamId),
    id_canal: String(channelId),
    estado_chat: isLive ? "activo" : "cerrado",
    updatedAt: Date.now(),
  } satisfies StreamChatInfo);
}

export function subscribeToChat(
  streamId: string | number,
  callback: (messages: ChatMessageRecord[]) => void,
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

export function subscribeToChannelModerators(
  channelId: string | number,
  callback: (moderators: ChatModeratorRecord[]) => void,
) {
  const moderatorsRef = ref(database, channelModeratorsPath(channelId));

  return onValue(moderatorsRef, (snapshot) => {
    const data = snapshot.val() || {};

    const formatted = Object.entries(data)
      .map(([id, value]) => ({
        id,
        data: value as ChatModerator,
      }))
      .filter((item) => item.data.active);

    callback(formatted);
  });
}

export function subscribeToStreamSanctions(
  streamId: string | number,
  callback: (sanctions: ChatSanctionRecord[]) => void,
) {
  const sanctionsRef = ref(database, `${streamChatPath(streamId)}/sanctions`);

  return onValue(sanctionsRef, (snapshot) => {
    const data = snapshot.val() || {};
    const now = Date.now();

    const formatted = Object.entries(data)
      .map(([id, value]) => ({
        id,
        data: value as ChatSanction,
      }))
      .filter((item) => {
        if (!item.data.active) return false;
        if (!item.data.expiresAt) return true;
        return item.data.expiresAt > now;
      });

    callback(formatted);
  });
}

export async function sendChatMessage(
  streamId: string | number,
  message: ChatMessage,
) {
  const messagesRef = ref(database, `${streamChatPath(streamId)}/messages`);
  await push(messagesRef, message);
}

export async function deleteChatMessage(
  streamId: string | number,
  messageId: string,
  moderatorName: string,
) {
  const messageRef = ref(
    database,
    `${streamChatPath(streamId)}/messages/${messageId}`,
  );

  await update(messageRef, {
    mensaje: "Mensaje eliminado por moderación.",
    deleted: true,
    deletedAt: Date.now(),
    deletedBy: moderatorName,
  });
}

export async function assignChatModerator(
  channelId: string | number,
  moderator: {
    usuarioId: string;
    nombre: string;
  },
) {
  const moderatorRef = ref(
    database,
    `${channelModeratorsPath(channelId)}/${safeKey(moderator.usuarioId)}`,
  );

  await set(moderatorRef, {
    usuarioId: moderator.usuarioId,
    nombre: moderator.nombre,
    active: true,
    assignedAt: Date.now(),
  } satisfies ChatModerator);
}

export async function removeChatModerator(
  channelId: string | number,
  usuarioId: string,
) {
  const moderatorRef = ref(
    database,
    `${channelModeratorsPath(channelId)}/${safeKey(usuarioId)}`,
  );

  await update(moderatorRef, {
    active: false,
  });
}

export async function createChatSanction(
  streamId: string | number,
  sanction: ChatSanction,
) {
  const sanctionRef = ref(
    database,
    `${streamChatPath(streamId)}/sanctions/${safeKey(sanction.usuarioId)}`,
  );

  await set(sanctionRef, sanction);
}

export async function clearChatSanction(
  streamId: string | number,
  usuarioId: string,
) {
  const sanctionRef = ref(
    database,
    `${streamChatPath(streamId)}/sanctions/${safeKey(usuarioId)}`,
  );

  await update(sanctionRef, {
    active: false,
  });
}

export async function clearStreamChatMessages(streamId: string | number) {
  const messagesRef = ref(database, `${streamChatPath(streamId)}/messages`);
  await remove(messagesRef);
}