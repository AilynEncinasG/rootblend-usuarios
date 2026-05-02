const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

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
};

export type LoginData = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  usuario: AuthUser;
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

async function request<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    auth?: boolean;
  } = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
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
    clearAuthSession();
    return {
      success: true,
      message: "Sesión local cerrada.",
    };
  }

  const result = await request("/auth/logout/", {
    method: "POST",
    body: {
      refresh_token,
    },
  });

  clearAuthSession();

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
    token_recuperacion: string;
    expiracion: string;
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
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));

  window.dispatchEvent(new Event("auth-changed"));
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function hasSession() {
  return Boolean(getAccessToken());
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  window.dispatchEvent(new Event("auth-changed"));
}

export { API_BASE };