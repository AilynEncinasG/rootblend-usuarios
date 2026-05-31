//frontend/src/modules/creator/streamer/pages/StreamStatsPage.tsx
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiClock,
  FiEye,
  FiMessageCircle,
  FiRadio,
  FiRefreshCw,
  FiStar,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import { RootShell } from "../../../../shared/layout";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  getMyChannel,
  getMyStreams,
  type Stream,
} from "../../../streams/services/streamsService";
import {
  getChannelInteractionSummary,
  type ChannelInteractionSummary,
} from "../../../interactions/services/interactionsService";
import { apiRequest } from "../../../../services/apiClient";

type StatsApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

type StreamStats = {
  id_stream: number;
  total_vistas: number;
  espectadores_pico: number;
  duracion_minutos: number;
  mensajes_chat: number;
  mensajes_eliminados: number;
  usuarios_chat_activos: number;
};

type DashboardTotals = {
  seguidores: number;
  suscriptores: number;
  streamsCreados: number;
  streamsEnVivo: number;
  vistasTotales: number;
  picoAudiencia: number;
  duracionTotalMinutos: number;
  mensajesChat: number;
  mensajesEliminados: number;
  usuariosChatActivos: number;
};

function numberFromUnknown(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readPath(source: unknown, path: string[]): unknown {
  let current = source;

  for (const key of path) {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

function normalizeStatsPayload(streamId: number, payload: unknown): StreamStats {
  const data =
    readPath(payload, ["data"]) ??
    readPath(payload, ["data", "estadistica"]) ??
    payload;

  const estadistica =
    readPath(data, ["estadistica"]) ??
    readPath(data, ["estadistica_stream"]) ??
    data;

  const chat =
    readPath(data, ["chat"]) ??
    readPath(data, ["metrica_chat"]) ??
    readPath(data, ["metricas_chat"]) ??
    data;

  const audiencia =
    readPath(data, ["audiencia"]) ??
    readPath(data, ["metrica_audiencia"]) ??
    readPath(data, ["metricas_audiencia"]) ??
    data;

  return {
    id_stream: streamId,
    total_vistas:
      numberFromUnknown(readPath(estadistica, ["total_vistas"])) ||
      numberFromUnknown(readPath(data, ["total_vistas"])),
    espectadores_pico:
      numberFromUnknown(readPath(estadistica, ["espectadores_pico"])) ||
      numberFromUnknown(readPath(audiencia, ["espectadores_pico"])) ||
      numberFromUnknown(readPath(data, ["espectadores_pico"])),
    duracion_minutos:
      numberFromUnknown(readPath(estadistica, ["duracion_minutos"])) ||
      numberFromUnknown(readPath(estadistica, ["duracion_total_minutos"])) ||
      numberFromUnknown(readPath(data, ["duracion_minutos"])),
    mensajes_chat:
      numberFromUnknown(readPath(chat, ["total_mensajes_chat"])) ||
      numberFromUnknown(readPath(chat, ["mensajes_chat"])) ||
      numberFromUnknown(readPath(data, ["total_mensajes_chat"])),
    mensajes_eliminados:
      numberFromUnknown(readPath(chat, ["mensajes_eliminados"])) ||
      numberFromUnknown(readPath(data, ["mensajes_eliminados"])),
    usuarios_chat_activos:
      numberFromUnknown(readPath(chat, ["usuarios_activos"])) ||
      numberFromUnknown(readPath(chat, ["usuarios_chat_activos"])) ||
      numberFromUnknown(readPath(data, ["usuarios_activos"])),
  };
}

async function getStreamStats(streamId: number): Promise<StreamStats> {
  try {
    const response = await apiRequest<StatsApiResponse>(
      `/stats/streams/${streamId}/`,
      {
        auth: true,
      },
    );

    return normalizeStatsPayload(streamId, response);
  } catch (error) {
    console.error("STREAM_STATS_LOAD_ERROR", streamId, error);

    return {
      id_stream: streamId,
      total_vistas: 0,
      espectadores_pico: 0,
      duracion_minutos: 0,
      mensajes_chat: 0,
      mensajes_eliminados: 0,
      usuarios_chat_activos: 0,
    };
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-BO").format(value);
}

function formatMinutes(value: number) {
  if (value < 60) {
    return `${Math.round(value)} min`;
  }

  const hours = Math.floor(value / 60);
  const minutes = Math.round(value % 60);

  return `${hours} h ${minutes} min`;
}

function getInitials(value?: string | null) {
  const clean = String(value || "").trim();

  if (!clean) return "RB";

  return (
    clean
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "RB"
  );
}

function getThumbnail(stream: Stream) {
  return stream.thumbnail_url || brandAssets.streamView;
}

export default function StreamerStatsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("Cargando estadísticas reales...");

  const [channelId, setChannelId] = useState<number | null>(null);
  const [channelName, setChannelName] = useState("ROOTBLEND");
  const [streams, setStreams] = useState<Stream[]>([]);
  const [interactionSummary, setInteractionSummary] =
    useState<ChannelInteractionSummary | null>(null);
  const [streamStats, setStreamStats] = useState<StreamStats[]>([]);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");
      setFeedback("Consultando canal, streams, interacciones y estadísticas...");

      try {
        const [channelResult, streamsResult] = await Promise.all([
          getMyChannel(),
          getMyStreams(),
        ]);

        if (!active) return;

        const canal = channelResult.canal;

        if (!canal) {
          setChannelId(null);
          setChannelName("Sin canal");
          setStreams([]);
          setInteractionSummary(null);
          setStreamStats([]);
          setFeedback("Tu usuario todavía no tiene un canal streamer.");
          return;
        }

        const currentChannelId = Number(canal.id_canal);

        setChannelId(currentChannelId);
        setChannelName(canal.nombre_canal);
        setStreams(streamsResult);

        const [summaryResult, statsResult] = await Promise.all([
          getChannelInteractionSummary(currentChannelId).catch((summaryError) => {
            console.error("CHANNEL_SUMMARY_ERROR", summaryError);

            return {
              id_canal: currentChannelId,
              nombre_canal: canal.nombre_canal,
              seguidores: 0,
              suscriptores: 0,
            } satisfies ChannelInteractionSummary;
          }),
          Promise.all(
            streamsResult.map((stream) => getStreamStats(stream.id_stream)),
          ),
        ]);

        if (!active) return;

        setInteractionSummary(summaryResult);
        setStreamStats(statsResult);
        setFeedback(
          `Dashboard conectado al canal ${canal.nombre_canal}. Datos leídos desde interacciones-service y estadísticas-service.`,
        );
      } catch (requestError) {
        console.error("STREAMER_STATS_DASHBOARD_ERROR", requestError);

        if (active) {
          setError(
            "No se pudieron cargar las estadísticas reales del streamer.",
          );
          setFeedback(
            "Revisa que canales-streaming-service, interacciones-service y estadísticas-service estén activos.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const totals = useMemo<DashboardTotals>(() => {
    const liveStreams = streams.filter((stream) => stream.estado === "en_vivo");

    return {
      seguidores: interactionSummary?.seguidores || 0,
      suscriptores: interactionSummary?.suscriptores || 0,
      streamsCreados: streams.length,
      streamsEnVivo: liveStreams.length,
      vistasTotales: streamStats.reduce(
        (total, item) => total + item.total_vistas,
        0,
      ),
      picoAudiencia: Math.max(
        0,
        ...streamStats.map((item) => item.espectadores_pico),
      ),
      duracionTotalMinutos: streamStats.reduce(
        (total, item) => total + item.duracion_minutos,
        0,
      ),
      mensajesChat: streamStats.reduce(
        (total, item) => total + item.mensajes_chat,
        0,
      ),
      mensajesEliminados: streamStats.reduce(
        (total, item) => total + item.mensajes_eliminados,
        0,
      ),
      usuariosChatActivos: Math.max(
        0,
        ...streamStats.map((item) => item.usuarios_chat_activos),
      ),
    };
  }, [interactionSummary, streamStats, streams]);

  const recentStreams = streams.slice(0, 6);

  const maxStreamValue = Math.max(
    1,
    ...streamStats.map(
      (item) =>
        item.total_vistas +
        item.mensajes_chat +
        item.espectadores_pico +
        item.mensajes_eliminados,
    ),
  );

  return (
    <RootShell active="creator">
      <div style={pageStyle}>
        <section style={heroStyle}>
          <div style={avatarStyle}>{getInitials(channelName)}</div>

          <div>
            <p style={eyebrowStyle}>ROOTBLEND CREATOR</p>
            <h1 style={titleStyle}>Estadísticas de stream</h1>
            <p style={subtitleStyle}>
              Seguidores, suscriptores, audiencia, vistas y actividad del chat.
            </p>
          </div>
        </section>

        {loading && (
          <section style={alertStyle}>
            <FiRefreshCw />
            <div>
              <strong>Cargando dashboard</strong>
              <p>{feedback}</p>
            </div>
          </section>
        )}

        {error && (
          <section style={warningStyle}>
            <FiAlertTriangle />
            <div>
              <strong>No se pudo cargar todo</strong>
              <p>{error}</p>
            </div>
          </section>
        )}

        {!loading && (
          <section style={alertStyle}>
            <FiActivity />
            <div>
              <strong>{channelName}</strong>
              <p>{feedback}</p>
            </div>
            <span style={pillStyle}>Canal #{channelId || "-"}</span>
          </section>
        )}

        <section style={metricGridStyle}>
          <MetricCard
            icon={<FiUsers />}
            label="Seguidores"
            value={formatNumber(totals.seguidores)}
            detail="Interacciones reales"
          />

          <MetricCard
            icon={<FiStar />}
            label="Suscriptores"
            value={formatNumber(totals.suscriptores)}
            detail="Suscripciones activas"
          />

          <MetricCard
            icon={<FiRadio />}
            label="Streams creados"
            value={formatNumber(totals.streamsCreados)}
            detail={`${totals.streamsEnVivo} en vivo`}
          />

          <MetricCard
            icon={<FiTrendingUp />}
            label="Pico de audiencia"
            value={formatNumber(totals.picoAudiencia)}
            detail="Máximo simultáneo"
          />

          <MetricCard
            icon={<FiEye />}
            label="Vistas totales"
            value={formatNumber(totals.vistasTotales)}
            detail="Estadísticas-service"
          />

          <MetricCard
            icon={<FiClock />}
            label="Duración total"
            value={formatMinutes(totals.duracionTotalMinutos)}
            detail="Streams finalizados"
          />

          <MetricCard
            icon={<FiMessageCircle />}
            label="Mensajes de chat"
            value={formatNumber(totals.mensajesChat)}
            detail={`${formatNumber(totals.usuariosChatActivos)} usuarios activos`}
          />

          <MetricCard
            icon={<FiTrash2 />}
            label="Mensajes eliminados"
            value={formatNumber(totals.mensajesEliminados)}
            detail="Moderación del chat"
          />
        </section>

        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={panelTitleStyle}>Resumen por stream</h2>
              <p style={panelSubtitleStyle}>
                Comparativa usando vistas, pico de audiencia y actividad del chat.
              </p>
            </div>
            <FiBarChart2 />
          </div>

          {streamStats.length === 0 ? (
            <EmptyBox
              title="Sin estadísticas todavía"
              text="Cuando crees o transmitas un stream, estadísticas-service empezará a registrar métricas."
            />
          ) : (
            <div style={chartListStyle}>
              {streamStats.map((stats) => {
                const stream = streams.find(
                  (item) => item.id_stream === stats.id_stream,
                );

                const totalValue =
                  stats.total_vistas +
                  stats.mensajes_chat +
                  stats.espectadores_pico +
                  stats.mensajes_eliminados;

                const width = Math.max(8, (totalValue / maxStreamValue) * 100);

                return (
                  <div key={stats.id_stream} style={chartRowStyle}>
                    <div style={chartInfoStyle}>
                      <strong>{stream?.titulo || `Stream #${stats.id_stream}`}</strong>
                      <small>
                        Vistas: {formatNumber(stats.total_vistas)} · Pico:{" "}
                        {formatNumber(stats.espectadores_pico)} · Chat:{" "}
                        {formatNumber(stats.mensajes_chat)}
                      </small>
                    </div>

                    <div style={barTrackStyle}>
                      <div style={{ ...barFillStyle, width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section style={sectionStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={panelTitleStyle}>Streams recientes</h2>
              <p style={panelSubtitleStyle}>
                Últimos streams creados por tu canal.
              </p>
            </div>
          </div>

          {recentStreams.length === 0 ? (
            <EmptyBox
              title="Sin streams creados"
              text="Crea un stream para que aparezca en este dashboard."
            />
          ) : (
            <div style={streamGridStyle}>
              {recentStreams.map((stream) => (
                <article key={stream.id_stream} style={streamCardStyle}>
                  <div
                    style={{
                      ...streamThumbStyle,
                      background: `linear-gradient(180deg, color-mix(in srgb, var(--rb-bg-deep) 8%, transparent), color-mix(in srgb, var(--rb-bg-deep) 72%, transparent)), url(${getThumbnail(
                        stream,
                      )}) center/cover`,
                    }}
                  >
                    <span style={liveBadgeStyle}>
                      {stream.estado === "en_vivo"
                        ? "EN VIVO"
                        : stream.estado.toUpperCase()}
                    </span>
                  </div>

                  <div style={streamBodyStyle}>
                    <strong>{stream.titulo}</strong>
                    <small>
                      {stream.categoria.nombre} · {stream.viewer_count || 0} viewers
                    </small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </RootShell>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article style={metricCardStyle}>
      <div style={metricIconStyle}>{icon}</div>
      <span style={{ color: "var(--rb-muted)", fontWeight: 800 }}>{label}</span>
      <strong style={{ color: "var(--rb-text-strong)", fontSize: 26 }}>{value}</strong>
      <small style={{ color: "var(--rb-muted-soft)" }}>{detail}</small>
    </article>
  );
}

function EmptyBox({ title, text }: { title: string; text: string }) {
  return (
    <div style={emptyBoxStyle}>
      <FiBarChart2 style={{ color: "var(--rb-accent)" }} />
      <strong style={{ color: "var(--rb-text-strong)" }}>{title}</strong>
      <p style={{ margin: 0, color: "var(--rb-muted)" }}>{text}</p>
    </div>
  );
}

const pageStyle: CSSProperties = {
  display: "grid",
  gap: 22,
  color: "var(--rb-text)",
};

const heroStyle: CSSProperties = {
  minHeight: 210,
  padding: 34,
  borderRadius: 22,
  border: "1px solid var(--rb-border-strong)",
  background: `linear-gradient(90deg, color-mix(in srgb, var(--rb-panel) 90%, transparent), color-mix(in srgb, var(--rb-panel) 46%, transparent)), url(${brandAssets.streamView}) center/cover`,
  display: "flex",
  alignItems: "center",
  gap: 24,
  boxShadow: "0 18px 48px var(--rb-shadow)",
  color: "var(--rb-text)",
};

const avatarStyle: CSSProperties = {
  width: 84,
  height: 84,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  color: "var(--rb-text-inverse)",
  background: "linear-gradient(135deg, var(--rb-accent), var(--rb-accent-2))",
  fontSize: 28,
  fontWeight: 950,
  boxShadow: "0 14px 32px color-mix(in srgb, var(--rb-accent) 18%, transparent)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--rb-accent)",
  fontSize: 13,
  fontWeight: 950,
};

const titleStyle: CSSProperties = {
  margin: "6px 0",
  color: "var(--rb-text-strong)",
  fontSize: "clamp(32px, 4vw, 48px)",
  lineHeight: 1,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--rb-muted)",
  fontSize: 16,
};

const alertStyle: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid color-mix(in srgb, var(--rb-accent) 24%, transparent)",
  background: "color-mix(in srgb, var(--rb-accent) 8%, transparent)",
  color: "var(--rb-text)",
  display: "flex",
  alignItems: "center",
  gap: 12,
  boxShadow: "0 12px 30px color-mix(in srgb, var(--rb-shadow) 34%, transparent)",
};

const warningStyle: CSSProperties = {
  ...alertStyle,
  border: "1px solid color-mix(in srgb, var(--rb-warning) 36%, transparent)",
  background: "color-mix(in srgb, var(--rb-warning) 10%, transparent)",
};

const pillStyle: CSSProperties = {
  marginLeft: "auto",
  padding: "6px 10px",
  borderRadius: 999,
  color: "var(--rb-text-inverse)",
  background: "var(--rb-accent)",
  fontSize: 12,
  fontWeight: 950,
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 14,
};

const metricCardStyle: CSSProperties = {
  minHeight: 130,
  padding: 18,
  borderRadius: 18,
  border: "1px solid var(--rb-border)",
  background: "var(--rb-card-bg)",
  display: "grid",
  gap: 6,
  color: "var(--rb-text)",
  boxShadow: "0 14px 36px color-mix(in srgb, var(--rb-shadow) 42%, transparent)",
};

const metricIconStyle: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  color: "var(--rb-accent)",
  background: "color-mix(in srgb, var(--rb-accent) 10%, transparent)",
  border: "1px solid color-mix(in srgb, var(--rb-accent) 18%, transparent)",
};

const panelStyle: CSSProperties = {
  padding: 20,
  borderRadius: 20,
  border: "1px solid var(--rb-border)",
  background: "var(--rb-panel)",
  color: "var(--rb-text)",
  boxShadow: "0 16px 42px color-mix(in srgb, var(--rb-shadow) 40%, transparent)",
};

const sectionStyle: CSSProperties = {
  ...panelStyle,
};

const panelHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  marginBottom: 18,
  color: "var(--rb-text)",
};

const panelTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--rb-text-strong)",
  fontSize: 22,
};

const panelSubtitleStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--rb-muted)",
};

const chartListStyle: CSSProperties = {
  display: "grid",
  gap: 14,
};

const chartRowStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  color: "var(--rb-text)",
};

const chartInfoStyle: CSSProperties = {
  display: "grid",
  gap: 3,
  color: "var(--rb-muted)",
};

const barTrackStyle: CSSProperties = {
  height: 12,
  borderRadius: 999,
  overflow: "hidden",
  background: "color-mix(in srgb, var(--rb-muted-soft) 18%, transparent)",
  border: "1px solid color-mix(in srgb, var(--rb-border) 70%, transparent)",
};

const barFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg, var(--rb-accent), var(--rb-accent-2))",
};

const streamGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 14,
};

const streamCardStyle: CSSProperties = {
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid var(--rb-border)",
  background: "var(--rb-card-bg)",
  color: "var(--rb-text)",
  boxShadow: "0 14px 34px color-mix(in srgb, var(--rb-shadow) 38%, transparent)",
};

const streamThumbStyle: CSSProperties = {
  minHeight: 125,
  position: "relative",
};

const liveBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 10,
  left: 10,
  padding: "5px 9px",
  borderRadius: 999,
  color: "var(--rb-text-inverse)",
  background: "var(--rb-danger)",
  fontSize: 11,
  fontWeight: 950,
  boxShadow: "0 8px 18px color-mix(in srgb, var(--rb-danger) 26%, transparent)",
};

const streamBodyStyle: CSSProperties = {
  padding: 14,
  display: "grid",
  gap: 6,
  color: "var(--rb-text)",
};

const emptyBoxStyle: CSSProperties = {
  minHeight: 160,
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  gap: 8,
  color: "var(--rb-muted)",
};
