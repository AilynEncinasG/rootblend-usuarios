import { apiRequest } from "../../../../services/apiClient";
import type {
  PodcastCategory,
  PodcastEpisode,
  PodcastItem,
} from "../../../podcasts/services/podcastsCatalogService";

export type PodcasterPodcast = PodcastItem;
export type PodcasterEpisode = PodcastEpisode;

export type PodcasterStats = {
  podcasts: number;
  episodes: number;
  publishedEpisodes: number;
  draftEpisodes: number;
  totalPlays: number;
  playsByEpisode?: Array<{
    id_episodio: number;
    titulo: string;
    reproducciones: number | string;
  }>;
  devices?: Array<{
    dispositivo: string | null;
    total: number | string;
  }>;
};

export type PodcasterDashboard = {
  summary: PodcasterStats;
  podcasts: PodcastItem[];
  episodes: PodcastEpisode[];
};

export type PodcastHistoryItem = {
  id_historial: number;
  id: string;
  id_podcast: number;
  podcastTitle?: string | null;
  accion: string;
  action: string;
  detalle?: string | null;
  detail?: string | null;
  fecha_registro?: string | null;
  createdAt?: string | null;
};

export type PodcastPayload = {
  id_canal?: number;
  id_categoria_podcast?: number;
  nombre?: string;
  descripcion?: string;
  imagen_portada?: string;
  cover_url?: string;
  portada?: File | null;
  estado?: string;
};

export type EpisodePayload = {
  titulo?: string;
  descripcion?: string;
  duracion?: string;
  estado?: string;
  numero_episodio?: number;
  url_archivo?: string;
  audio_url?: string;
  youtube_url?: string;
  audio?: File | null;
  formato?: string;
  tamano_mb?: number;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type ApiList<T> = {
  count: number;
  results: T[];
};

function normalizePodcast(item: PodcastItem): PodcastItem {
  return {
    ...item,
    id: String(item.id_podcast ?? item.id),
    title: item.title || item.nombre || "Podcast sin nombre",
    description: item.description || item.descripcion || "Sin descripción.",
    category: item.category || item.categoria?.nombre || "Sin categoría",
    cover: item.cover || item.imagen_portada || null,
    latestEpisode: item.latestEpisode || null,
    plays: item.plays ?? 0,
    episodeList: item.episodeList || [],
  };
}

function normalizeEpisode(item: PodcastEpisode): PodcastEpisode {
  return {
    ...item,
    id: String(item.id_episodio ?? item.id),
    title: item.title || item.titulo || "Episodio sin título",
    description: item.description || item.descripcion || "Sin descripción.",
    publishedAt: item.publishedAt || item.fecha_publicacion || "Sin fecha",
    duration: item.duration || item.duracion || "00:00:00",
    plays: item.plays ?? 0,
  };
}

function hasFile(values: PodcastPayload | EpisodePayload): boolean {
  return Object.values(values).some((value) => value instanceof File);
}

function appendDefined(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, value instanceof File ? value : String(value));
}

function toPodcastBody(payload: PodcastPayload): PodcastPayload | FormData {
  if (!hasFile(payload)) return payload;

  const formData = new FormData();
  appendDefined(formData, "id_canal", payload.id_canal);
  appendDefined(formData, "id_categoria_podcast", payload.id_categoria_podcast);
  appendDefined(formData, "nombre", payload.nombre);
  appendDefined(formData, "descripcion", payload.descripcion);
  appendDefined(formData, "imagen_portada", payload.imagen_portada || payload.cover_url);
  appendDefined(formData, "portada", payload.portada);
  appendDefined(formData, "estado", payload.estado);
  return formData;
}

function toEpisodeBody(payload: EpisodePayload): EpisodePayload | FormData {
  if (!hasFile(payload)) return payload;

  const formData = new FormData();
  appendDefined(formData, "titulo", payload.titulo);
  appendDefined(formData, "descripcion", payload.descripcion);
  appendDefined(formData, "duracion", payload.duracion);
  appendDefined(formData, "estado", payload.estado);
  appendDefined(formData, "numero_episodio", payload.numero_episodio);
  appendDefined(formData, "url_archivo", payload.url_archivo || payload.audio_url);
  appendDefined(formData, "youtube_url", payload.youtube_url);
  appendDefined(formData, "audio", payload.audio);
  appendDefined(formData, "formato", payload.formato);
  appendDefined(formData, "tamano_mb", payload.tamano_mb);
  return formData;
}

