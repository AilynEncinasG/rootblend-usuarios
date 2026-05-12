import {
  brandAssets,
  podcasts,
  streams,
  type Category,
  type StreamItem,
} from "../mock/rootblendMock";
import { getStoredUser } from "../../modules/auth/utils/authStorage";
import {
  type Stream as BackendStream,
  type Categoria as BackendCategory,
  type Canal as BackendCanal,
} from "../../modules/streams/services/streamsService";

export function formatApiError(errors: unknown, fallback: string) {
  if (!errors || typeof errors !== "object") {
    return fallback;
  }

  const firstValue = Object.values(errors as Record<string, unknown>)[0];

  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return String(firstValue[0]);
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return fallback;
}

export function getInitials(value?: string | null) {
  const clean = String(value || "").trim();

  if (!clean) {
    return "RB";
  }

  return (
    clean
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "RB"
  );
}

export function backendStreamToCard(stream: BackendStream): StreamItem {
  return {
    id: String(stream.id_stream),
    title: stream.titulo,
    channel: stream.canal.nombre_canal,
    handle: `@${stream.canal.nombre_canal.toLowerCase().replace(/\s+/g, "")}`,
    category: stream.categoria.nombre,
    viewers: `${stream.viewer_count || 0}`,
    avatar: getInitials(stream.canal.nombre_canal),
    image: brandAssets.streamView,
    tags: [
      stream.categoria.nombre,
      stream.configuracion?.resolucion || "720p",
      stream.estado === "en_vivo" ? "En vivo" : stream.estado,
    ],
    description:
      stream.descripcion ||
      "Este stream todavía no tiene descripción configurada.",
  };
}

export function backendCategoryToCard(
  category: BackendCategory,
  liveStreams: StreamItem[]
): Category {
  const activeCount = liveStreams.filter(
    (stream) => stream.category === category.nombre
  ).length;

  return {
    id: String(category.id_categoria),
    name: category.nombre,
    icon: "grid",
    viewers: String(activeCount),
    color: "#00e5ff",
    image: brandAssets.categoriesView,
  };
}

export function backendChannelToCard(channel: BackendCanal) {
  return {
    name: channel.nombre_canal,
    subtitle: channel.tipo_canal.nombre_tipo,
    viewers: "0",
    avatar: getInitials(channel.nombre_canal),
    id: String(channel.id_canal),
  };
}

export function getUserLabel() {
  const stored = getStoredUser() as { nombre_visible?: string; correo?: string } | null;
  return stored?.nombre_visible || stored?.correo || "usuario_123";
}

export function firstStream() {
  return streams[0];
}

export function firstPodcast() {
  return podcasts[0];
}

export function formatDate(value?: string | null) {
  if (!value) return "Sin fecha registrada";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("es-BO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export const CREATOR_ROLE_KEY = "creator_role";
const MODERATORS_KEY = "rootblend:moderators:cyberpunk-2077";

export type CreatorRole = "streamer" | "podcaster";

export function getCreatorRole(): CreatorRole | null {
  const role = localStorage.getItem(CREATOR_ROLE_KEY);
  return role === "streamer" || role === "podcaster" ? role : null;
}

export function setCreatorRole(role: CreatorRole) {
  localStorage.setItem(CREATOR_ROLE_KEY, role);
  window.dispatchEvent(new Event("creator-role-changed"));
}

export function getModerators() {
  const stored = localStorage.getItem(MODERATORS_KEY);

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return ["GamerX", "PixelKing", "LunaVibes"];
    }
  }

  return ["GamerX", "PixelKing", "LunaVibes"];
}

export function saveModerators(moderators: string[]) {
  localStorage.setItem(MODERATORS_KEY, JSON.stringify(moderators));
}
