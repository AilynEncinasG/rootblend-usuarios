export type AccountProfile = {
  id: string;
  displayName: string;
  email: string;
  bio: string;
  createdAt: string;
  lastAccess: string;
  status: string;
  followers: string;
  following: string;
  subscriptions: string;
};

const DEFAULT_PROFILE: AccountProfile = {
  id: "demo-user",
  displayName: "Usuario ROOTBLEND",
  email: "usuario@rootblend.dev",
  bio: "Cuenta demo para navegar ROOTBLEND, seguir canales, participar en chats y explorar podcasts.",
  createdAt: "2026-05-01",
  lastAccess: "Hoy",
  status: "Activo",
  followers: "128",
  following: "24",
  subscriptions: "6",
};

export function getStoredAccountProfile(): AccountProfile {
  const raw =
    localStorage.getItem("auth_user") ||
    localStorage.getItem("rootblend_user") ||
    localStorage.getItem("user");

  if (!raw) {
    return DEFAULT_PROFILE;
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return {
      ...DEFAULT_PROFILE,
      displayName:
        String(
          parsed.nombre_visible ||
            parsed.nombre ||
            parsed.username ||
            DEFAULT_PROFILE.displayName
        ),
      email: String(parsed.correo || parsed.email || DEFAULT_PROFILE.email),
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export const accountNotifications = [
  {
    id: "notif-1",
    title: "Nuevo stream recomendado",
    description: "NeonRunner inició un directo en Gaming.",
    time: "Hace 5 min",
  },
  {
    id: "notif-2",
    title: "Podcast publicado",
    description: "RootCast publicó un episodio sobre sistemas distribuidos.",
    time: "Hace 1 h",
  },
  {
    id: "notif-3",
    title: "Estado del sistema",
    description: "Todos los servicios principales respondieron correctamente.",
    time: "Hoy",
  },
];

export const accountSubscriptions = [
  {
    id: "sub-1",
    name: "NeonRunner",
    type: "Canal streamer",
    detail: "Gaming · 48K seguidores",
  },
  {
    id: "sub-2",
    name: "RootCast",
    type: "Podcast",
    detail: "Tecnología · 12 episodios",
  },
  {
    id: "sub-3",
    name: "CodeWave",
    type: "Canal técnico",
    detail: "Programación · sesiones focus",
  },
];

export const accountFollowing = [
  {
    id: "follow-1",
    name: "NeonRunner",
    handle: "@neonrunner",
    category: "Gaming",
  },
  {
    id: "follow-2",
    name: "CodeWave",
    handle: "@codewave",
    category: "Tecnología",
  },
  {
    id: "follow-3",
    name: "RootTech",
    handle: "@roottech",
    category: "Noticias tech",
  },
];