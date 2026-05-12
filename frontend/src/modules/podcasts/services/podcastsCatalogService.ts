export type PodcastEpisode = {
  id: string;
  title: string;
  duration: string;
  publishedAt: string;
  description: string;
};

export type PodcastItem = {
  id: string;
  title: string;
  host: string;
  category: string;
  episodes: number;
  description: string;
  cover?: string;
  latestEpisode: string;
  episodeList: PodcastEpisode[];
};

export const podcastsCatalog: PodcastItem[] = [
  {
    id: "rootcast",
    title: "RootCast",
    host: "Equipo ROOTBLEND",
    category: "Tecnología",
    episodes: 12,
    latestEpisode: "Arquitectura distribuida para streaming",
    description:
      "Conversaciones sobre arquitectura, backend, datos, streaming y producto dentro de ROOTBLEND.",
    episodeList: [
      {
        id: "rootcast-01",
        title: "Arquitectura distribuida para streaming",
        duration: "34 min",
        publishedAt: "2026-05-01",
        description:
          "Gateway, microservicios, health checks, desacoplamiento y resiliencia en ROOTBLEND.",
      },
      {
        id: "rootcast-02",
        title: "Chat en tiempo real con Firebase",
        duration: "28 min",
        publishedAt: "2026-04-24",
        description:
          "Cómo separar mensajería en vivo del backend principal sin bloquear la experiencia.",
      },
      {
        id: "rootcast-03",
        title: "Diseño de datos para canales y podcasts",
        duration: "31 min",
        publishedAt: "2026-04-17",
        description:
          "Relaciones entre usuarios, canales, streams, episodios, interacciones y estadísticas.",
      },
    ],
  },
  {
    id: "neon-talks",
    title: "Neon Talks",
    host: "NeonRunner",
    category: "Gaming",
    episodes: 8,
    latestEpisode: "Comunidades gamer y directos nocturnos",
    description:
      "Podcast sobre gaming, cultura digital, comunidades en vivo y creación de contenido.",
    episodeList: [
      {
        id: "neon-talks-01",
        title: "Comunidades gamer y directos nocturnos",
        duration: "41 min",
        publishedAt: "2026-05-03",
        description:
          "Cómo construir comunidad alrededor de streams, moderación y eventos recurrentes.",
      },
      {
        id: "neon-talks-02",
        title: "Del directo al episodio",
        duration: "26 min",
        publishedAt: "2026-04-26",
        description:
          "Reutilización de contenido en vivo para clips, episodios y highlights.",
      },
    ],
  },
  {
    id: "codewave-audio",
    title: "CodeWave Audio",
    host: "CodeWave",
    category: "Programación",
    episodes: 15,
    latestEpisode: "Productividad para devs con música y focus",
    description:
      "Sesiones y charlas sobre programación, hábitos de estudio, productividad y herramientas.",
    episodeList: [
      {
        id: "codewave-01",
        title: "Productividad para devs con música y focus",
        duration: "37 min",
        publishedAt: "2026-05-06",
        description:
          "Métodos para estudiar, programar y crear contenido técnico sin perder concentración.",
      },
      {
        id: "codewave-02",
        title: "Cómo explicar sistemas distribuidos",
        duration: "33 min",
        publishedAt: "2026-04-29",
        description:
          "Ideas para presentar gateway, servicios, fallos parciales y observabilidad.",
      },
    ],
  },
];

export function getPodcasts() {
  return podcastsCatalog;
}

export function getPodcastById(id?: string) {
  if (!id) return podcastsCatalog[0];

  return podcastsCatalog.find((podcast) => podcast.id === id) || podcastsCatalog[0];
}