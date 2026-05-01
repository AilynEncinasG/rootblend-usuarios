import logo from "../../assets/Logo.png";
import fondo from "../../assets/Fondo.png";
import cover from "../../assets/mockups/mockup_01.png";
import publicHome from "../../assets/mockups/mockup_03.jpg";
import exploreStreams from "../../assets/mockups/mockup_04.jpg";
import categoriesView from "../../assets/mockups/mockup_06.jpg";
import channelView from "../../assets/mockups/mockup_07.jpg";
import streamView from "../../assets/mockups/mockup_08.jpg";
import streamChat from "../../assets/mockups/mockup_09.jpg";
import podcastsView from "../../assets/mockups/mockup_11.jpg";
import loginView from "../../assets/mockups/mockup_14.jpg";
import streamerPanel from "../../assets/mockups/mockup_26.jpg";
import streamControl from "../../assets/mockups/mockup_28.jpg";
import podcasterPanel from "../../assets/mockups/mockup_36.jpg";
import podcastStats from "../../assets/mockups/mockup_41.jpg";
import serviceDown from "../../assets/mockups/mockup_51.jpg";
import statusPanel from "../../assets/mockups/mockup_56.jpg";
import moderationPanel from "../../assets/mockups/mockup_65.jpg";

export type Category = {
  id: string;
  name: string;
  icon: string;
  viewers: string;
  color: string;
  image: string;
};

export type StreamItem = {
  id: string;
  title: string;
  channel: string;
  handle: string;
  category: string;
  viewers: string;
  avatar: string;
  image: string;
  tags: string[];
  description: string;
};

export type PodcastEpisode = {
  id: string;
  title: string;
  duration: string;
  plays: string;
};

export type PodcastItem = {
  id: string;
  title: string;
  creator: string;
  category: string;
  image: string;
  duration: string;
  episodes: PodcastEpisode[];
};

export type ChatMessage = {
  id: string;
  user: string;
  badge?: string;
  text: string;
  time: string;
  color: string;
};

export type ServiceStatus = {
  name: string;
  type: string;
  status: "Operativo" | "Degradado" | "Caido";
  latency: string;
  lastCheck: string;
};

export const brandAssets = {
  logo,
  fondo,
  cover,
  publicHome,
  exploreStreams,
  categoriesView,
  channelView,
  streamView,
  streamChat,
  podcastsView,
  loginView,
  streamerPanel,
  streamControl,
  podcasterPanel,
  podcastStats,
  serviceDown,
  statusPanel,
  moderationPanel,
};

export const categories: Category[] = [
  {
    id: "gaming",
    name: "Gaming",
    icon: "game",
    viewers: "12.4K",
    color: "#00e5ff",
    image: exploreStreams,
  },
  {
    id: "music",
    name: "Musica",
    icon: "music",
    viewers: "8.7K",
    color: "#ff5bd6",
    image: publicHome,
  },
  {
    id: "talks",
    name: "Charlas",
    icon: "chat",
    viewers: "6.1K",
    color: "#8b5cf6",
    image: streamChat,
  },
  {
    id: "tech",
    name: "Tecnologia",
    icon: "code",
    viewers: "4.9K",
    color: "#22c55e",
    image: categoriesView,
  },
  {
    id: "sports",
    name: "Deportes",
    icon: "bolt",
    viewers: "3.8K",
    color: "#f59e0b",
    image: channelView,
  },
  {
    id: "podcasts",
    name: "Podcasts",
    icon: "mic",
    viewers: "2.8K",
    color: "#a855f7",
    image: podcastsView,
  },
];

