import { apiRequest } from "../../../services/apiClient";

export type TipoCanal = {
  id_tipo_canal: number;
  nombre_tipo: "streamer" | "podcaster";
  descripcion?: string | null;
};

export type Canal = {
  id_canal: number;
  id_usuario_propietario: number;
  tipo_canal: TipoCanal;
  nombre_canal: string;
  descripcion: string | null;
  foto_canal: string | null;
  banner_canal: string | null;
  estado_canal: string;
  fecha_creacion: string;
};

export type Categoria = {
  id_categoria: number;
  nombre: string;
  descripcion?: string | null;
};

export type Stream = {
  id_stream: number;
  titulo: string;
  descripcion?: string | null;
  estado: "programado" | "en_vivo" | "finalizado";
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  calidad_actual?: string | null;
  destacado: boolean;

  stream_key?: string | null;
  ingest_url?: string | null;
  playback_url?: string | null;
  thumbnail_url?: string | null;
  viewer_count?: number;
  signal_status?: "sin_senal" | "conectado" | "desconectado" | "error" | null;
  last_signal_at?: string | null;

  canal: {
    id_canal: number;
    nombre_canal: string;
    descripcion?: string | null;
    foto_canal?: string | null;
    banner_canal?: string | null;
    estado_canal?: string | null;
    id_usuario_propietario?: number;
    tipo_canal?:
      | TipoCanal
      | {
          id_tipo_canal?: number;
          nombre_tipo?: "streamer" | "podcaster" | string;
          descripcion?: string | null;
        }
      | string;
  };

  categoria: {
    id_categoria: number;
    nombre: string;
  };

  configuracion?: {
    resolucion?: string | null;
    bitrate?: number | null;
    latencia_modo?: string | null;
    audio_activo?: boolean | null;
  };
};

export type MomentoDestacado = {
  id_momento: number;
  id_canal: number;
  nombre_canal: string;
  titulo: string;
  descripcion?: string | null;
  url_video: string;
  thumbnail_url?: string | null;
  destacado: boolean;
  vistas_count: number;
  fecha_subida?: string | null;
  duracion?: string | null;
  canal?: Canal;
  stream?: {
    id_stream: number;
    titulo: string;
    estado: Stream["estado"];
    thumbnail_url?: string | null;
    viewer_count?: number;
  } | null;
};

export type StreamObsConfig = {
  id_stream: number;
  server: string;
  stream_key: string;
  ingest_url: string;
  playback_url: string;
  signal_status: Stream["signal_status"];
  last_signal_at?: string | null;
};

export type StreamSignalStatus = {
  id_stream: number;
  estado: Stream["estado"];
  signal_status: Stream["signal_status"];
  last_signal_at?: string | null;
  viewer_count: number;
};

export type ViewerCounterResponse = {
  id_stream: number;
  viewer_count: number;
  estado: Stream["estado"];
  viewer_key?: string;
  is_new_session?: boolean;
};

export type MomentoUploadResponse = {
  url: string;
  tipo: "video" | "miniatura";
  nombre_archivo: string;
  content_type: string;
  size: number;
};

type ApiListResponse<T> = {
  success: boolean;
  message: string;
  data: {
    count: number;
    results: T[];
  };
};

type ApiItemResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const UPLOAD_API_BASE = "http://localhost:8080/api";

function getUploadAccessToken(): string | null {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("token")
  );
}

async function parseUploadResponse<T>(
  response: Response,
  fallbackMessage: string
): Promise<T> {
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.message ||
        result?.error ||
        `${fallbackMessage}. HTTP ${response.status}`
    );
  }

  return result.data as T;
}

export async function getLiveStreams(): Promise<Stream[]> {
  const response = await apiRequest<ApiListResponse<Stream>>(
    "/streams/streams/en-vivo/"
  );

  return response.data.results;
}

export async function getFeaturedStreams(): Promise<Stream[]> {
  const response = await apiRequest<ApiListResponse<Stream>>(
    "/streams/streams/destacados/"
  );

  return response.data.results;
}

export async function getAllStreams(): Promise<Stream[]> {
  const response = await apiRequest<ApiListResponse<Stream>>(
    "/streams/streams/"
  );

  return response.data.results;
}

export async function getMyStreams(): Promise<Stream[]> {
  const response = await apiRequest<ApiListResponse<Stream>>(
    "/streams/streams/mis-streams/",
    {
      auth: true,
    }
  );

  return response.data.results;
}

export async function getCategories(): Promise<Categoria[]> {
  const response = await apiRequest<ApiListResponse<Categoria>>(
    "/streams/categorias/"
  );

  return response.data.results;
}

