const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

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

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
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

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.errors?.audio?.[0] ||
      data?.errors?.portada?.[0] ||
      `Error HTTP ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}