export const streams: StreamItem[] = [
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077: Phantom Liberty",
    channel: "PixelNate",
    handle: "@pixelnate",
    category: "Gaming",
    viewers: "5.2K",
    avatar: "PN",
    image: streamView,
    tags: ["Aventura", "Competitivo", "Espanol"],
    description:
      "Noche de misiones, caos total y decisiones raras en Night City.",
  },
  {
    id: "ranked-valorant",
    title: "Rankeds con subs! Vamos por la W",
    channel: "AriGamez",
    handle: "@arigamez",
    category: "Videojuegos",
    viewers: "1.3K",
    avatar: "AG",
    image: exploreStreams,
    tags: ["Valorant", "FPS", "Ranked"],
    description:
      "Partidas competitivas con la comunidad y clutchs imposibles.",
  },
  {
    id: "lofi-beats",
    title: "Lo-fi beats & chill",
    channel: "LunaVibes",
    handle: "@lunavibes",
    category: "Musica",
    viewers: "3.1K",
    avatar: "LV",
    image: publicHome,
    tags: ["Musica", "Chill", "Chat"],
    description:
      "Sesion tranquila con pedidos del chat y visuales neon.",
  },
  {
    id: "tech-talk",
    title: "IA, futuro y el impacto en la sociedad",
    channel: "TechNova",
    handle: "@technova",
    category: "Tecnologia",
    viewers: "912",
    avatar: "TN",
    image: categoriesView,
    tags: ["IA", "Debate", "Noticias"],
    description:
      "Charlamos sobre tecnologia sin perder el hilo humano.",
  },
  {
    id: "roulette-live",
    title: "Ruleta en vivo | A por el millon",
    channel: "DrakoLive",
    handle: "@drakolive",
    category: "Juego de azar",
    viewers: "2.7K",
    avatar: "DL",
    image: channelView,
    tags: ["Casino", "Directo", "Retos"],
    description:
      "Entretenimiento en vivo con reglas claras y reaccion del chat.",
  },
  {
    id: "sports-final",
    title: "EN VIVO: final de la copa mundial",
    channel: "GolazoTV",
    handle: "@golazotv",
    category: "Deportes",
    viewers: "4.4K",
    avatar: "GT",
    image: streamChat,
    tags: ["Futbol", "Analisis", "Directo"],
    description:
      "Narracion, previa, estadisticas y debate con la comunidad.",
  },
];

export const podcasts: PodcastItem[] = [
  {
    id: "fuera-orbita",
    title: "Fuera de Orbita",
    creator: "Ciencia y tecnologia",
    category: "Ciencia",
    image: podcastsView,
    duration: "58:21",
    episodes: [
      {
        id: "ep-42",
        title: "El futuro de la IA generativa",
        duration: "58:21",
        plays: "24.5K",
      },
      {
        id: "ep-41",
        title: "Computacion cuantica sin humo",
        duration: "44:09",
        plays: "12.1K",
      },
      {
        id: "ep-40",
        title: "Cohetes reutilizables y nuevos mundos",
        duration: "51:33",
        plays: "9.8K",
      },
    ],
  },
  {
    id: "hablemos-sin-filtro",
    title: "Hablemos Sin Filtro",
    creator: "Conversaciones",
    category: "Charla",
    image: publicHome,
    duration: "47:09",
    episodes: [
      {
        id: "ep-15",
        title: "Salud mental en la era digital",
        duration: "47:09",
        plays: "8.9K",
      },
      {
        id: "ep-14",
        title: "Amistad, limites y redes",
        duration: "39:10",
        plays: "7.2K",
      },
    ],
  },
  {
    id: "retro-level",
    title: "Retro Level",
    creator: "Videojuegos",
    category: "Gaming",
    image: exploreStreams,
    duration: "1:03:14",
    episodes: [
      {
        id: "ep-88",
        title: "Los mejores RPG de los 90",
        duration: "1:03:14",
        plays: "11.4K",
      },
      {
        id: "ep-87",
        title: "Arcades que marcaron epoca",
        duration: "52:45",
        plays: "6.3K",
      },
    ],
  },
  {
    id: "negocios-accion",
    title: "Negocios en Accion",
    creator: "Emprendimiento",
    category: "Negocios",
    image: categoriesView,
    duration: "43:18",
    episodes: [
      {
        id: "ep-26",
        title: "Escalar tu startup en 2026",
        duration: "43:18",
        plays: "5.8K",
      },
    ],
  },
];

