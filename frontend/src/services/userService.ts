import { getAccessToken } from "../modules/auth/utils/authStorage";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

async function request<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT";
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