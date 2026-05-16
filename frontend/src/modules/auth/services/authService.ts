import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  saveAuthStorage,
  updateStoredUser,
  type StoredAuthUser,
} from "../utils/authStorage";

const RAW_API_BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api";

function normalizeApiBase(value: string) {
  const cleanValue = value.replace(/\/+$/, "");
  return cleanValue.endsWith("/api") ? cleanValue : `${cleanValue}/api`;
}

export const API_BASE = normalizeApiBase(RAW_API_BASE);

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | unknown;
};

export type AuthUser = {
  id_usuario: number;
  correo: string;
  estado: string;
  nombre_visible?: string;
  foto_perfil?: string | null;
};

export type LoginData = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  usuario: AuthUser;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

type NormalizableUser = StoredAuthUser &
  Partial<AuthUser> & {
    id?: number;
    email?: string;
    nombre?: string;
    username?: string;
  };

function normalizeUser(user: StoredAuthUser | AuthUser): AuthUser {
  const rawUser = user as NormalizableUser;

  const rawId = rawUser.id_usuario ?? rawUser.id ?? 0;
  const id = Number(rawId) > 0 ? Number(rawId) : 0;

  const correo = String(rawUser.correo ?? rawUser.email ?? "");
  const nombrePorCorreo = correo.includes("@")
    ? correo.split("@")[0]
    : "Usuario";

  return {
    id_usuario: id,
    correo,
    estado: String(rawUser.estado ?? "activo"),
    nombre_visible:
      rawUser.nombre_visible ||
      rawUser.nombre ||
      rawUser.username ||
      nombrePorCorreo,
    foto_perfil: rawUser.foto_perfil ?? null,
  };
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!json) {
    return {
      success: false,
      message: `Respuesta inválida del servidor. HTTP ${response.status}`,
    };
  }

  if (!response.ok) {
    return {
      success: false,
      message: json.message || `Error HTTP ${response.status}`,
      errors: json.errors,
      data: json.data,
    };
  }

  return json;
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = getRefreshToken();

  if (!refresh_token) {
    return null;
  }

  const response = await fetch(`${API_BASE}/auth/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refresh_token }),
  });

  const result = await parseResponse<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>(response);

  if (!response.ok || !result.success || !result.data?.access_token) {
    clearAuthStorage();
    return null;
  }

  localStorage.setItem("access_token", result.data.access_token);
  return result.data.access_token;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (options.auth) {
    const token = getAccessToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (
    response.status === 401 &&
    options.auth &&
    options.retryOnUnauthorized !== false
  ) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      return request<T>(path, {
        ...options,
        retryOnUnauthorized: false,
      });
    }
  }

  return parseResponse<T>(response);
}

export async function registerUser(correo: string, password: string) {
  return request<{
    usuario: AuthUser;
  }>("/auth/register/", {
    method: "POST",
    body: {
      correo,
      password,
    },
  });
}

export async function loginUser(correo: string, password: string) {
  return request<LoginData>("/auth/login/", {
    method: "POST",
    body: {
      correo,
      password,
    },
  });
}

export async function refreshToken(refresh_token: string) {
  return request<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>("/auth/refresh/", {
    method: "POST",
    body: {
      refresh_token,
    },
  });
}

export async function logoutUser() {
  const refresh_token = getRefreshToken();

  if (!refresh_token) {
    clearAuthStorage();
    return {
      success: true,
      message: "Sesión local cerrada.",
      data: {},
      errors: {},
    };
  }

  const result = await request("/auth/logout/", {
    method: "POST",
    body: {
      refresh_token,
    },
    retryOnUnauthorized: false,
  });

  clearAuthStorage();
  return result;
}

export async function changePassword(
  password_actual: string,
  password_nueva: string
) {
  return request("/auth/change-password/", {
    method: "POST",
    auth: true,
    body: {
      password_actual,
      password_nueva,
    },
  });
}

export async function forgotPassword(correo: string) {
  return request<{
    token_recuperacion?: string;
    reset_link?: string;
    expiracion?: string;
    email_enviado?: boolean;
    email_error?: string;
  }>("/auth/forgot-password/", {
    method: "POST",
    body: {
      correo,
    },
  });
}

export async function resetPassword(token: string, password_nueva: string) {
  return request("/auth/reset-password/", {
    method: "POST",
    body: {
      token,
      password_nueva,
    },
  });
}

export function saveAuthSession(data: LoginData) {
  saveAuthStorage({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: normalizeUser(data.usuario),
  });
}

export function saveUserSession(data: {
  access_token: string;
  refresh_token?: string;
  usuario: StoredAuthUser;
}) {
  saveAuthStorage({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: normalizeUser(data.usuario),
  });
}

export function getStoredAuthUser(): AuthUser | null {
  const raw =
    localStorage.getItem("auth_user") ||
    localStorage.getItem("rootblend_user") ||
    sessionStorage.getItem("auth_user") ||
    sessionStorage.getItem("rootblend_user");

  if (!raw || raw === "undefined" || raw === "null") {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(raw) as StoredAuthUser);
  } catch {
    return null;
  }
}

export function syncStoredUser(user: StoredAuthUser) {
  updateStoredUser(normalizeUser(user));
}

export { getAccessToken, getRefreshToken, clearAuthStorage };