export const recommendedChannels = [
  {
    name: "PixelNate",
    subtitle: "Just Chatting",
    viewers: "5.2K",
    avatar: "PN",
  },
  {
    name: "LunaVibes",
    subtitle: "Musica",
    viewers: "3.1K",
    avatar: "LV",
  },
  {
    name: "DrakoLive",
    subtitle: "Juego de azar",
    viewers: "2.7K",
    avatar: "DL",
  },
  {
    name: "TechNova",
    subtitle: "Tecnologia",
    viewers: "1.9K",
    avatar: "TN",
  },
  {
    name: "AriGamez",
    subtitle: "Fortnite",
    viewers: "1.3K",
    avatar: "AG",
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "1",
    user: "LunaVibes",
    badge: "VIP",
    text: "Buenas dias a todos!",
    time: "23:12",
    color: "#ff5bd6",
  },
  {
    id: "2",
    user: "GamerX",
    badge: "MOD",
    text: "Eso estuvo buenisimo",
    time: "23:13",
    color: "#00e5ff",
  },
  {
    id: "3",
    user: "ToxicUser",
    text: "Mensaje marcado para moderacion",
    time: "23:13",
    color: "#fb7185",
  },
  {
    id: "4",
    user: "ChatKing",
    text: "Vamos por otra ronda!",
    time: "23:14",
    color: "#22c55e",
  },
  {
    id: "5",
    user: "PixelQueen",
    text: "La musica esta brutal",
    time: "23:15",
    color: "#f59e0b",
  },
];

export const notifications = [
  {
    title: "PixelNate ha iniciado un directo",
    meta: "Hace 2 min",
    accent: "#00e5ff",
  },
  {
    title: "LunaVibes publico un episodio",
    meta: "Hace 15 min",
    accent: "#ff5bd6",
  },
  {
    title: "TechNova respondio tu comentario",
    meta: "Ayer",
    accent: "#22c55e",
  },
  {
    title: "Tu suscripcion se renovo",
    meta: "Hace 1 dia",
    accent: "#8b5cf6",
  },
];

export const serviceStatuses: ServiceStatus[] = [
  {
    name: "usuarios-service",
    type: "Django",
    status: "Operativo",
    latency: "130 ms",
    lastCheck: "Hace 10 seg",
  },
  {
    name: "canales-streaming-service",
    type: "Django",
    status: "Operativo",
    latency: "98 ms",
    lastCheck: "Hace 10 seg",
  },
  {
    name: "estadisticas-service",
    type: "Django",
    status: "Degradado",
    latency: "--",
    lastCheck: "Hace 30 seg",
  },
  {
    name: "podcasts-service",
    type: "Laravel",
    status: "Operativo",
    latency: "110 ms",
    lastCheck: "Hace 9 seg",
  },
  {
    name: "interacciones-service",
    type: "Laravel",
    status: "Operativo",
    latency: "105 ms",
    lastCheck: "Hace 9 seg",
  },
  {
    name: "chat en vivo",
    type: "Firebase",
    status: "Operativo",
    latency: "Real-time",
    lastCheck: "En linea",
  },
  {
    name: "gateway",
    type: "Nginx",
    status: "Operativo",
    latency: "45 ms",
    lastCheck: "Hace 5 seg",
  },
  {
    name: "rabbitmq",
    type: "Middleware",
    status: "Operativo",
    latency: "67 ms",
    lastCheck: "Hace 11 seg",
  },
];

export const stats = [
  { label: "Vistas totales", value: "24.5K", trend: "+12.4%" },
  { label: "Horas vistas", value: "8.7K", trend: "+21.1%" },
  { label: "Episodios", value: "24", trend: "+2" },
  { label: "Duracion promedio", value: "48m 32s", trend: "+6.2%" },
];

export const moderationRows = [
  {
    user: "ToxicUser",
    type: "Silenciado",
    reason: "Faltas de respeto",
    date: "23/06/2026",
    status: "Activo",
  },
  {
    user: "SpamBot",
    type: "Bloqueado",
    reason: "Spam",
    date: "24/06/2026",
    status: "Activo",
  },
  {
    user: "BadUser123",
    type: "Silenciado",
    reason: "Lenguaje inapropiado",
    date: "15/06/2026",
    status: "Expira pronto",
  },
  {
    user: "HateSpeech",
    type: "Bloqueado",
    reason: "Discurso de odio",
    date: "30/06/2026",
    status: "Activo",
  },
];
