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
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function getErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== "object") {
    return fallback;
  }

  const data = body as Record<string, unknown>;

  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;

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

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(body, "No se pudo iniciar sesión. Revisa tus credenciales.")
    );
  }

  return body as LoginResponse;
}

export function saveLoginSession(response: LoginResponse, fallbackEmail: string) {
  const accessToken =
    response.access_token || response.access || response.token || "";

  const refreshToken = response.refresh_token || response.refresh || "";

  const user = response.user ||
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
