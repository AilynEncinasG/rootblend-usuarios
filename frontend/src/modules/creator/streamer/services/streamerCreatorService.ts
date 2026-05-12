export type StreamerStream = {
  id: string;
  title: string;
  status: "live" | "scheduled" | "finished";
  viewers: string;
  category: string;
  date: string;
};

export type HighlightItem = {
  id: string;
  title: string;
  streamTitle: string;
  duration: string;
  views: string;
};

export const streamerStreams: StreamerStream[] = [
  {
    id: "stream-1",
    title: "Cyberpunk 2077 — Ruta nocturna",
    status: "live",
    viewers: "12.4K",
    category: "Gaming",
    date: "Hoy",
  },
  {
    id: "stream-2",
    title: "Lo-fi coding session",
    status: "scheduled",
    viewers: "0",
    category: "Música",
    date: "Mañana",
  },
  {
    id: "stream-3",
    title: "Noticias tech en directo",
    status: "finished",
    viewers: "2.1K",
    category: "Tecnología",
    date: "Ayer",
  },
];

export const streamerHighlights: HighlightItem[] = [
  {
    id: "highlight-1",
    title: "Mejor momento del directo",
    streamTitle: "Cyberpunk 2077 — Ruta nocturna",
    duration: "00:42",
    views: "8.2K",
  },
  {
    id: "highlight-2",
    title: "Clip de reacción del chat",
    streamTitle: "Lo-fi coding session",
    duration: "01:10",
    views: "3.4K",
  },
];

export function getStreamerStats() {
  const totalStreams = streamerStreams.length;
  const liveStreams = streamerStreams.filter((item) => item.status === "live").length;
  const scheduledStreams = streamerStreams.filter((item) => item.status === "scheduled").length;
  const finishedStreams = streamerStreams.filter((item) => item.status === "finished").length;

  return {
    totalStreams,
    liveStreams,
    scheduledStreams,
    finishedStreams,
    totalViewers: "14.5K",
    followers: "48K",
    highlights: streamerHighlights.length,
  };
}

export function getStreamerStreams() {
  return streamerStreams;
}

export function getStreamerHighlights() {
  return streamerHighlights;
}

export function getHighlightById(id?: string) {
  if (!id) return streamerHighlights[0];

  return streamerHighlights.find((item) => item.id === id) || streamerHighlights[0];
}