export type PasswordResetRequestPayload = {
  correo: string;
};

export type PasswordResetConfirmPayload = {
  token: string;
  password: string;
  password_confirm: string;
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

async function postJson<T>(path: string, payload: unknown, fallback: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(body, fallback));
  }

  return body as T;
}

export function requestPasswordReset(payload: PasswordResetRequestPayload) {
  return postJson(
    "/api/auth/password-reset/request/",
    payload,
    "No se pudo enviar la solicitud de recuperación."
  );
}

export function confirmPasswordReset(payload: PasswordResetConfirmPayload) {
  return postJson(
    "/api/auth/password-reset/confirm/",
    payload,
    "No se pudo restablecer la contraseña."
  );
}
