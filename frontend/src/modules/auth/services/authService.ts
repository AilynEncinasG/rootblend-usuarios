const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

type LoginData = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  usuario: {
    id_usuario: number;
    correo: string;
    estado: string;
    nombre_visible?: string;
  };
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

export async function registerUser(
  correo: string,
  password: string
): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, password }),
  });

  return await response.json();
}

export async function loginUser(
  correo: string,
  password: string
): Promise<ApiResponse<LoginData>> {
  const response = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, password }),
  });

  return await response.json();
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

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
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
