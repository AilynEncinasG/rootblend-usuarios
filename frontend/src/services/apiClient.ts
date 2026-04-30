const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

function getAccessToken(): string | null {
  return localStorage.getItem("access_token") || localStorage.getItem("token");
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
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

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Error HTTP ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}