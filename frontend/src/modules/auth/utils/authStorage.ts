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
  "user",
  "usuario",
  "currentUser",
  "profile",
];

export function getAccessToken(): string | null {
  for (const key of ACCESS_TOKEN_KEYS) {
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);

    if (value && value !== "undefined" && value !== "null") {
      return value;
    }
  }

  return null;
}

export function getRefreshToken(): string | null {
  for (const key of REFRESH_TOKEN_KEYS) {
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);

    if (value && value !== "undefined" && value !== "null") {
      return value;
    }
  }

  return null;
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function getStoredUser() {
  for (const key of AUTH_USER_KEYS) {
    const rawValue = localStorage.getItem(key) || sessionStorage.getItem(key);

    if (!rawValue) {
      continue;
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      return null;
    }
  }

  return null;
}

export function clearAuthStorage() {
  const allKeys = [
    ...ACCESS_TOKEN_KEYS,
    ...REFRESH_TOKEN_KEYS,
    ...AUTH_USER_KEYS,
  ];

  for (const key of allKeys) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  window.dispatchEvent(new Event("auth-changed"));
}