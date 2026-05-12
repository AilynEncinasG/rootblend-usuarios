export type ServiceStatusState = "checking" | "operational" | "down";

export type ServiceStatusItem = {
  id: string;
  name: string;
  description: string;
  path: string;
  status: ServiceStatusState;
  latencyMs?: number;
  detail?: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const systemServices: Omit<ServiceStatusItem, "status">[] = [
  {
    id: "usuarios",
    name: "Usuarios",
    description: "Autenticación, perfil, preferencias y sesión JWT.",
    path: "/api/usuarios-health/",
  },
  {
    id: "canales-streaming",
    name: "Canales y Streaming",
    description: "Canales, categorías, directos, configuración y estados en vivo.",
    path: "/api/streams-health/",
  },
  {
    id: "estadisticas",
    name: "Estadísticas",
    description: "Métricas, audiencia, chat, reproducciones y resúmenes.",
    path: "/api/stats-health/",
  },
  {
    id: "podcasts",
    name: "Podcasts",
    description: "Podcasts, episodios, archivos de audio e historial.",
    path: "/api/podcasts-health/",
  },
  {
    id: "interacciones",
    name: "Interacciones",
    description: "Seguimientos, suscripciones, eventos y notificaciones.",
    path: "/api/interactions-health/",
  },
];

async function checkService(
  service: Omit<ServiceStatusItem, "status">
): Promise<ServiceStatusItem> {
  const start = performance.now();

  try {
    const response = await fetch(`${API_BASE_URL}${service.path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const latencyMs = Math.round(performance.now() - start);

    if (!response.ok) {
      return {
        ...service,
        status: "down",
        latencyMs,
        detail: `HTTP ${response.status}`,
      };
    }

    return {
      ...service,
      status: "operational",
      latencyMs,
      detail: "Respuesta correcta",
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - start);

    return {
      ...service,
      status: "down",
      latencyMs,
      detail:
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el servicio.",
    };
  }
}

export async function checkSystemStatus() {
  return Promise.all(systemServices.map((service) => checkService(service)));
}
