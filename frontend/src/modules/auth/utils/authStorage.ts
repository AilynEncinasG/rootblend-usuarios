const ACCESS_TOKEN_KEYS = [
  "access_token",
  "token",
  "access",
  "jwt",
  "authToken",
  "session_token",
];

const REFRESH_TOKEN_KEYS = ["refresh_token", "refresh"];

const AUTH_USER_KEYS = [
  "auth_user",
  "rootblend_user",
  "user",
  "usuario",
  "currentUser",
  "profile",
];

const EXTRA_SESSION_KEYS = [
  "creator_role",
  "rootblend_last_stream_id",
  "rootblend_current_stream",
  "rootblend_current_channel",
  "rootblend_moderation_channel",
  "rootblend_moderation_stream",
  "rootblend_chat_user",
];

export type StoredAuthUser = {
  id_usuario?: number;
  id?: number;
  correo?: string;
  email?: string;
  estado?: string;
  nombre_visible?: string;
  nombre?: string;
  username?: string;
  foto_perfil?: string | null;
};

function isValidStoredValue(value: string | null): value is string {
  return Boolean(
    value &&
      value !== "undefined" &&
      value !== "null" &&
      value.trim() !== ""
  );
}

export function getAccessToken(): string | null {
  for (const key of ACCESS_TOKEN_KEYS) {
    const persistentValue = localStorage.getItem(key);
    const sessionValue = sessionStorage.getItem(key);
    const value = persistentValue || sessionValue;

    if (isValidStoredValue(value)) {
      if (value.startsWith("mock_")) {
        queueMicrotask(clearAuthStorage);
        return null;
      }

      if (!persistentValue && sessionValue) {
        localStorage.setItem(key, sessionValue);
      }

      return value;
    }
  }

  return null;
}

export function getRefreshToken(): string | null {
  for (const key of REFRESH_TOKEN_KEYS) {
    const persistentValue = localStorage.getItem(key);
    const sessionValue = sessionStorage.getItem(key);
    const value = persistentValue || sessionValue;

    if (isValidStoredValue(value)) {
      if (!persistentValue && sessionValue) {
        localStorage.setItem(key, sessionValue);
      }

      return value;
    }
  }

  return null;
}

export function getStoredUser(): StoredAuthUser | null {
  for (const key of AUTH_USER_KEYS) {
    const persistentValue = localStorage.getItem(key);
    const sessionValue = sessionStorage.getItem(key);
    const rawValue = persistentValue || sessionValue;

    if (!isValidStoredValue(rawValue)) {
      continue;
    }

    try {
      if (!persistentValue && sessionValue) {
        localStorage.setItem(key, sessionValue);
      }

      return JSON.parse(rawValue) as StoredAuthUser;
    } catch {
      continue;
    }
  }

  return null;
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function saveAuthStorage(data: {
  accessToken: string;
  refreshToken?: string;
  user?: StoredAuthUser;
}) {
  clearAuthStorage(false);

  localStorage.setItem("access_token", data.accessToken);

  if (data.refreshToken) {
    localStorage.setItem("refresh_token", data.refreshToken);
  }

  if (data.user) {
    const serializedUser = JSON.stringify(data.user);
    localStorage.setItem("auth_user", serializedUser);
    localStorage.setItem("rootblend_user", serializedUser);
  }

  notifyAuthChanged();
}

export function updateStoredUser(nextUser: StoredAuthUser) {
  const currentUser = getStoredUser() || {};
  const mergedUser = {
    ...currentUser,
    ...nextUser,
  };

  const serializedUser = JSON.stringify(mergedUser);
  localStorage.setItem("auth_user", serializedUser);
  localStorage.setItem("rootblend_user", serializedUser);

  notifyAuthChanged();
}

export function clearAuthStorage(removeExtraSessionKeys = true) {
  const allKeys = [
    ...ACCESS_TOKEN_KEYS,
    ...REFRESH_TOKEN_KEYS,
    ...AUTH_USER_KEYS,
  ];

  if (removeExtraSessionKeys) {
    allKeys.push(...EXTRA_SESSION_KEYS);
  }

  for (const key of allKeys) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  notifyAuthChanged();
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event("auth-changed"));
  window.dispatchEvent(new Event("auth-session-changed"));
  window.dispatchEvent(new Event("storage"));
}