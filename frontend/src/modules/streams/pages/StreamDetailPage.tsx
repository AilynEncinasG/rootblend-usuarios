import { useEffect, useState } from "react";
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
  type Stream as BackendStream,
} from "../services/streamsService";
import {
  backendStreamToCard,
  ChatPanel,
  EmptyPanel,
  Section,
  StreamCard,
} from "../../public/utils/publicLegacyHelpers";

export default function StreamDetailPage() {
  const { streamId } = useParams();

  const [stream, setStream] = useState<StreamItem | null>(null);
  const [backendStream, setBackendStream] = useState<BackendStream | null>(null);
  const [relatedStreams, setRelatedStreams] = useState<StreamItem[]>([]);

  const [following, setFollowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

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
        setStream(backendStreamToCard(detail));
        setRelatedStreams(
          live
            .filter((item) => item.id_stream !== detail.id_stream)
            .map(backendStreamToCard)
        );
      } catch (error) {
        console.error("STREAM_DETAIL_LOAD_ERROR", error);

        if (active) {
          setError("No se pudo cargar la transmisión. Intenta actualizar la página.");
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
      rightPanel={isLive ? <ChatPanel allowInput={loggedIn} /> : undefined}
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
          playbackUrl={backendStream.playback_url}
          poster={stream.image}
          streamStatus={backendStream.estado}
          signalStatus={backendStream.signal_status || undefined}
        />

        <StreamInfo>
          <Avatar $large>{stream.avatar}</Avatar>

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
                  onClick={() => setFollowing((value) => !value)}
                >
                  <FiHeart /> {following ? "Siguiendo" : "Seguir"}
                </GhostButton>

                <PrimaryButton
                  type="button"
                  onClick={() => setSubscribed((value) => !value)}
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

            <span>Senal OBS</span>
            <strong>{backendStream.signal_status}</strong>

            <span>Espectadores</span>
            <strong>{backendStream.viewer_count}</strong>

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
