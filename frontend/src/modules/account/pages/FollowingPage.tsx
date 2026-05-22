import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiBell,
  FiRefreshCw,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import {
  AlertPanel,
  Avatar,
  ButtonRow,
  DangerButton,
  GhostLink,
  NotificationRow,
  Panel,
  PageHeading,
  PrimaryLink,
  ServicePill,
} from "../../../shared/styles/legacyStyled";
import { EmptyPanel } from "../../public/utils/publicLegacyHelpers";
import {
  getMyFollowedChannels,
  unfollowChannel,
  type FollowedChannelItem,
} from "../../interactions/services/interactionsService";

function getChannelId(item: FollowedChannelItem) {
  return item.canal?.id_canal || item.id_canal;
}

function getChannelName(item: FollowedChannelItem) {
  return item.canal?.nombre_canal || item.nombre_canal || `Canal ${getChannelId(item)}`;
}

function getChannelType(item: FollowedChannelItem) {
  return item.canal?.tipo_canal || item.tipo_canal || "streamer";
}

function getInitials(value: string) {
  return (
    value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "RB"
  );
}

export default function FollowingPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FollowedChannelItem[]>([]);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  async function loadFollowing() {
    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const result = await getMyFollowedChannels();
      setItems(result);
    } catch (error) {
      console.error("FOLLOWING_LOAD_ERROR", error);
      setError("No se pudieron cargar los canales seguidos reales.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFollowing();
  }, []);

  async function removeFollow(channelId: number) {
    try {
      await unfollowChannel(channelId);

      setItems((current) =>
        current.filter((item) => Number(getChannelId(item)) !== Number(channelId)),
      );

      setFeedback("Canal eliminado de tus seguidos.");
    } catch (error) {
      console.error("UNFOLLOW_ERROR", error);
      setError("No se pudo dejar de seguir este canal.");
    }
  }

  return (
    <RootShell active="home">
      <PageHeading>
        <span>Comunidad</span>
        <h1>Canales seguidos</h1>
        <p>Vista real de los canales que sigues desde interacciones-service.</p>
      </PageHeading>

      {loading && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando seguidos</strong>
            <p>Consultando /api/interactions/follows/me.</p>
          </div>
        </AlertPanel>
      )}

      {error && (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      )}

      {feedback && (
        <AlertPanel>
          <FiBell />
          <div>
            <strong>Actualizado</strong>
            <p>{feedback}</p>
          </div>
        </AlertPanel>
      )}

      <Panel>
        <ButtonRow>
          <ServicePill $status="Operativo">Datos reales</ServicePill>
          <GhostLink to="/subscriptions">Ver suscripciones</GhostLink>
        </ButtonRow>

        {!loading && items.length === 0 ? (
          <EmptyPanel
            icon={<FiUsers />}
            title="No sigues canales todavía"
            text="Cuando presiones Seguir en un stream real, el canal aparecerá aquí."
          />
        ) : (
          items.map((item) => {
            const channelId = getChannelId(item);
            const channelName = getChannelName(item);

            return (
              <NotificationRow key={channelId} $accent="#00e5ff">
                <Avatar>{getInitials(channelName)}</Avatar>

                <div>
                  <strong>{channelName}</strong>
                  <small>
                    {getChannelType(item)} · Estado:{" "}
                    {item.canal?.estado_transmision ||
                      item.estado_transmision ||
                      "offline"}
                  </small>
                </div>

                <GhostLink to={`/channels/${channelId}`}>Ver canal</GhostLink>

                <DangerButton
                  type="button"
                  onClick={() => removeFollow(Number(channelId))}
                >
                  Dejar de seguir
                </DangerButton>
              </NotificationRow>
            );
          })
        )}

        <ButtonRow>
          <PrimaryLink to="/streams">
            <FiUserCheck /> Buscar canales
          </PrimaryLink>
        </ButtonRow>
      </Panel>
    </RootShell>
  );
}