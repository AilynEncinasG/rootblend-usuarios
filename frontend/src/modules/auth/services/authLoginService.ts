export type LoginPayload = {
  correo: string;
  password: string;
};

export type LoginUser = {
  id_usuario?: number;
  id?: number;
  correo?: string;
  email?: string;
  nombre_visible?: string;
  nombre?: string;
  username?: string;
};

export type LoginResponse = {
  data?: {
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    usuario?: LoginUser;
  };
  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
  token?: string;
  user?: LoginUser;
  usuario?: LoginUser;
  detail?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined"
    ? window.location.origin === "http://localhost:5173"
      ? "http://localhost:8080"
      : window.location.origin
    : "http://localhost:8080");

function getErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== "object") {
    return fallback;
  }

  const data = body as Record<string, unknown>;

  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;

  const errors = data.errors;
  if (errors && typeof errors === "object") {
    const firstError = Object.values(errors as Record<string, unknown>)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return String(firstError[0]);
    }
    if (typeof firstError === "string") {
      return firstError;
    }
  }

  const firstValue = Object.values(data)[0];

  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return String(firstValue[0]);
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return fallback;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let body: unknown = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(body, "No se pudo iniciar sesión. Revisa tus credenciales."),
    );
  }

  return body as LoginResponse;
}

export function saveLoginSession(response: LoginResponse, fallbackEmail: string) {
  const payload = response.data || response;

  const accessToken =
    payload.access_token || response.access || response.token || "";

  const refreshToken = payload.refresh_token || response.refresh || "";

  const user = payload.usuario ||
    response.user ||
    response.usuario || {
      correo: fallbackEmail,
      nombre_visible: fallbackEmail,
    };

  if (!accessToken) {
    throw new Error("El backend no devolvió access_token.");
  }

  localStorage.setItem("access_token", accessToken);

  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }

  localStorage.setItem("auth_user", JSON.stringify(user));
  localStorage.setItem("rootblend_user", JSON.stringify(user));
}
