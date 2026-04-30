import { apiRequest } from "./apiClient";

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
  descripcion?: string | null;
  foto_canal?: string | null;
  banner_canal?: string | null;
  estado_canal: "activo" | "inactivo";
  fecha_creacion?: string | null;
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
  canal: {
    id_canal: number;
    nombre_canal: string;
    id_usuario_propietario: number;
    tipo_canal: string;
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

export async function createStream(payload: {
  titulo: string;
  descripcion?: string;
  id_categoria: number;
  destacado?: boolean;
  calidad_actual?: string;
  resolucion?: string;
  bitrate?: number;
  latencia_modo?: string;
  audio_activo?: boolean;
}) {
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