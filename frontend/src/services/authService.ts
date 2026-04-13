const API_BASE = "http://127.0.0.1:8000/api";

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
};

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

export async function loginUser(correo: string, password: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, password }),
  });

  return await response.json();
}

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}