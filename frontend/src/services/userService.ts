import { getToken, removeToken } from "./authService";

const API_BASE = "http://127.0.0.1:8000/api";

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
};

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getCurrentUser(): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/users/me/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return await response.json();
}

export async function updateProfile(payload: {
  nombre_visible?: string;
  foto_perfil?: string;
  biografia?: string;
  fecha_nacimiento?: string;
}): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/users/me/profile/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return await response.json();
}

export async function getPreferences(): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/preferences/me/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return await response.json();
}

export async function updatePreferences(payload: {
  idioma?: string;
  tema?: string;
  autoplay?: boolean;
  recibir_notificaciones?: boolean;
}): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/preferences/me/update/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return await response.json();
}

export async function changePassword(payload: {
  password_actual: string;
  password_nueva: string;
}): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/auth/change-password/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return await response.json();
}

export async function logoutUser(): Promise<ApiResponse> {
  const token = getToken();

  const response = await fetch(`${API_BASE}/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  removeToken();
  return data;
}