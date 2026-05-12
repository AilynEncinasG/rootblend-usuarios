export type PodcasterPodcast = {
  id: string;
  title: string;
  category: string;
  description: string;
  episodes: number;
  plays: string;
  status: "published" | "draft";
};

export type PodcasterEpisode = {
  id: string;
  podcastId: string;
  title: string;
  duration: string;
  status: "published" | "draft";
  date: string;
  plays: string;
  description: string;
};

export const podcasterPodcasts: PodcasterPodcast[] = [
  {
    id: "rootcast",
    title: "RootCast",
    category: "Tecnología",
    description: "Podcast sobre arquitectura, streaming, datos y producto.",
    episodes: 12,
    plays: "18.6K",
    status: "published",
  },
  {
    id: "neon-talks",
    title: "Neon Talks",
    category: "Gaming",
    description: "Conversaciones sobre gaming, comunidad y cultura digital.",
    episodes: 8,
    plays: "9.4K",
    status: "published",
  },
];

export const podcasterEpisodes: PodcasterEpisode[] = [
  {
    id: "episode-1",
    podcastId: "rootcast",
    title: "Arquitectura distribuida para streaming",
    duration: "34 min",
    status: "published",
    date: "2026-05-01",
    plays: "4.8K",
    description: "Gateway, microservicios, health checks y resiliencia.",
  },
  {
    id: "episode-2",
    podcastId: "rootcast",
    title: "Chat en tiempo real con Firebase",
    duration: "28 min",
    status: "published",
    date: "2026-04-24",
    plays: "3.2K",
    description: "Separación de mensajería en vivo del backend principal.",
  },
  {
    id: "episode-3",
    podcastId: "neon-talks",
    title: "Comunidades gamer y directos nocturnos",
    duration: "41 min",
    status: "draft",
    date: "2026-05-03",
    plays: "0",
    description: "Construcción de comunidad alrededor de streams y podcasts.",
  },
];

export function getPodcasterStats() {
  return {
    podcasts: podcasterPodcasts.length,
    episodes: podcasterEpisodes.length,
    publishedEpisodes: podcasterEpisodes.filter((item) => item.status === "published").length,
    draftEpisodes: podcasterEpisodes.filter((item) => item.status === "draft").length,
    totalPlays: "31.2K",
  };
}

export function getPodcasterPodcasts() {
  return podcasterPodcasts;
}

export function getPodcasterEpisodes() {
  return podcasterEpisodes;
}

export function getEpisodeById(id?: string) {
  if (!id) return podcasterEpisodes[0];

  return podcasterEpisodes.find((item) => item.id === id) || podcasterEpisodes[0];
}

export function getPodcastById(id?: string) {
  if (!id) return podcasterPodcasts[0];

  return podcasterPodcasts.find((item) => item.id === id) || podcasterPodcasts[0];
}