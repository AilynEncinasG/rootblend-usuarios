const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
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
  };
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

export async function registerUser(correo: string, password: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, password }),
  });

  return await response.json();
}

export async function loginUser(correo: string, password: string): Promise<ApiResponse<LoginData>> {
  const response = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, password }),
  });

  return await response.json();
}

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const result = await response.json();

    if (!result.success || !result.data?.access_token) {
      clearAuthSession();
      return false;
    }

    saveAccessToken(result.data.access_token);
    return true;
  } catch {
    clearAuthSession();
    return false;
  }
}

export function saveAuthSession(data: LoginData) {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
}

export function saveAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
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
  return !!getAccessToken() && !!getRefreshToken();
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export { API_BASE };