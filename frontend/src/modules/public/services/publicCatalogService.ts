export type PublicStreamCard = {
  id: string;
  title: string;
  channel: string;
  handle: string;
  category: string;
  viewers: string;
  tags: string[];
  description: string;
};

export type PublicCategoryCard = {
  id: string;
  name: string;
  description: string;
  viewers: string;
};

export type PublicChannelCard = {
  id: string;
  name: string;
  handle: string;
  description: string;
  category: string;
  followers: string;
};

export type PublicPodcastCard = {
  id: string;
  title: string;
  host: string;
  category: string;
  episodes: number;
  description: string;
};

export const publicStreams: PublicStreamCard[] = [
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077 — Ruta nocturna",
    channel: "NeonRunner",
    handle: "@neonrunner",
    category: "Gaming",
    viewers: "12.4K",
    tags: ["Gaming", "RPG", "En vivo"],
    description: "Gameplay, conversación y comunidad en tiempo real.",
  },
  {
    id: "lofi-coding",
    title: "Lo-fi coding session",
    channel: "CodeWave",
    handle: "@codewave",
    category: "Música",
    viewers: "3.8K",
    tags: ["Lo-fi", "Coding", "Focus"],
    description: "Sesión tranquila para estudiar, programar o trabajar.",
  },
  {
    id: "tech-news",
    title: "Noticias tech en directo",
    channel: "RootTech",
    handle: "@roottech",
    category: "Tecnología",
    viewers: "2.1K",
    tags: ["Tech", "Noticias", "Debate"],
    description: "Resumen de tecnología, IA, software y plataformas.",
  },
];

export const publicCategories: PublicCategoryCard[] = [
  {
    id: "gaming",
    name: "Gaming",
    description: "Directos, eSports, speedruns y comunidades gamer.",
    viewers: "18.2K",
  },
  {
    id: "musica",
    name: "Música",
    description: "Sesiones en vivo, podcasts musicales y audio continuo.",
    viewers: "9.5K",
  },
  {
    id: "tecnologia",
    name: "Tecnología",
    description: "Programación, IA, infraestructura y sistemas distribuidos.",
    viewers: "6.7K",
  },
  {
    id: "podcasts",
    name: "Podcasts",
    description: "Conversaciones, entrevistas, episodios y análisis.",
    viewers: "4.2K",
  },
];

export const publicChannels: PublicChannelCard[] = [
  {
    id: "neonrunner",
    name: "NeonRunner",
    handle: "@neonrunner",
    description: "Canal de gaming, RPGs, streams nocturnos y comunidad.",
    category: "Gaming",
    followers: "48K",
  },
  {
    id: "codewave",
    name: "CodeWave",
    handle: "@codewave",
    description: "Programación, productividad, música y sesiones de enfoque.",
    category: "Tecnología",
    followers: "21K",
  },
  {
    id: "roottech",
    name: "RootTech",
    handle: "@roottech",
    description: "Noticias tecnológicas, arquitectura y sistemas distribuidos.",
    category: "Tecnología",
    followers: "16K",
  },
];

export const publicPodcasts: PublicPodcastCard[] = [
  {
    id: "rootcast",
    title: "RootCast",
    host: "Equipo ROOTBLEND",
    category: "Tecnología",
    episodes: 12,
    description: "Podcast sobre arquitectura, streaming, datos y producto.",
  },
  {
    id: "neon-talks",
    title: "Neon Talks",
    host: "NeonRunner",
    category: "Gaming",
    episodes: 8,
    description: "Conversaciones sobre juegos, comunidad y cultura digital.",
  },
];

export function searchPublicCatalog(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return {
      streams: [],
      channels: [],
      categories: [],
      podcasts: [],
    };
  }

  return {
    streams: publicStreams.filter((item) =>
      `${item.title} ${item.channel} ${item.category} ${item.tags.join(" ")}`
        .toLowerCase()
        .includes(normalized)
    ),
    channels: publicChannels.filter((item) =>
      `${item.name} ${item.handle} ${item.category} ${item.description}`
        .toLowerCase()
        .includes(normalized)
    ),
    categories: publicCategories.filter((item) =>
      `${item.name} ${item.description}`.toLowerCase().includes(normalized)
    ),
    podcasts: publicPodcasts.filter((item) =>
      `${item.title} ${item.host} ${item.category} ${item.description}`
        .toLowerCase()
        .includes(normalized)
    ),
  };
}