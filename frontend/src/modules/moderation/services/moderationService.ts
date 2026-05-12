export type ModeratorItem = {
  id: string;
  name: string;
  handle: string;
  role: "owner" | "moderator";
  status: "active" | "pending";
  assignedAt: string;
};

export type ModerationIncident = {
  id: string;
  user: string;
  action: "delete_message" | "silence" | "block";
  reason: string;
  time: string;
  status: "open" | "resolved";
};

const MODERATORS_KEY = "rootblend:moderators";

const defaultModerators: ModeratorItem[] = [
  {
    id: "mod-1",
    name: "PixelKing",
    handle: "@pixelking",
    role: "moderator",
    status: "active",
    assignedAt: "2026-05-01",
  },
  {
    id: "mod-2",
    name: "LunaVibes",
    handle: "@lunavibes",
    role: "moderator",
    status: "active",
    assignedAt: "2026-05-03",
  },
];

export const moderationIncidents: ModerationIncident[] = [
  {
    id: "incident-1",
    user: "SpamBot99",
    action: "delete_message",
    reason: "Mensaje repetitivo en chat en vivo.",
    time: "Hace 3 min",
    status: "open",
  },
  {
    id: "incident-2",
    user: "ToxicUser",
    action: "silence",
    reason: "Lenguaje ofensivo durante el directo.",
    time: "Hace 12 min",
    status: "resolved",
  },
  {
    id: "incident-3",
    user: "RaidAccount",
    action: "block",
    reason: "Actividad sospechosa en múltiples mensajes.",
    time: "Hoy",
    status: "open",
  },
];

export function getModerators(): ModeratorItem[] {
  const raw = localStorage.getItem(MODERATORS_KEY);

  if (!raw) {
    return defaultModerators;
  }

  try {
    const parsed = JSON.parse(raw) as ModeratorItem[];

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return defaultModerators;
  } catch {
    return defaultModerators;
  }
}

export function saveModerators(moderators: ModeratorItem[]) {
  localStorage.setItem(MODERATORS_KEY, JSON.stringify(moderators));
}

export function addModerator(name: string) {
  const cleanName = name.trim();

  if (!cleanName) {
    return getModerators();
  }

  const nextModerator: ModeratorItem = {
    id: `mod-${Date.now()}`,
    name: cleanName,
    handle: `@${cleanName.toLowerCase().replace(/\s+/g, "")}`,
    role: "moderator",
    status: "pending",
    assignedAt: new Date().toISOString().slice(0, 10),
  };

  const next = [...getModerators(), nextModerator];
  saveModerators(next);

  return next;
}

export function removeModerator(id: string) {
  const next = getModerators().filter((moderator) => moderator.id !== id);
  saveModerators(next);

  return next;
}

export function getModerationStats() {
  const moderators = getModerators();

  return {
    moderators: moderators.length,
    activeModerators: moderators.filter((item) => item.status === "active").length,
    pendingModerators: moderators.filter((item) => item.status === "pending").length,
    openIncidents: moderationIncidents.filter((item) => item.status === "open").length,
    resolvedIncidents: moderationIncidents.filter((item) => item.status === "resolved").length,
  };
}

export function getIncidentById(id?: string) {
  if (!id) return moderationIncidents[0];

  return moderationIncidents.find((item) => item.id === id) || moderationIncidents[0];
}