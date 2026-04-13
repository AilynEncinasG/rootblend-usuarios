import { getToken, removeToken } from "./authService";

const API_BASE = "http://127.0.0.1:8000/api";

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
};

export async function getCurrentUser(): Promise<ApiResponse> {
  const token = getToken();

  const response = await fetch(`${API_BASE}/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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