export async function getChannels(): Promise<Canal[]> {
  const response = await apiRequest<ApiListResponse<Canal>>(
    "/streams/canales/"
  );

  return response.data.results;
}

export async function getActiveChannels(): Promise<Canal[]> {
  const response = await apiRequest<ApiListResponse<Canal>>(
    "/streams/canales/activos/"
  );

  return response.data.results;
}

export async function getChannelById(id: number): Promise<Canal> {
  const response = await apiRequest<ApiItemResponse<Canal>>(
    `/streams/canales/${id}/`
  );

  return response.data;
}

export async function getStreamById(id: number): Promise<Stream> {
  const response = await apiRequest<ApiItemResponse<Stream>>(
    `/streams/streams/${id}/`
  );

  return response.data;
}

export async function getMyChannel(): Promise<{
  tiene_canal: boolean;
  canal: Canal | null;
}> {
  const response = await apiRequest<
    ApiItemResponse<{
      tiene_canal: boolean;
      canal: Canal | null;
    }>
  >("/streams/canales/mi-canal/", {
    auth: true,
  });

  return response.data;
}

export async function activateChannel(payload: {
  nombre_canal: string;
  tipo_canal: "streamer" | "podcaster";
  descripcion?: string;
}) {
  const response = await apiRequest<
    ApiItemResponse<{
      tiene_canal: boolean;
      canal: Canal;
    }>
  >("/streams/canales/activar/", {
    method: "POST",
    body: payload,
    auth: true,
  });

  return response.data;
}

export async function updateMyChannel(payload: {
  nombre_canal?: string;
  descripcion?: string | null;
  foto_canal?: string | null;
  banner_canal?: string | null;
}): Promise<Canal> {
  const response = await apiRequest<
    ApiItemResponse<{
      tiene_canal: boolean;
      canal: Canal;
    }>
  >("/streams/canales/mi-canal/actualizar/", {
    method: "PATCH",
    body: payload,
    auth: true,
  });

  return response.data.canal;
}

