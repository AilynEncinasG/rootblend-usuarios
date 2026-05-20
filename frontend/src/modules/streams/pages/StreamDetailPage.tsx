import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiHeart,
  FiLock,
  FiRefreshCw,
  FiStar,
  FiWifiOff,
} from "react-icons/fi";

import LiveVideoPlayer from "../../../components/stream/LiveVideoPlayer";
import { RootShell } from "../../../shared/layout";
import { getInitials } from "../../../shared/utils/rootblendHelpers";
import { toBrowserReachableUrl } from "../../../shared/utils/networkUrl";
import {
  AlertPanel,
  Avatar,
  ButtonRow,
  CardGrid,
  GhostButton,
  GhostLink,
  InfoGrid,
  InfoMain,
  MetaTag,
  Panel,
  PanelHeader,
  PlayerPanel,
  PrimaryButton,
  PrimaryLink,
  StreamInfo,
  TagRow,
  TwoCol,
} from "../../../shared/styles/legacyStyled";
import { type StreamItem } from "../../../shared/mock/rootblendMock";
import { isAuthenticated } from "../../auth/utils/authStorage";
import {
  getLiveStreams,
  getStreamById,
  getStreamSignalStatus,
  heartbeatStreamViewer,
  joinStreamViewer,
  leaveStreamViewer,
  type Stream as BackendStream,
} from "../services/streamsService";
import {
  backendStreamToCard,
  EmptyPanel,
  Section,
  StreamCard,
} from "../../public/utils/publicLegacyHelpers";
import StreamChatPanel from "../components/StreamChatPanel";
import {
  followChannel,
  getChannelInteractionState,
  subscribeChannel,
  unfollowChannel,
  unsubscribeChannel,
} from "../../interactions/services/interactionsService";

function isImageUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("http://") || value.startsWith("https://");
}

function ChannelDetailAvatar({
  image,
  name,
}: {
  image?: string | null;
  name: string;
}) {
  if (isImageUrl(image)) {
    return (
      <Avatar $large>
        <img
          src={image || ""}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Avatar>
    );
  }

  return <Avatar $large>{getInitials(name)}</Avatar>;
}

