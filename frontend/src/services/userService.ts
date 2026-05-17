import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
} from "../modules/auth/utils/authStorage";

const RAW_API_BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api";

function normalizeApiBase(value: string) {
  const cleanValue = value.replace(/\/+$/, "");
  return cleanValue.endsWith("/api") ? cleanValue : `${cleanValue}/api`;
}

const API_BASE = normalizeApiBase(RAW_API_BASE);

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

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

async function uploadRequest<T>(
  path: string,
  formData: FormData,
  retryOnUnauthorized = true
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = getAccessToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (response.status === 401 && retryOnUnauthorized) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      return uploadRequest<T>(path, formData, false);
    }
  }

  return parseResponse<T>(response);
}

export type MeResponse = {
  usuario: {
    id_usuario: number;
    correo: string;
    estado: string;
    fecha_registro: string | null;
    ultimo_acceso: string | null;
  };
  perfil: {
    id_perfil: number | null;
    nombre_visible: string | null;
    foto_perfil: string | null;
    biografia: string | null;
    fecha_nacimiento: string | null;
  };
};

export type PreferencesResponse = {
  preferencias: {
    id_preferencia: number;
    idioma: "es" | "en";
    tema: "claro" | "oscuro";
    autoplay: boolean;
    recibir_notificaciones: boolean;
  };
};

export type UploadProfilePhotoResponse = {
  foto_perfil: string;
  perfil: MeResponse["perfil"];
};

export function getMe() {
  return request<MeResponse>("/users/me/", {
    auth: true,
  });
}

export function updateProfile(data: {
  nombre_visible?: string;
  foto_perfil?: string;
  biografia?: string;
  fecha_nacimiento?: string;
}) {
  return request<{
    perfil: MeResponse["perfil"];
  }>("/users/me/profile/", {
    method: "PUT",
    auth: true,
    body: data,
  });
}

export function uploadProfilePhoto(file: File) {
  const formData = new FormData();
  formData.append("foto_perfil", file);

  return uploadRequest<UploadProfilePhotoResponse>(
    "/users/me/profile/photo/",
    formData
  );
}

export function getPreferences() {
  return request<PreferencesResponse>("/preferences/me/", {
    auth: true,
  });
}

export function updatePreferences(data: {
  idioma?: "es" | "en";
  tema?: "claro" | "oscuro";
  autoplay?: boolean;
  recibir_notificaciones?: boolean;
}) {
  return request<PreferencesResponse>("/preferences/me/update/", {
    method: "PUT",
    auth: true,
    body: data,
  });
}