export async function getPodcasterDashboard(): Promise<PodcasterDashboard> {
  const response = await apiRequest<ApiEnvelope<PodcasterDashboard>>(
    "/podcasts/me/dashboard",
    { auth: true }
  );

  return {
    summary: response.data.summary,
    podcasts: response.data.podcasts.map(normalizePodcast),
    episodes: response.data.episodes.map(normalizeEpisode),
  };
}

export async function getPodcasterStats(): Promise<PodcasterStats> {
  const response = await apiRequest<ApiEnvelope<PodcasterStats>>(
    "/podcasts/me/stats",
    { auth: true }
  );

  return response.data;
}

export async function getPodcasterPodcasts(): Promise<PodcasterPodcast[]> {
  const response = await apiRequest<ApiEnvelope<ApiList<PodcastItem>>>(
    "/podcasts/me/podcasts",
    { auth: true }
  );

  return response.data.results.map(normalizePodcast);
}

export async function getPodcasterEpisodes(): Promise<PodcasterEpisode[]> {
  const response = await apiRequest<ApiEnvelope<ApiList<PodcastEpisode>>>(
    "/podcasts/me/episodios",
    { auth: true }
  );

  return response.data.results.map(normalizeEpisode);
}

export async function getPodcasterHistory(): Promise<PodcastHistoryItem[]> {
  const response = await apiRequest<ApiEnvelope<ApiList<PodcastHistoryItem>>>(
    "/podcasts/me/historial",
    { auth: true }
  );

  return response.data.results;
}

export async function createPodcast(payload: PodcastPayload & { id_canal: number; id_categoria_podcast: number; nombre: string }): Promise<PodcastItem> {
  const response = await apiRequest<ApiEnvelope<PodcastItem>>(
    "/podcasts/podcasts",
    {
      method: "POST",
      body: toPodcastBody(payload),
      auth: true,
    }
  );

  return normalizePodcast(response.data);
}

export async function updatePodcast(
  idPodcast: string | number,
  payload: PodcastPayload
): Promise<PodcastItem> {
  const body = toPodcastBody(payload);
  const response = await apiRequest<ApiEnvelope<PodcastItem>>(
    `/podcasts/podcasts/${idPodcast}`,
    {
      method: body instanceof FormData ? "POST" : "PATCH",
      body,
      auth: true,
    }
  );

  return normalizePodcast(response.data);
}

export async function createEpisode(
  idPodcast: string | number,
  payload: EpisodePayload & { titulo: string }
): Promise<PodcastEpisode> {
  const response = await apiRequest<ApiEnvelope<PodcastEpisode>>(
    `/podcasts/podcasts/${idPodcast}/episodios`,
    {
      method: "POST",
      body: toEpisodeBody(payload),
      auth: true,
    }
  );

  return normalizeEpisode(response.data);
}

export async function updateEpisode(
  idEpisode: string | number,
  payload: EpisodePayload
): Promise<PodcastEpisode> {
  const body = toEpisodeBody(payload);
  const response = await apiRequest<ApiEnvelope<PodcastEpisode>>(
    `/podcasts/episodios/${idEpisode}`,
    {
      method: body instanceof FormData ? "POST" : "PATCH",
      body,
      auth: true,
    }
  );

  return normalizeEpisode(response.data);
}

export async function deleteEpisode(idEpisode: string | number): Promise<PodcastEpisode> {
  const response = await apiRequest<ApiEnvelope<PodcastEpisode>>(
    `/podcasts/episodios/${idEpisode}`,
    {
      method: "DELETE",
      auth: true,
    }
  );

  return normalizeEpisode(response.data);
}

export async function getPodcastCategoriesForCreator(): Promise<PodcastCategory[]> {
  const response = await apiRequest<ApiEnvelope<ApiList<PodcastCategory>>>(
    "/podcasts/categorias"
  );

  return response.data.results;
}
