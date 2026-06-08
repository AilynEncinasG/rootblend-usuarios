const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : "http://localhost:8080/api");

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

function getAccessToken(): string | null {
  return localStorage.getItem("access_token") || localStorage.getItem("token");
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function extractErrorMessage(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const body = data as Record<string, unknown>;

  if (typeof body.message === "string") return body.message;
  if (typeof body.error === "string") return body.error;
  if (typeof body.detail === "string") return body.detail;

  const errors = body.errors;

  if (errors && typeof errors === "object") {
    const first = Object.values(errors as Record<string, unknown>)[0];

    if (Array.isArray(first) && first.length > 0) {
      return String(first[0]);
    }

    if (typeof first === "string") {
      return first;
    }
  }

  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};

  if (!isFormData(options.body)) {
    headers["Content-Type"] = "application/json";
  }

  if (options.auth) {
    const token = getAccessToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body
      ? isFormData(options.body)
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data, `Error HTTP ${response.status}`),
    );
  }

  return data as T;
}