export default function StreamDetailPage() {
  const { streamId } = useParams();

  const [stream, setStream] = useState<StreamItem | null>(null);
  const [backendStream, setBackendStream] = useState<BackendStream | null>(null);
  const [relatedStreams, setRelatedStreams] = useState<StreamItem[]>([]);

  const [following, setFollowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [interactionFeedback, setInteractionFeedback] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loggedIn = isAuthenticated();

  useEffect(() => {
    let active = true;

    async function loadStreamDetail() {
      setLoading(true);
      setError("");

      if (!streamId || Number.isNaN(Number(streamId))) {
        setError("Stream inválido.");
        setLoading(false);
        return;
      }

      try {
        const [detail, live] = await Promise.all([
          getStreamById(Number(streamId)),
          getLiveStreams(),
        ]);

        if (!active) return;

        setBackendStream(detail);
        setViewerCount(detail.viewer_count || 0);
        setStream(backendStreamToCard(detail));
        setRelatedStreams(
          live
            .filter((item) => item.id_stream !== detail.id_stream)
            .map(backendStreamToCard),
        );
      } catch (requestError) {
        console.error("STREAM_DETAIL_LOAD_ERROR", requestError);

        if (active) {
          setError(
            "No se pudo cargar la transmisión. Intenta actualizar la página.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStreamDetail();

    return () => {
      active = false;
    };
  }, [streamId]);

  useEffect(() => {
    if (!streamId || Number.isNaN(Number(streamId))) return undefined;

    const numericStreamId = Number(streamId);
    const storageKey = `rootblend_viewer_key_stream_${numericStreamId}`;

    let active = true;
    let joined = false;
    let currentViewerKey = localStorage.getItem(storageKey);
    let heartbeatIntervalId: number | undefined;
    let statusIntervalId: number | undefined;

    async function connectViewerCounter() {
      try {
        const detail = await getStreamById(numericStreamId);

        if (!active || detail.estado !== "en_vivo") return;

        const joinResult = await joinStreamViewer(
          numericStreamId,
          currentViewerKey,
        );

        if (!active) return;

        joined = true;
        currentViewerKey = joinResult.viewer_key || currentViewerKey;

        if (currentViewerKey) {
          localStorage.setItem(storageKey, currentViewerKey);
        }

        setViewerCount(joinResult.viewer_count || 0);

        heartbeatIntervalId = window.setInterval(async () => {
          if (!currentViewerKey) return;

          try {
            const heartbeat = await heartbeatStreamViewer(
              numericStreamId,
              currentViewerKey,
            );

            if (active) {
              setViewerCount(heartbeat.viewer_count || 0);
            }
          } catch (heartbeatError) {
            console.error("STREAM_VIEWER_HEARTBEAT_ERROR", heartbeatError);
          }
        }, 10000);

        statusIntervalId = window.setInterval(async () => {
          try {
            const status = await getStreamSignalStatus(numericStreamId);

            if (active) {
              setViewerCount(status.viewer_count || 0);
              setBackendStream((current) =>
                current
                  ? {
                      ...current,
                      viewer_count: status.viewer_count,
                      signal_status: status.signal_status,
                      estado: status.estado,
                      last_signal_at: status.last_signal_at,
                    }
                  : current,
              );
            }
          } catch (pollError) {
            console.error("STREAM_VIEWER_COUNTER_POLL_ERROR", pollError);
          }
        }, 5000);
      } catch (joinError) {
        console.error("STREAM_VIEWER_COUNTER_JOIN_ERROR", joinError);
      }
    }

    connectViewerCounter();

    return () => {
      active = false;

      if (heartbeatIntervalId) {
        window.clearInterval(heartbeatIntervalId);
      }

      if (statusIntervalId) {
        window.clearInterval(statusIntervalId);
      }

      if (joined && currentViewerKey) {
        leaveStreamViewer(numericStreamId, currentViewerKey).catch(
          (leaveError) => {
            console.error("STREAM_VIEWER_COUNTER_LEAVE_ERROR", leaveError);
          },
        );
      }
    };
  }, [streamId]);

  useEffect(() => {
    let active = true;

    async function loadInteractionState() {
      if (!loggedIn || !backendStream?.canal.id_canal) {
        setFollowing(false);
        setSubscribed(false);
        return;
      }

      try {
        const state = await getChannelInteractionState(
          backendStream.canal.id_canal,
        );

        if (!active) return;

        setFollowing(Boolean(state.siguiendo));
        setSubscribed(Boolean(state.suscrito));
      } catch (interactionError) {
        console.error("STREAM_INTERACTION_STATE_ERROR", interactionError);
      }
    }

    loadInteractionState();

    return () => {
      active = false;
    };
  }, [backendStream?.canal.id_canal, loggedIn]);

  async function toggleFollow() {
    if (!backendStream) return;

    setInteractionLoading(true);
    setInteractionFeedback("");

    try {
      const payload = {
        id_canal: backendStream.canal.id_canal,
        nombre_canal: backendStream.canal.nombre_canal,
        tipo_canal:
          typeof backendStream.canal.tipo_canal === "string"
            ? backendStream.canal.tipo_canal
            : backendStream.canal.tipo_canal?.nombre_tipo || "streamer",
        estado_transmision: (
          backendStream.estado === "en_vivo" ? "online" : "offline"
        ) as "online" | "offline",
      };

      const state = following
        ? await unfollowChannel(backendStream.canal.id_canal)
        : await followChannel(payload);

      setFollowing(Boolean(state.siguiendo));
      setInteractionFeedback(
        state.siguiendo
          ? "Canal seguido correctamente."
          : "Dejaste de seguir el canal.",
      );
    } catch (interactionError) {
      console.error("STREAM_FOLLOW_ERROR", interactionError);
      setInteractionFeedback("No se pudo actualizar el seguimiento.");
    } finally {
      setInteractionLoading(false);
    }
  }

  async function toggleSubscription() {
    if (!backendStream) return;

    setInteractionLoading(true);
    setInteractionFeedback("");

    try {
      const payload = {
        id_canal: backendStream.canal.id_canal,
        nombre_canal: backendStream.canal.nombre_canal,
        tipo_canal:
          typeof backendStream.canal.tipo_canal === "string"
            ? backendStream.canal.tipo_canal
            : backendStream.canal.tipo_canal?.nombre_tipo || "streamer",
        estado_transmision: (
          backendStream.estado === "en_vivo" ? "online" : "offline"
        ) as "online" | "offline",
        tipo_plan: "mensual",
      };

      const state = subscribed
        ? await unsubscribeChannel(backendStream.canal.id_canal)
        : await subscribeChannel(payload);

      setSubscribed(Boolean(state.suscrito));
      setInteractionFeedback(
        state.suscrito ? "Suscripcion registrada." : "Suscripcion cancelada.",
      );
    } catch (interactionError) {
      console.error("STREAM_SUBSCRIPTION_ERROR", interactionError);
      setInteractionFeedback("No se pudo actualizar la suscripcion.");
    } finally {
      setInteractionLoading(false);
    }
  }

  const playbackUrl = useMemo(() => {
    return toBrowserReachableUrl(backendStream?.playback_url);
  }, [backendStream?.playback_url]);

  if (loading) {
    return (
      <RootShell active="streams">
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando stream</strong>
            <p>Consultando información real del stream.</p>
          </div>
        </AlertPanel>
      </RootShell>
    );
  }

  if (error || !stream || !backendStream) {
    return (
      <RootShell active="streams">
        <EmptyPanel
          icon={<FiAlertTriangle />}
          title="Stream no disponible"
          text={error || "El stream no existe o fue eliminado."}
        />

        <ButtonRow>
          <PrimaryLink to="/streams">Volver a transmisiones</PrimaryLink>
          <GhostLink to="/">Ir al inicio</GhostLink>
        </ButtonRow>
      </RootShell>
    );
  }

  const isLive = backendStream.estado === "en_vivo";
  const isFinished = backendStream.estado === "finalizado";

  return (
    <RootShell
      active="streams"
      rightPanel={
        isLive ? (
          <StreamChatPanel
            streamId={backendStream.id_stream}
            channelId={backendStream.canal.id_canal}
            allowInput={loggedIn}
            isLive={isLive}
          />
        ) : undefined
      }
    >
      {!loggedIn && isLive && (
        <AlertPanel>
          <FiLock />
          <div>
            <strong>Modo visitante</strong>
            <p>
              Puedes ver el directo y leer el chat. Para escribir, seguir o
              suscribirte necesitas iniciar sesión.
            </p>
          </div>
          <PrimaryLink to="/login">Iniciar sesión</PrimaryLink>
          <GhostLink to="/register">Registrarse</GhostLink>
        </AlertPanel>
      )}

      {isFinished && (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Stream finalizado</strong>
            <p>
              Esta transmisión ya terminó. Puedes volver a transmisiones para ver
              directos activos.
            </p>
          </div>
          <PrimaryLink to="/streams">Ver streams en vivo</PrimaryLink>
        </AlertPanel>
      )}

      <PlayerPanel>
        <LiveVideoPlayer
          playbackUrl={playbackUrl}
          poster={stream.image}
          streamStatus={backendStream.estado}
          signalStatus={backendStream.signal_status || undefined}
        />

        <StreamInfo>
          <ChannelDetailAvatar
            image={backendStream.canal.foto_canal}
            name={backendStream.canal.nombre_canal}
          />

          <InfoMain>
            <h1>{stream.title}</h1>
            <p>
              {stream.channel} -{" "}
              {stream.description || "Este stream todavía no tiene descripción."}
            </p>

            <TagRow>
              {stream.tags.map((tag) => (
                <MetaTag key={tag}>{tag}</MetaTag>
              ))}
            </TagRow>
          </InfoMain>

          <ButtonRow>
            {loggedIn ? (
              <>
                <GhostButton
                  type="button"
                  onClick={toggleFollow}
                  disabled={interactionLoading}
                >
                  <FiHeart /> {following ? "Siguiendo" : "Seguir"}
                </GhostButton>

                <PrimaryButton
                  type="button"
                  onClick={toggleSubscription}
                  disabled={interactionLoading}
                >
                  <FiStar /> {subscribed ? "Suscrito" : "Suscribirse"}
                </PrimaryButton>
              </>
            ) : (
              <>
                <GhostLink to="/login">
                  <FiHeart /> Seguir
                </GhostLink>

                <PrimaryLink to="/register">
                  <FiStar /> Suscribirse
                </PrimaryLink>
              </>
            )}
          </ButtonRow>

          {interactionFeedback && <MetaTag>{interactionFeedback}</MetaTag>}
        </StreamInfo>
      </PlayerPanel>

      <InfoGrid>
        <Panel>
          <PanelHeader>
            <strong>Sobre el canal</strong>
          </PanelHeader>

          <p>
            {backendStream.canal.nombre_canal} ·{" "}
            {backendStream.descripcion ||
              "Este directo todavía no tiene descripción configurada."}
          </p>
        </Panel>

        <Panel>
          <PanelHeader>
            <strong>Datos del stream</strong>
          </PanelHeader>

          <TwoCol>
            <span>Estado</span>
            <strong>{backendStream.estado}</strong>

            <span>Señal OBS</span>
            <strong>{backendStream.signal_status || "sin_senal"}</strong>

            <span>Espectadores</span>
            <strong>{viewerCount}</strong>

            <span>Categoría</span>
            <strong>{backendStream.categoria.nombre}</strong>

            <span>Calidad</span>
            <strong>{backendStream.calidad_actual || "720p"}</strong>

            <span>Fecha de inicio</span>
            <strong>
              {backendStream.fecha_inicio
                ? new Date(backendStream.fecha_inicio).toLocaleString()
                : "Todavía no iniciado"}
            </strong>

            <span>Fecha de fin</span>
            <strong>
              {backendStream.fecha_fin
                ? new Date(backendStream.fecha_fin).toLocaleString()
                : "Sin finalizar"}
            </strong>
          </TwoCol>
        </Panel>
      </InfoGrid>

      <Section title="Transmisiones relacionadas">
        {relatedStreams.length === 0 ? (
          <EmptyPanel
            icon={<FiWifiOff />}
            title="No hay transmisiones relacionadas"
            text="Cuando existan otros directos en vivo aparecerán aquí."
          />
        ) : (
          <CardGrid>
            {relatedStreams.slice(0, 4).map((item) => (
              <StreamCard key={item.id} stream={item} />
            ))}
          </CardGrid>
        )}
      </Section>
    </RootShell>
  );
}