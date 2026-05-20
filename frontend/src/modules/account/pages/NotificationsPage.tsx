import { useEffect, useState } from "react";
import { FiBell, FiCheck, FiRefreshCw } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import {
  AlertPanel,
  GhostButton,
  NotificationRow,
  PageHeading,
  Panel,
} from "../../../shared/styles/legacyStyled";
import {
  getNotifications,
  markNotificationRead,
  type NotificationItem,
} from "../../interactions/services/interactionsService";

function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("es-BO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    setLoading(true);
    setError("");

    try {
      const result = await getNotifications();
      setItems(result);
    } catch (requestError) {
      console.error("NOTIFICATIONS_LOAD_ERROR", requestError);
      setError("No se pudieron cargar las notificaciones reales.");
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: number) {
    try {
      await markNotificationRead(id);
      setItems((current) =>
        current.map((item) =>
          item.id_notificacion === id ? { ...item, leida: true } : item,
        ),
      );
    } catch (requestError) {
      console.error("NOTIFICATION_MARK_READ_ERROR", requestError);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <RootShell active="home">
      <PageHeading>
        <h1>Notificaciones</h1>
        <p>Directos y avisos reales de los canales que sigues.</p>
      </PageHeading>

      {loading && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando notificaciones</strong>
            <p>Consultando interacciones-service.</p>
          </div>
        </AlertPanel>
      )}

      {error && (
        <AlertPanel>
          <FiBell />
          <div>
            <strong>Servicio de interacciones no disponible</strong>
            <p>{error}</p>
          </div>
          <GhostButton type="button" onClick={loadNotifications}>
            Reintentar
          </GhostButton>
        </AlertPanel>
      )}

      <Panel>
        {!loading && !error && items.length === 0 && (
          <NotificationRow $accent="#00e5ff">
            <FiBell />
            <div>
              <strong>Sin notificaciones</strong>
              <small>Cuando un canal seguido inicie directo aparecerá aquí.</small>
            </div>
            <span />
          </NotificationRow>
        )}

        {items.map((item) => (
          <NotificationRow key={item.id_notificacion} $accent={item.leida ? "#64748b" : "#00e5ff"}>
            <FiBell />
            <div>
              <strong>{item.titulo}</strong>
              <small>
                {item.mensaje} · {item.nombre_canal || "ROOTBLEND"} · {formatDate(item.fecha_envio)}
              </small>
            </div>

            {item.leida ? (
              <span>Leída</span>
            ) : (
              <GhostButton
                type="button"
                onClick={() => markRead(item.id_notificacion)}
              >
                <FiCheck /> Leída
              </GhostButton>
            )}
          </NotificationRow>
        ))}
      </Panel>
    </RootShell>
  );
}
