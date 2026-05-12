export type RegisterPayload = {
  correo: string;
  password: string;
  password_confirm: string;
  nombre_visible: string;
};

export type RegisterUser = {
  id_usuario?: number;
  id?: number;
  correo?: string;
  email?: string;
  nombre_visible?: string;
  nombre?: string;
  username?: string;
};

export type RegisterResponse = {
  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
  token?: string;
  user?: RegisterUser;
  usuario?: RegisterUser;
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

export async function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
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
      getErrorMessage(body, "No se pudo crear la cuenta. Revisa los datos.")
    );
  }

  return body as RegisterResponse;
}

export function saveRegisterSession(
  response: RegisterResponse,
  fallbackEmail: string,
  fallbackName: string
) {
  const accessToken =
    response.access_token || response.access || response.token || "";

  const refreshToken = response.refresh_token || response.refresh || "";

  const user =
    response.user ||
    response.usuario || {
      correo: fallbackEmail,
      nombre_visible: fallbackName,
    };

  if (!accessToken) {
    return;
  }

  localStorage.setItem("access_token", accessToken);

  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }

  localStorage.setItem("auth_user", JSON.stringify(user));
  localStorage.setItem("rootblend_user", JSON.stringify(user));

  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("auth-session-changed"));
}