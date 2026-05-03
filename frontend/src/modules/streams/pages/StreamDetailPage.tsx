import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiClock,
  FiEye,
  FiHeart,
  FiLock,
  FiRefreshCw,
  FiStar,
  FiWifiOff,
} from "react-icons/fi";

import LiveVideoPlayer from "../../../components/stream/LiveVideoPlayer";
import {
  getLiveStreams,
  getStreamById,
  type Stream,
} from "../services/streamsService";
import { isAuthenticated } from "../../auth/utils/authStorage";
import { RootShell } from "../../mock/RootblendScreens";

type SignalStatus = "sin_senal" | "conectado" | "desconectado" | "error";

function normalizeSignalStatus(value?: string | null): SignalStatus {
  if (
    value === "sin_senal" ||
    value === "conectado" ||
    value === "desconectado" ||
    value === "error"
  ) {
    return value;
  }

  return "sin_senal";
}

function initials(value: string) {
  const clean = value.trim();

  if (!clean) return "RB";

  const parts = clean.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleString("es-BO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function StreamDetailPage() {
  const { streamId } = useParams();

  const [stream, setStream] = useState<Stream | null>(null);
  const [related, setRelated] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loggedIn = isAuthenticated();

  useEffect(() => {
    let active = true;

    async function loadStream() {
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

        setStream(detail);
        setRelated(live.filter((item) => item.id_stream !== detail.id_stream));
      } catch (error) {
        console.error("PUBLIC_STREAM_DETAIL_ERROR", error);

        if (active) {
          setError("No se pudo cargar el stream real.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStream();

    return () => {
      active = false;
    };
  }, [streamId]);

  useEffect(() => {
    if (!streamId || Number.isNaN(Number(streamId))) return undefined;

    const interval = window.setInterval(async () => {
      try {
        const updated = await getStreamById(Number(streamId));

        setStream((current) => {
          if (!current) return updated;

          return {
            ...current,
            estado: updated.estado,
            fecha_inicio: updated.fecha_inicio,
            fecha_fin: updated.fecha_fin,
            viewer_count: updated.viewer_count,
            signal_status: updated.signal_status,
            playback_url: updated.playback_url,
            calidad_actual: updated.calidad_actual,
          };
        });
      } catch (error) {
        console.error("PUBLIC_STREAM_POLL_ERROR", error);
      }
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, [streamId]);

  const signalStatus = normalizeSignalStatus(stream?.signal_status);
  const isLive = stream?.estado === "en_vivo";
  const isFinished = stream?.estado === "finalizado";

  const playerTitle = useMemo(() => {
    if (!stream) return "Stream";

    return `${stream.titulo} - ${stream.canal.nombre_canal}`;
  }, [stream]);

  if (loading) {
    return (
      <RootShell active="explore">
        <Page>
          <Alert>
            <FiRefreshCw />
            <div>
              <strong>Cargando stream</strong>
              <p>Consultando canales-streaming-service.</p>
            </div>
          </Alert>
        </Page>
      </RootShell>
    );
  }

  if (error || !stream) {
    return (
      <RootShell active="explore">
        <Page>
          <Alert $variant="danger">
            <FiAlertTriangle />
            <div>
              <strong>Stream no disponible</strong>
              <p>{error || "El stream no existe o fue eliminado."}</p>
            </div>
          </Alert>

          <div style={{ marginTop: 16 }}>
            <ButtonLink to="/streams">
              <FiArrowLeft /> Volver a transmisiones
            </ButtonLink>
          </div>
        </Page>
      </RootShell>
    );
  }

  return (
    <RootShell active="explore">
      <Page>
        <Shell>
          <MainColumn>
            {!loggedIn && isLive && (
              <Alert>
                <FiLock />
                <div>
                  <strong>Modo visitante</strong>
                  <p>
                    Puedes mirar el directo y leer el chat. Para escribir,
                    seguir o suscribirte necesitas iniciar sesión.
                  </p>
                </div>

                <AlertActions>
                  <ButtonLink to="/login" $primary>
                    Iniciar sesión
                  </ButtonLink>
                  <ButtonLink to="/register">Registrarse</ButtonLink>
                </AlertActions>
              </Alert>
            )}

            {isFinished && (
              <Alert $variant="warning">
                <FiWifiOff />
                <div>
                  <strong>Stream finalizado</strong>
                  <p>Esta transmisión ya terminó.</p>
                </div>
              </Alert>
            )}

            <PlayerCard>
              <PlayerWrap>
                <LiveVideoPlayer
                  playbackUrl={stream.playback_url || ""}
                  title={playerTitle}
                  streamStatus={stream.estado}
                  signalStatus={signalStatus}
                />
              </PlayerWrap>
            </PlayerCard>

            <StreamInfo>
              <Avatar>{initials(stream.canal.nombre_canal)}</Avatar>

              <TitleBlock>
                <h1>{stream.titulo}</h1>
                <p>
                  {stream.canal.nombre_canal} ·{" "}
                  {stream.descripcion || "Este stream no tiene descripción."}
                </p>

                <BadgeRow>
                  {isLive && <Badge $live>EN VIVO</Badge>}
                  <Badge>{stream.categoria.nombre}</Badge>
                  <Badge>{stream.calidad_actual || "720p"}</Badge>
                  <Badge>
                    <FiEye /> {stream.viewer_count || 0} espectadores
                  </Badge>
                </BadgeRow>
              </TitleBlock>

              <ButtonRow>
                {loggedIn ? (
                  <>
                    <GhostButton type="button">
                      <FiHeart /> Seguir
                    </GhostButton>
                    <GhostButton type="button">
                      <FiStar /> Suscribirse
                    </GhostButton>
                  </>
                ) : (
                  <>
                    <ButtonLink to="/login">
                      <FiHeart /> Seguir
                    </ButtonLink>
                    <ButtonLink to="/register" $primary>
                      <FiStar /> Suscribirse
                    </ButtonLink>
                  </>
                )}
              </ButtonRow>
            </StreamInfo>

            <Panel>
              <h3>Datos del stream</h3>

              <TwoCol>
                <span>Estado</span>
                <strong>{stream.estado}</strong>

                <span>Señal OBS</span>
                <strong>{signalStatus}</strong>

                <span>Categoría</span>
                <strong>{stream.categoria.nombre}</strong>

                <span>Calidad</span>
                <strong>{stream.calidad_actual || "720p"}</strong>

                <span>Inicio</span>
                <strong>{formatDate(stream.fecha_inicio)}</strong>

                <span>Fin</span>
                <strong>
                  {stream.fecha_fin ? formatDate(stream.fecha_fin) : "Sin finalizar"}
                </strong>
              </TwoCol>
            </Panel>

            <Panel>
              <h3>Transmisiones relacionadas</h3>

              {related.length === 0 ? (
                <EmptyText>
                  No hay otros directos relacionados en este momento.
                </EmptyText>
              ) : (
                <RelatedGrid>
                  {related.slice(0, 4).map((item) => (
                    <RelatedLink
                      key={item.id_stream}
                      to={`/streams/${item.id_stream}`}
                    >
                      <strong>{item.titulo}</strong>
                      <small>
                        {item.canal.nombre_canal} · {item.categoria.nombre}
                      </small>
                    </RelatedLink>
                  ))}
                </RelatedGrid>
              )}
            </Panel>
          </MainColumn>

          <SideColumn>
            <ChatBox>
              <ChatHeader>
                <h3>Chat en vivo</h3>
                {!loggedIn && <small>Solo lectura</small>}
              </ChatHeader>

              <ChatNotice>
                Chat del stream listo para conectar a Firebase/WebSocket.
              </ChatNotice>

              <ChatMessages>
                <ChatMessage>
                  <strong>GamerX</strong>
                  <span>Bienvenidos al directo real.</span>
                </ChatMessage>

                <ChatMessage>
                  <strong>LunaVibes</strong>
                  <span>Esperando señal de OBS.</span>
                </ChatMessage>
              </ChatMessages>

              {!loggedIn ? (
                <ChatLoginBox>
                  <FiLock />
                  <strong>Inicia sesión para escribir</strong>
                  <span>Como visitante puedes leer el chat.</span>
                  <ButtonLink to="/login" $primary>
                    Iniciar sesión
                  </ButtonLink>
                </ChatLoginBox>
              ) : (
                <ChatInputBox>
                  <input placeholder="Escribe un mensaje..." />
                  <button type="button">Enviar</button>
                </ChatInputBox>
              )}
            </ChatBox>

            <Panel>
              <h3>Canal</h3>

              <TwoCol>
                <span>Nombre</span>
                <strong>{stream.canal.nombre_canal}</strong>

                <span>ID canal</span>
                <strong>{stream.canal.id_canal}</strong>

                <span>Tipo</span>
                <strong>{stream.canal.tipo_canal}</strong>
              </TwoCol>
            </Panel>

            <Panel>
              <h3>Estado técnico</h3>

              <TwoCol>
                <span>Video</span>
                <strong>{isLive ? "Activo" : "No activo"}</strong>

                <span>Señal</span>
                <strong>{signalStatus}</strong>

                <span>Playback</span>
                <strong>{stream.playback_url ? "Disponible" : "No disponible"}</strong>
              </TwoCol>
            </Panel>
          </SideColumn>
        </Shell>
      </Page>
    </RootShell>
  );
}

const Page = styled.main`
  min-height: calc(100vh - 64px);
  padding: 28px;
  color: #f8fbff;

  @media (max-width: 760px) {
    padding: 18px;
  }
`;

const Shell = styled.div`
  width: min(1480px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 22px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: grid;
  gap: 18px;
  min-width: 0;
`;

const SideColumn = styled.aside`
  display: grid;
  gap: 16px;
  align-content: start;
  min-width: 0;
`;

const Alert = styled.div<{ $variant?: "warning" | "success" | "danger" }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "success"
        ? "rgba(34, 197, 94, 0.35)"
        : $variant === "danger"
          ? "rgba(244, 63, 94, 0.35)"
          : "rgba(245, 158, 11, 0.35)"};
  background: ${({ $variant }) =>
    $variant === "success"
      ? "rgba(6, 78, 59, 0.5)"
      : $variant === "danger"
        ? "rgba(88, 28, 28, 0.45)"
        : "rgba(69, 46, 12, 0.45)"};

  strong {
    display: block;
    margin-bottom: 4px;
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.78);
  }

  svg {
    flex: 0 0 auto;
  }

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const AlertActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 760px) {
    margin-left: 0;
  }
`;

const PlayerCard = styled.section`
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(0, 229, 255, 0.18);
  background: rgba(15, 23, 42, 0.78);
`;

const PlayerWrap = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 320px;
  background: #020617;

  @media (max-width: 760px) {
    min-height: 220px;
  }
`;

const StreamInfo = styled.section`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.72);

  @media (max-width: 760px) {
    grid-template-columns: 56px 1fr;
  }
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #00e5ff, #8b5cf6);
  color: #031018;
  font-weight: 950;
  font-size: 22px;

  @media (max-width: 760px) {
    width: 56px;
    height: 56px;
    border-radius: 18px;
  }
`;

const TitleBlock = styled.div`
  min-width: 0;

  h1 {
    margin: 0 0 8px;
    font-size: clamp(26px, 4vw, 42px);
    line-height: 1;
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.74);
    line-height: 1.6;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 760px) {
    grid-column: 1 / -1;
  }
`;

const ButtonLink = styled(Link)<{ $primary?: boolean }>`
  border: 1px solid
    ${({ $primary }) =>
      $primary ? "rgba(0, 229, 255, 0.55)" : "rgba(148, 163, 184, 0.22)"};
  background: ${({ $primary }) =>
    $primary
      ? "linear-gradient(135deg, #00e5ff, #22c55e)"
      : "rgba(15, 23, 42, 0.75)"};
  color: ${({ $primary }) => ($primary ? "#031018" : "#f8fbff")};
  border-radius: 12px;
  padding: 11px 14px;
  text-decoration: none;
  font-weight: 900;
  display: inline-flex;
  gap: 8px;
  align-items: center;
`;

const GhostButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(15, 23, 42, 0.75);
  color: #f8fbff;
  border-radius: 12px;
  padding: 11px 14px;
  font-weight: 900;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
`;

const Panel = styled.section`
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.72);
  padding: 18px;

  h3 {
    margin: 0 0 14px;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  color: rgba(226, 232, 240, 0.72);

  strong {
    color: #f8fbff;
    text-align: right;
  }
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const Badge = styled.span<{ $live?: boolean }>`
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ $live }) =>
    $live ? "rgba(244, 63, 94, 0.18)" : "rgba(0, 229, 255, 0.12)"};
  color: ${({ $live }) => ($live ? "#fb7185" : "#00e5ff")};
  border: 1px solid
    ${({ $live }) =>
      $live ? "rgba(244, 63, 94, 0.34)" : "rgba(0, 229, 255, 0.24)"};
`;

const ChatBox = styled.section`
  min-height: 520px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.72);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h3 {
    margin: 0;
  }

  small {
    color: #00e5ff;
    font-weight: 900;
  }
`;

const ChatNotice = styled.div`
  border-radius: 14px;
  padding: 14px;
  background: rgba(8, 47, 73, 0.45);
  border: 1px solid rgba(0, 229, 255, 0.22);
  color: rgba(226, 232, 240, 0.8);
`;

const ChatMessages = styled.div`
  display: grid;
  gap: 10px;
`;

const ChatMessage = styled.div`
  padding: 13px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.14);

  strong {
    display: block;
    margin-bottom: 5px;
  }

  span {
    color: rgba(226, 232, 240, 0.72);
    font-size: 13px;
  }
`;

const ChatLoginBox = styled.div`
  margin-top: auto;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(0, 229, 255, 0.22);
  background: rgba(8, 47, 73, 0.34);
  display: grid;
  gap: 8px;

  span {
    color: rgba(226, 232, 240, 0.7);
  }

  a {
    justify-content: center;
  }
`;

const ChatInputBox = styled.div`
  margin-top: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;

  input {
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(2, 6, 23, 0.72);
    color: #f8fbff;
    border-radius: 12px;
    padding: 12px;
    outline: none;
  }

  button {
    border: none;
    background: linear-gradient(135deg, #00e5ff, #22c55e);
    color: #031018;
    border-radius: 12px;
    padding: 12px 14px;
    font-weight: 950;
    cursor: pointer;
  }
`;

const RelatedGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const RelatedLink = styled(Link)`
  padding: 14px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.14);
  color: #f8fbff;
  text-decoration: none;

  strong {
    display: block;
    margin-bottom: 5px;
  }

  small {
    color: rgba(226, 232, 240, 0.66);
  }
`;

const EmptyText = styled.p`
  color: rgba(226, 232, 240, 0.7);
  margin: 0;
`;