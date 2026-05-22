import { apiRequest } from "../../../services/apiClient";

export type PodcastCategory = {
  id_categoria_podcast: number;
  id: string;
  nombre: string;
  name: string;
  descripcion?: string | null;
  description?: string | null;
};

export type PodcastAudio = {
  id_archivo_audio?: number;
  nombre_archivo?: string;
  url_archivo?: string;
  url?: string;
  formato?: string;
  tamano_mb?: number | string | null;
};

export type PodcastEpisode = {
  id_episodio?: number;
  id: string;
  id_podcast?: number;
  podcastId?: string;
  podcastTitle?: string | null;
  titulo?: string;
  title: string;
  descripcion?: string | null;
  description: string;
  fecha_publicacion?: string | null;
  publishedAt: string;
  duracion?: string | null;
  duration: string;
  estado?: string;
  status?: "published" | "draft" | "deleted" | string;
  numero_episodio?: number | null;
  episodeNumber?: number | null;
  plays?: number | string;
  audio?: PodcastAudio | null;
};

export type PodcastItem = {
  id_podcast?: number;
  id: string;
  id_canal?: number;
  id_usuario_propietario?: number | null;
  id_categoria_podcast?: number;
  nombre?: string;
  title: string;
  host?: string;
  categoria?: PodcastCategory | null;
  category?: string | null;
  episodes: number;
  publishedEpisodes?: number;
  descripcion?: string | null;
  description: string;
  imagen_portada?: string | null;
  cover?: string | null;
  fecha_creacion?: string | null;
  createdAt?: string | null;
  estado?: string;
  status?: "published" | "draft" | string;
  latestEpisode?: string | null;
  plays?: number | string;
  episodeList: PodcastEpisode[];
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

export async function getPodcastCategories(): Promise<PodcastCategory[]> {
  const response = await apiRequest<ApiEnvelope<ApiList<PodcastCategory>>>(
    "/podcasts/categorias"
  );

  return response.data.results;
}

export async function getPodcasts(): Promise<PodcastItem[]> {
  const response = await apiRequest<ApiEnvelope<ApiList<PodcastItem>>>(
    "/podcasts/podcasts"
  );

  return response.data.results.map(normalizePodcast);
}

export async function getPodcastById(id?: string): Promise<PodcastItem | null> {
  if (!id) return null;

  const response = await apiRequest<ApiEnvelope<PodcastItem>>(
    `/podcasts/podcasts/${id}`
  );

  return normalizePodcast(response.data);
}

export async function getPodcastEpisodes(idPodcast: string | number): Promise<PodcastEpisode[]> {
  const response = await apiRequest<ApiEnvelope<ApiList<PodcastEpisode>>>(
    `/podcasts/podcasts/${idPodcast}/episodios`
  );

  return response.data.results.map(normalizeEpisode);
}

export async function playPodcastEpisode(idEpisode: string | number): Promise<PodcastEpisode> {
  const response = await apiRequest<ApiEnvelope<{ episode: PodcastEpisode }>>(
    `/podcasts/episodios/${idEpisode}/play`,
    {
      method: "POST",
      body: {
        tiempo_escuchado: "00:00:00",
        completado: false,
        dispositivo: "web",
      },
      auth: true,
    }
  );

  return normalizeEpisode(response.data.episode);
}
