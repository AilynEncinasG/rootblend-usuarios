import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiCreditCard,
  FiRefreshCw,
  FiStar,
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
  getMySubscriptions,
  unsubscribeChannel,
  type SubscriptionItem,
} from "../../interactions/services/interactionsService";

function getChannelId(item: SubscriptionItem) {
  return item.canal?.id_canal || item.id_canal;
}

function getChannelName(item: SubscriptionItem) {
  return item.canal?.nombre_canal || item.nombre_canal || `Canal ${getChannelId(item)}`;
}

function getChannelType(item: SubscriptionItem) {
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

function formatExpiration(value?: string | null) {
  if (!value) return "Sin vencimiento definido";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin vencimiento definido";
  }

  return date.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SubscriptionItem[]>([]);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  async function loadSubscriptions() {
    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const result = await getMySubscriptions();
      setItems(result);
    } catch (error) {
      console.error("SUBSCRIPTIONS_LOAD_ERROR", error);
      setError("No se pudieron cargar las suscripciones reales.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscriptions();
  }, []);

  async function cancelSubscription(channelId: number) {
    try {
      await unsubscribeChannel(channelId);

      setItems((current) =>
        current.filter((item) => Number(getChannelId(item)) !== Number(channelId)),
      );

      setFeedback("Suscripción cancelada correctamente.");
    } catch (error) {
      console.error("UNSUBSCRIBE_ERROR", error);
      setError("No se pudo cancelar esta suscripción.");
    }
  }

  return (
    <RootShell active="home">
      <PageHeading>
        <span>Comunidad</span>
        <h1>Suscripciones</h1>
        <p>Administra tus suscripciones reales desde interacciones-service.</p>
      </PageHeading>

      {loading && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando suscripciones</strong>
            <p>Consultando /api/interactions/subscriptions/me.</p>
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
          <FiStar />
          <div>
            <strong>Actualizado</strong>
            <p>{feedback}</p>
          </div>
        </AlertPanel>
      )}

      <Panel>
        <ButtonRow>
          <ServicePill $status="Operativo">Datos reales</ServicePill>
          <GhostLink to="/following">Ver seguidos</GhostLink>
        </ButtonRow>

        {!loading && items.length === 0 ? (
          <EmptyPanel
            icon={<FiCreditCard />}
            title="No tienes suscripciones activas"
            text="Cuando presiones Suscribirse en un canal real, aparecerá aquí."
          />
        ) : (
          items.map((item) => {
            const channelId = getChannelId(item);
            const channelName = getChannelName(item);

            return (
              <NotificationRow key={channelId} $accent="#22c55e">
                <Avatar>{getInitials(channelName)}</Avatar>

                <div>
                  <strong>{channelName}</strong>
                  <small>
                    {getChannelType(item)} · Plan: {item.tipo_plan || "mensual"} ·
                    Vence: {formatExpiration(item.fecha_vencimiento)}
                  </small>
                </div>

                <GhostLink to={`/channels/${channelId}`}>Ver canal</GhostLink>

                <DangerButton
                  type="button"
                  onClick={() => cancelSubscription(Number(channelId))}
                >
                  Cancelar
                </DangerButton>
              </NotificationRow>
            );
          })
        )}

        <ButtonRow>
          <PrimaryLink to="/streams">
            <FiUsers /> Buscar canales
          </PrimaryLink>
        </ButtonRow>
      </Panel>
    </RootShell>
  );
}