export type InteractionItem = {
  id: string;
  type: "follow" | "subscription" | "like" | "chat" | "notification";
  title: string;
  description: string;
  time: string;
  status: "active" | "pending" | "completed";
};

export const interactionItems: InteractionItem[] = [
  {
    id: "interaction-1",
    type: "follow",
    title: "Siguiendo a NeonRunner",
    description: "Recibirás actualizaciones cuando inicie directos.",
    time: "Hace 5 min",
    status: "active",
  },
  {
    id: "interaction-2",
    type: "subscription",
    title: "Suscripción a RootCast",
    description: "Nuevo episodio disponible sobre sistemas distribuidos.",
    time: "Hace 1 h",
    status: "completed",
  },
  {
    id: "interaction-3",
    type: "chat",
    title: "Mensaje enviado en Cyberpunk 2077",
    description: "Participaste en el chat en vivo del canal NeonRunner.",
    time: "Hoy",
    status: "completed",
  },
  {
    id: "interaction-4",
    type: "like",
    title: "Highlight guardado",
    description: "Marcaste un clip destacado para verlo después.",
    time: "Ayer",
    status: "active",
  },
  {
    id: "interaction-5",
    type: "notification",
    title: "Alerta de servicio",
    description: "El sistema registró una verificación de health checks.",
    time: "Ayer",
    status: "pending",
  },
];

export function getInteractions() {
  return interactionItems;
}

export function getInteractionStats() {
  return {
    total: interactionItems.length,
    active: interactionItems.filter((item) => item.status === "active").length,
    completed: interactionItems.filter((item) => item.status === "completed")
      .length,
    pending: interactionItems.filter((item) => item.status === "pending")
      .length,
  };
}