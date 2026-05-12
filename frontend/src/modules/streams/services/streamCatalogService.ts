export type StreamCatalogItem = {
  id: string;
  title: string;
  channel: string;
  handle: string;
  category: string;
  viewers: string;
  status: "live" | "scheduled" | "finished";
  quality: string;
  description: string;
  tags: string[];
};

export const streamCatalog: StreamCatalogItem[] = [
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077 — Ruta nocturna",
    channel: "NeonRunner",
    handle: "@neonrunner",
    category: "Gaming",
    viewers: "12.4K",
    status: "live",
    quality: "1080p",
    description:
      "Gameplay en vivo, conversación con la comunidad y pruebas de chat en tiempo real.",
    tags: ["Gaming", "RPG", "En vivo", "Chat"],
  },
  {
    id: "lofi-coding",
    title: "Lo-fi coding session",
    channel: "CodeWave",
    handle: "@codewave",
    category: "Música",
    viewers: "3.8K",
    status: "live",
    quality: "720p",
    description:
      "Sesión tranquila de música y programación para estudiar o trabajar.",
    tags: ["Lo-fi", "Coding", "Focus"],
  },
  {
    id: "tech-news",
    title: "Noticias tech en directo",
    channel: "RootTech",
    handle: "@roottech",
    category: "Tecnología",
    viewers: "2.1K",
    status: "scheduled",
    quality: "1080p",
    description:
      "Resumen de tecnología, IA, software, infraestructura y plataformas.",
    tags: ["Tech", "Noticias", "Debate"],
  },
];

export function getStreams() {
  return streamCatalog;
}

export function getLiveStreams() {
  return streamCatalog.filter((stream) => stream.status === "live");
}

export function getStreamById(id?: string) {
  if (!id) return streamCatalog[0];

  return streamCatalog.find((stream) => stream.id === id) || streamCatalog[0];
}

export function getRelatedStreams(currentId?: string) {
  return streamCatalog.filter((stream) => stream.id !== currentId).slice(0, 3);
}