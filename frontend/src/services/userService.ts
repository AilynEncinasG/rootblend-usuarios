import {
  API_BASE,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  clearAuthSession,
} from "./authService";

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
};

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      const newAccessToken = getAccessToken();

      const retryHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
      };

      if (newAccessToken) {
        retryHeaders["Authorization"] = `Bearer ${newAccessToken}`;
      }

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    } else {
      clearAuthSession();
    }
  }

  return response;
}

export async function getCurrentUser(): Promise<ApiResponse> {
  const response = await fetchWithAuth(`${API_BASE}/users/me/`, {
    method: "GET",
  });

  return await response.json();
}

export async function updateProfile(payload: {
  nombre_visible?: string;
  foto_perfil?: string;
  biografia?: string;
  fecha_nacimiento?: string;
}): Promise<ApiResponse> {
  const response = await fetchWithAuth(`${API_BASE}/users/me/profile/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return await response.json();
}

export async function getPreferences(): Promise<ApiResponse> {
  const response = await fetchWithAuth(`${API_BASE}/preferences/me/`, {
    method: "GET",
  });

  return await response.json();
}

export async function updatePreferences(payload: {
  idioma?: string;
  tema?: string;
  autoplay?: boolean;
  recibir_notificaciones?: boolean;
}): Promise<ApiResponse> {
  const response = await fetchWithAuth(`${API_BASE}/preferences/me/update/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return await response.json();
}

export async function changePassword(payload: {
  password_actual: string;
  password_nueva: string;
}): Promise<ApiResponse> {
  const response = await fetchWithAuth(`${API_BASE}/auth/change-password/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return await response.json();
}

export async function logoutUser(): Promise<ApiResponse> {
  const refreshToken = getRefreshToken();

  const response = await fetch(`${API_BASE}/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  clearAuthSession();
  return data;
}