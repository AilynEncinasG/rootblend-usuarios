//frontend/src/modules/interactions/components/NotificationsBell.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiBell, FiCheckCircle, FiLoader } from "react-icons/fi";
import { isAuthenticated } from "../../auth/utils/authStorage";
import {
  getNotifications,
  markNotificationRead,
  type NotificationItem,
} from "../services/interactionsService";

function formatNotificationDate(value?: string) {
  if (!value) return "Sin fecha";

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (Number.isNaN(date.getTime())) return "Sin fecha";
  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} día(s)`;
}

export default function NotificationsBell() {
  const loggedIn = isAuthenticated();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState("");

  async function loadNotifications() {
    if (!loggedIn) return;

    setLoading(true);
    setError("");

    try {
      const result = await getNotifications();

      setNotifications(
        [...result].sort(
          (a, b) =>
            new Date(b.fecha_envio).getTime() -
            new Date(a.fecha_envio).getTime(),
        ),
      );
    } catch (error) {
      console.error("NOTIFICATIONS_BELL_LOAD_ERROR", error);
      setError("No se pudieron cargar notificaciones reales.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !Boolean(item.leida)).length;
  }, [notifications]);

  const previewItems = notifications.slice(0, 4);

  async function openDropdown() {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  }

  async function markAsRead(notification: NotificationItem) {
    if (Boolean(notification.leida)) return;

    try {
      await markNotificationRead(notification.id_notificacion);

      setNotifications((current) =>
        current.map((item) =>
          item.id_notificacion === notification.id_notificacion
            ? { ...item, leida: true }
            : item,
        ),
      );
    } catch (error) {
      console.error("NOTIFICATION_MARK_READ_ERROR", error);
    }
  }

  if (!loggedIn) {
    return null;
  }

  return (
    <Wrapper>
      <BellButton type="button" onClick={openDropdown} aria-label="Notificaciones">
        <FiBell />
        {unreadCount > 0 && <Badge>{unreadCount > 9 ? "9+" : unreadCount}</Badge>}
      </BellButton>

      {open && (
        <Dropdown>
          <Header>
            <strong>Notificaciones</strong>
            <Link to="/notifications" onClick={() => setOpen(false)}>
              Ver todas
            </Link>
          </Header>

          {loading && (
            <StateLine>
              <FiLoader /> Cargando notificaciones reales...
            </StateLine>
          )}

          {error && !loading && <StateLine>{error}</StateLine>}

          {!loading && !error && previewItems.length === 0 && (
            <StateLine>
              <FiCheckCircle /> Sin notificaciones reales.
            </StateLine>
          )}

          {!loading &&
            !error &&
            previewItems.map((notification) => (
              <NotificationButton
                key={notification.id_notificacion}
                type="button"
                $unread={!Boolean(notification.leida)}
                onClick={() => markAsRead(notification)}
              >
                <Dot $unread={!Boolean(notification.leida)} />

                <div>
                  <strong>{notification.titulo}</strong>
                  <p>{notification.mensaje}</p>
                  <small>{formatNotificationDate(notification.fecha_envio)}</small>
                </div>
              </NotificationButton>
            ))}
        </Dropdown>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const BellButton = styled.button`
  position: relative;
  width: 42px;
  height: 42px;
  border: 1px solid var(--rb-border);
  border-radius: 999px;
  color: var(--rb-text);
  background: var(--rb-panel);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.18s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: var(--rb-text-strong);
    background: var(--rb-panel-hover);
    border-color: var(--rb-border-strong);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--rb-border-strong);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -3px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  color: var(--rb-text-inverse);
  background: var(--rb-accent-2);
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 900;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--rb-accent-2) 28%, transparent);
`;

const Dropdown = styled.div`
  position: absolute;
  top: 52px;
  right: 0;
  z-index: 100;
  width: min(360px, calc(100vw - 30px));
  padding: 14px;
  border-radius: 14px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border-strong);
  box-shadow: 0 24px 80px var(--rb-shadow);
  color: var(--rb-text);
  backdrop-filter: blur(18px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;

  strong {
    color: var(--rb-text-strong);
    font-size: 16px;
  }

  a {
    color: var(--rb-accent);
    font-size: 12px;
    font-weight: 900;
    text-decoration: none;

    &:hover {
      color: var(--rb-text-strong);
    }
  }
`;

const StateLine = styled.div`
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--rb-muted);
  font-size: 13px;

  svg {
    color: var(--rb-accent);
  }
`;

const NotificationButton = styled.button<{ $unread: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 10px;
  padding: 10px 4px;
  border: 0;
  border-radius: 10px;
  text-align: left;
  color: var(--rb-text);
  background: ${({ $unread }) =>
    $unread ? "color-mix(in srgb, var(--rb-accent) 8%, transparent)" : "transparent"};
  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    background: color-mix(in srgb, var(--rb-accent) 12%, transparent);
  }

  strong {
    color: var(--rb-text-strong);
    display: block;
    font-size: 13px;
  }

  p {
    margin: 3px 0;
    color: var(--rb-muted);
    font-size: 12px;
  }

  small {
    color: var(--rb-muted-soft);
    font-size: 11px;
  }
`;

const Dot = styled.span<{ $unread: boolean }>`
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 999px;
  background: ${({ $unread }) => ($unread ? "var(--rb-accent)" : "var(--rb-muted-soft)")};
  box-shadow: ${({ $unread }) =>
    $unread ? "0 0 18px color-mix(in srgb, var(--rb-accent) 65%, transparent)" : "none"};
`;
