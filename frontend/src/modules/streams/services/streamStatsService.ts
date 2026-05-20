import { apiRequest } from "../../../services/apiClient";

export type StreamStats = {
  id_estadistica_stream: number;
  id_stream: number;
  total_vistas: number;
  espectadores_pico: number;
  duracion_total?: string | null;
  duracion_segundos: number;
  fecha_generacion?: string | null;
  audiencia: {
    espectadores_actuales: number;
    espectadores_unicos: number;
    fecha_registro?: string | null;
    origen_trafico?: string | null;
  };
  chat: {
    total_mensajes: number;
    mensajes_eliminados: number;
    usuarios_activos: number;
    fecha_registro?: string | null;
  };
};

type ApiItemResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getStreamStats(idStream: number): Promise<StreamStats> {
  const response = await apiRequest<ApiItemResponse<StreamStats>>(
    `/stats/streams/${idStream}/`,
  );

  return response.data;
}

export async function recordStreamStatsEvent(payload: {
  event_type: "chat.message" | "chat.message.deleted";
  id_stream: number;
  usuarios_activos?: number;
}): Promise<StreamStats | null> {
  try {
    const response = await apiRequest<ApiItemResponse<StreamStats>>(
      "/stats/events/stream/",
      {
        method: "POST",
        body: payload,
      },
    );

    return response.data;
  } catch (error) {
    console.error("STREAM_STATS_EVENT_ERROR", error);
    return null;
  }
}