export async function uploadChannelImage(
  tipo: "foto" | "banner",
  file: File
): Promise<{
  tipo: "foto" | "banner";
  campo: "foto_canal" | "banner_canal";
  url: string;
  canal: Canal;
}> {
  const formData = new FormData();

  formData.append("tipo", tipo);
  formData.append("imagen", file);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = getUploadAccessToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${UPLOAD_API_BASE}/streams/canales/mi-canal/upload-image/`,
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  return parseUploadResponse<{
    tipo: "foto" | "banner";
    campo: "foto_canal" | "banner_canal";
    url: string;
    canal: Canal;
  }>(response, "No se pudo subir la imagen");
}

export async function createStream(payload: {
  titulo: string;
  descripcion?: string;
  id_categoria: number;
  destacado?: boolean;
  calidad_actual?: string;
  resolucion?: string;
  bitrate?: number;
  latencia_modo?: string;
  thumbnail_url?: string;
  audio_activo?: boolean;
}): Promise<Stream> {
  const response = await apiRequest<ApiItemResponse<Stream>>(
    "/streams/streams/crear/",
    {
      method: "POST",
      body: payload,
      auth: true,
    }
  );

  return response.data;
}

export async function updateStream(
  id: number,
  payload: {
    titulo?: string;
    descripcion?: string;
    id_categoria?: number;
    destacado?: boolean;
    calidad_actual?: string;
    resolucion?: string;
    bitrate?: number;
    latencia_modo?: string;
    audio_activo?: boolean;
    thumbnail_url?: string;
  }
): Promise<Stream> {
  const response = await apiRequest<ApiItemResponse<Stream>>(
    `/streams/streams/${id}/editar/`,
    {
      method: "PATCH",
      body: payload,
      auth: true,
    }
  );

  return response.data;
}

export async function startStream(id: number): Promise<Stream> {
  const response = await apiRequest<ApiItemResponse<Stream>>(
    `/streams/streams/${id}/iniciar/`,
    {
      method: "POST",
      auth: true,
    }
  );

  return response.data;
}

export async function finishStream(id: number): Promise<Stream> {
  const response = await apiRequest<ApiItemResponse<Stream>>(
    `/streams/streams/${id}/finalizar/`,
    {
      method: "POST",
      auth: true,
    }
  );

  return response.data;
}

export async function getStreamObsConfig(id: number): Promise<StreamObsConfig> {
  const response = await apiRequest<ApiItemResponse<StreamObsConfig>>(
    `/streams/streams/${id}/obs-config/`,
    {
      auth: true,
    }
  );

  return response.data;
}

export async function rotateStreamKey(id: number): Promise<StreamObsConfig> {
  const response = await apiRequest<ApiItemResponse<StreamObsConfig>>(
    `/streams/streams/${id}/rotate-key/`,
    {
      method: "POST",
      auth: true,
    }
  );

  return response.data;
}

export async function getStreamSignalStatus(
  id: number
): Promise<StreamSignalStatus> {
  const response = await apiRequest<ApiItemResponse<StreamSignalStatus>>(
    `/streams/streams/${id}/signal-status/`
  );

  return response.data;
}

export async function joinStreamViewer(
  id: number,
  viewerKey?: string | null
): Promise<ViewerCounterResponse> {
  const response = await apiRequest<ApiItemResponse<ViewerCounterResponse>>(
    `/streams/streams/${id}/viewer/join/`,
    {
      method: "POST",
      body: viewerKey ? { viewer_key: viewerKey } : {},
    }
  );

  return response.data;
}

export async function heartbeatStreamViewer(
  id: number,
  viewerKey: string
): Promise<ViewerCounterResponse> {
  const response = await apiRequest<ApiItemResponse<ViewerCounterResponse>>(
    `/streams/streams/${id}/viewer/heartbeat/`,
    {
      method: "POST",
      body: { viewer_key: viewerKey },
    }
  );

  return response.data;
}

export async function leaveStreamViewer(
  id: number,
  viewerKey?: string | null
): Promise<ViewerCounterResponse> {
  const response = await apiRequest<ApiItemResponse<ViewerCounterResponse>>(
    `/streams/streams/${id}/viewer/leave/`,
    {
      method: "POST",
      body: viewerKey ? { viewer_key: viewerKey } : {},
    }
  );

  return response.data;
}

export async function getMomentos(params?: {
  canal?: number;
  stream?: number;
  destacados?: boolean;
}): Promise<MomentoDestacado[]> {
  const query = new URLSearchParams();

  if (params?.canal) {
    query.set("canal", String(params.canal));
  }

  if (params?.stream) {
    query.set("stream", String(params.stream));
  }

  if (typeof params?.destacados === "boolean") {
    query.set("destacados", params.destacados ? "true" : "false");
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";

  const response = await apiRequest<ApiListResponse<MomentoDestacado>>(
    `/streams/momentos/${suffix}`
  );

  return response.data.results;
}

export async function getMyMomentos(): Promise<MomentoDestacado[]> {
  const response = await apiRequest<ApiListResponse<MomentoDestacado>>(
    "/streams/momentos/mis-momentos/",
    {
      auth: true,
    }
  );

  return response.data.results;
}

export async function getMomentoById(id: number): Promise<MomentoDestacado> {
  const response = await apiRequest<ApiItemResponse<MomentoDestacado>>(
    `/streams/momentos/${id}/`
  );

  return response.data;
}

export async function createMomento(payload: {
  titulo: string;
  descripcion?: string;
  url_video: string;
  thumbnail_url?: string;
  duracion?: string;
  id_stream?: number | null;
  destacado?: boolean;
}): Promise<MomentoDestacado> {
  const response = await apiRequest<ApiItemResponse<MomentoDestacado>>(
    "/streams/momentos/crear/",
    {
      method: "POST",
      body: payload,
      auth: true,
    }
  );

  return response.data;
}

export async function updateMomento(
  id: number,
  payload: {
    titulo?: string;
    descripcion?: string;
    url_video?: string;
    thumbnail_url?: string;
    duracion?: string;
    id_stream?: number | null;
    destacado?: boolean;
  }
): Promise<MomentoDestacado> {
  const response = await apiRequest<ApiItemResponse<MomentoDestacado>>(
    `/streams/momentos/${id}/editar/`,
    {
      method: "PATCH",
      body: payload,
      auth: true,
    }
  );

  return response.data;
}

export async function deleteMomento(id: number): Promise<{ id_momento: number }> {
  const response = await apiRequest<ApiItemResponse<{ id_momento: number }>>(
    `/streams/momentos/${id}/eliminar/`,
    {
      method: "DELETE",
      auth: true,
    }
  );

  return response.data;
}

export async function uploadMomentoMedia(
  tipo: "video" | "miniatura",
  archivo: File
): Promise<MomentoUploadResponse> {
  const formData = new FormData();

  formData.append("tipo", tipo);
  formData.append("archivo", archivo);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = getUploadAccessToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${UPLOAD_API_BASE}/streams/momentos/upload/`, {
    method: "POST",
    headers,
    body: formData,
  });

  return parseUploadResponse<MomentoUploadResponse>(
    response,
    "No se pudo subir el archivo"
  );
}