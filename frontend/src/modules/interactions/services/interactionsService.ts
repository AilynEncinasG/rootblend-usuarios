import { apiRequest } from "../../../services/apiClient";

export type ChannelInteractionState = {
  id_usuario: number;
  id_canal: number;
  siguiendo: boolean;
  suscrito: boolean;
  seguimiento?: unknown;
  suscripcion?: unknown;
};

export type NotificationItem = {
  id_notificacion: number;
  id_usuario: number;
  id_evento: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  fecha_envio: string;
  leida: boolean | number;
  id_canal?: number;
  tipo_evento?: string;
  descripcion_evento?: string | null;
  nombre_canal?: string | null;
};

type ApiItemResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type ApiListResponse<T> = {
  success: boolean;
  message: string;
  data: {
    count: number;
    results: T[];
  };
};

export async function getChannelInteractionState(
  channelId: number,
): Promise<ChannelInteractionState> {
  const response = await apiRequest<ApiItemResponse<ChannelInteractionState>>(
    `/interactions/me/channel-state?id_canal=${channelId}`,
    { auth: true },
  );

  return response.data;
}

export async function followChannel(payload: {
  id_canal: number;
  nombre_canal: string;
  tipo_canal?: string;
  estado_transmision?: "online" | "offline";
}): Promise<ChannelInteractionState> {
  const response = await apiRequest<ApiItemResponse<ChannelInteractionState>>(
    "/interactions/follows",
    {
      method: "POST",
      body: payload,
      auth: true,
    },
  );

  return response.data;
}

export async function unfollowChannel(
  channelId: number,
): Promise<ChannelInteractionState> {
  const response = await apiRequest<ApiItemResponse<ChannelInteractionState>>(
    `/interactions/follows/${channelId}`,
    {
      method: "DELETE",
      auth: true,
    },
  );

  return response.data;
}

export async function subscribeChannel(payload: {
  id_canal: number;
  nombre_canal: string;
  tipo_canal?: string;
  estado_transmision?: "online" | "offline";
  tipo_plan?: string;
}): Promise<ChannelInteractionState> {
  const response = await apiRequest<ApiItemResponse<ChannelInteractionState>>(
    "/interactions/subscriptions",
    {
      method: "POST",
      body: payload,
      auth: true,
    },
  );

  return response.data;
}

export async function unsubscribeChannel(
  channelId: number,
): Promise<ChannelInteractionState> {
  const response = await apiRequest<ApiItemResponse<ChannelInteractionState>>(
    `/interactions/subscriptions/${channelId}`,
    {
      method: "DELETE",
      auth: true,
    },
  );

  return response.data;
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await apiRequest<ApiListResponse<NotificationItem>>(
    "/interactions/notifications",
    { auth: true },
  );

  return response.data.results;
}

export async function markNotificationRead(id: number): Promise<void> {
  await apiRequest<ApiItemResponse<{ id_notificacion: number }>>(
    `/interactions/notifications/${id}/read`,
    {
      method: "PATCH",
      auth: true,
    },
  );
}
