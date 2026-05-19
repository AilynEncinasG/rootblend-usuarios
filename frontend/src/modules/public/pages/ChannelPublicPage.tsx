import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiBell,
  FiHeart,
  FiRadio,
  FiRefreshCw,
  FiStar,
  FiUserPlus,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import { getInitials } from "../../../shared/utils/rootblendHelpers";
import {
  getAllStreams,
  getChannelById,
  type Canal,
  type Stream,
} from "../../streams/services/streamsService";

function isImageUrl(value?: string | null) {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://");
}

function streamStatusLabel(status: Stream["estado"]) {
  if (status === "en_vivo") return "EN VIVO";
  if (status === "programado") return "PROGRAMADO";
  return "FINALIZADO";
}

function streamStatusColor(status: Stream["estado"]) {
  if (status === "en_vivo") return "#ff2d55";
  if (status === "programado") return "#00eaff";
  return "#94a3b8";
}

function getChannelTypeName(channel: Canal) {
  const typeValue = channel.tipo_canal;

  if (typeof typeValue === "string") {
    return typeValue;
  }

  return typeValue?.nombre_tipo || "streamer";
}

function ChannelAvatar({
  image,
  name,
  size = 42,
}: {
  image?: string | null;
  name: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "linear-gradient(135deg, #00eaff, #8b5cf6)",
        display: "grid",
        placeItems: "center",
        color: "#020617",
        fontWeight: 900,
        fontSize: size >= 100 ? 28 : 15,
        border: "2px solid rgba(0, 234, 255, 0.55)",
        flex: "0 0 auto",
      }}
    >
      {isImageUrl(image) ? (
        <img
          src={image || ""}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}

function StreamCard({ stream }: { stream: Stream }) {
  const image = stream.thumbnail_url || brandAssets.streamView;
  const channelPhoto = stream.canal.foto_canal || "";
  const channelName = stream.canal.nombre_canal || "ROOTBLEND";

  return (
    <Link
      to={`/streams/${stream.id_stream}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <article
        style={{
          overflow: "hidden",
          borderRadius: 18,
          border: "1px solid rgba(148, 163, 184, 0.14)",
          background: "rgba(15, 23, 42, 0.78)",
          boxShadow: "0 18px 50px rgba(0,0,0,.22)",
        }}
      >
        <div
          style={{
            minHeight: 150,
            background: `linear-gradient(180deg, rgba(2,8,26,.05), rgba(2,8,26,.62)), url(${image}) center/cover`,
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              borderRadius: 999,
              padding: "6px 10px",
              background: streamStatusColor(stream.estado),
              color: stream.estado === "finalizado" ? "#020617" : "#ffffff",
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            {streamStatusLabel(stream.estado)}
          </span>
        </div>

        <div
          style={{
            padding: 16,
            display: "grid",
            gap: 10,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              lineHeight: 1.15,
            }}
          >
            {stream.titulo}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "rgba(226, 232, 240, 0.88)",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            <ChannelAvatar image={channelPhoto} name={channelName} size={38} />
            <span>{channelName}</span>
          </div>

          <p
            style={{
              margin: 0,
              color: "rgba(203, 213, 225, 0.78)",
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            {stream.descripcion || "Este stream todavía no tiene descripción."}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              color: "rgba(203, 213, 225, 0.76)",
              fontSize: 13,
            }}
          >
            <span>{stream.categoria.nombre}</span>
            <span>{stream.viewer_count || 0} viewers</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function EmptySection({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(148, 163, 184, 0.14)",
        borderRadius: 22,
        padding: 28,
        background: "rgba(15, 23, 42, 0.70)",
        display: "grid",
        justifyItems: "center",
        textAlign: "center",
        gap: 10,
        color: "rgba(226, 232, 240, 0.86)",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          display: "grid",
          placeItems: "center",
          borderRadius: 18,
          background: "rgba(0, 234, 255, 0.10)",
          color: "#00eaff",
          fontSize: 28,
        }}
      >
        {icon}
      </div>

      <strong style={{ fontSize: 18 }}>{title}</strong>
      <p style={{ margin: 0, maxWidth: 420 }}>{text}</p>
    </div>
  );
}

export default function ChannelPublicPage() {
  const { channelId } = useParams();

  const numericChannelId = Number(channelId);

  const [channel, setChannel] = useState<Canal | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadChannelPage() {
      setLoading(true);
      setError("");

      if (!Number.isFinite(numericChannelId) || numericChannelId <= 0) {
        setError("ID de canal inválido.");
        setLoading(false);
        return;
      }

      try {
        const [channelResult, allStreams] = await Promise.all([
          getChannelById(numericChannelId),
          getAllStreams(),
        ]);

        if (!active) return;

        const channelStreams = allStreams.filter(
          (stream) => stream.canal.id_canal === numericChannelId
        );

        setChannel(channelResult);
        setStreams(channelStreams);
      } catch (requestError) {
        console.error("CHANNEL_PUBLIC_LOAD_ERROR", requestError);

        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el canal."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadChannelPage();

    return () => {
      active = false;
    };
  }, [numericChannelId]);

  const liveStreams = useMemo(
    () => streams.filter((stream) => stream.estado === "en_vivo"),
    [streams]
  );

  const recentStreams = useMemo(
    () => streams.filter((stream) => stream.estado !== "en_vivo").slice(0, 8),
    [streams]
  );

  const featuredStreams = useMemo(
    () => streams.filter((stream) => stream.destacado).slice(0, 6),
    [streams]
  );

  const channelBanner = channel?.banner_canal || "";
  const channelPhoto = channel?.foto_canal || "";

  return (
    <RootShell active="home">
      <div
        style={{
          width: "100%",
          display: "grid",
          gap: 26,
        }}
      >
        {loading ? (
          <div
            style={{
              border: "1px solid rgba(148, 163, 184, 0.14)",
              borderRadius: 22,
              padding: 24,
              background: "rgba(15, 23, 42, 0.78)",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <FiRefreshCw />
            <div>
              <strong>Cargando canal</strong>
              <p style={{ margin: "4px 0 0" }}>
                Consultando información real del canal.
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            style={{
              border: "1px solid rgba(250, 204, 21, 0.35)",
              borderRadius: 22,
              padding: 24,
              background: "rgba(250, 204, 21, 0.10)",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <FiAlertTriangle />
            <div>
              <strong>No se pudo cargar el canal</strong>
              <p style={{ margin: "4px 0 0" }}>{error}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && channel ? (
          <>
            <section
              style={{
                minHeight: 315,
                borderRadius: 28,
                overflow: "hidden",
                border: "1px solid rgba(0, 234, 255, 0.18)",
                background: isImageUrl(channelBanner)
                  ? `linear-gradient(90deg, rgba(2,8,26,.84), rgba(2,8,26,.32), rgba(2,8,26,.86)), url(${channelBanner}) center/cover`
                  : `linear-gradient(90deg, rgba(2,8,26,.84), rgba(2,8,26,.40)), url(${brandAssets.channelView}) center/cover`,
                display: "flex",
                alignItems: "flex-end",
                padding: 34,
                boxShadow: "0 24px 80px rgba(0,0,0,.30)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  maxWidth: 900,
                }}
              >
                <ChannelAvatar
                  image={channelPhoto}
                  name={channel.nombre_canal}
                  size={118}
                />

                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#00eaff",
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                  >
                    ROOTBLEND Channel
                  </p>

                  <h1
                    style={{
                      margin: "4px 0",
                      fontSize: "clamp(42px, 5vw, 72px)",
                      lineHeight: 0.95,
                    }}
                  >
                    {channel.nombre_canal}
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      color: "rgba(226, 232, 240, 0.88)",
                      fontSize: 18,
                      maxWidth: 720,
                    }}
                  >
                    {channel.descripcion ||
                      "Este canal todavía no tiene descripción pública."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      marginTop: 18,
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        border: 0,
                        borderRadius: 14,
                        minHeight: 44,
                        padding: "0 18px",
                        background: "linear-gradient(135deg, #00eaff, #22c55e)",
                        color: "#020617",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      <FiUserPlus /> Seguir
                    </button>

                    <button
                      type="button"
                      style={{
                        border: "1px solid rgba(0, 234, 255, 0.45)",
                        borderRadius: 14,
                        minHeight: 44,
                        padding: "0 18px",
                        background: "rgba(15, 23, 42, 0.72)",
                        color: "#ffffff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      <FiBell /> Notificarme
                    </button>

                    <button
                      type="button"
                      style={{
                        border: "1px solid rgba(168, 85, 247, 0.45)",
                        borderRadius: 14,
                        minHeight: 44,
                        padding: "0 18px",
                        background: "rgba(88, 28, 135, 0.30)",
                        color: "#ffffff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      <FiHeart /> Suscribirse
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              <div style={metricStyle}>
                <span>Tipo</span>
                <strong>{getChannelTypeName(channel)}</strong>
              </div>
              <div style={metricStyle}>
                <span>Streams</span>
                <strong>{streams.length}</strong>
              </div>
              <div style={metricStyle}>
                <span>En vivo</span>
                <strong>{liveStreams.length}</strong>
              </div>
              <div style={metricStyle}>
                <span>Destacados</span>
                <strong>{featuredStreams.length}</strong>
              </div>
            </section>

            <section style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <h2>En vivo ahora</h2>
                <span>{liveStreams.length} directos</span>
              </div>

              {liveStreams.length > 0 ? (
                <div style={gridStyle}>
                  {liveStreams.map((stream) => (
                    <StreamCard key={stream.id_stream} stream={stream} />
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={<FiRadio />}
                  title="Sin transmisiones en vivo"
                  text="Cuando este canal inicie una transmisión, aparecerá aquí."
                />
              )}
            </section>

            <section style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <h2>Streams recientes</h2>
                <span>{recentStreams.length} streams</span>
              </div>

              {recentStreams.length > 0 ? (
                <div style={gridStyle}>
                  {recentStreams.map((stream) => (
                    <StreamCard key={stream.id_stream} stream={stream} />
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={<FiRadio />}
                  title="Aún no hay streams recientes"
                  text="Los streams programados o finalizados aparecerán aquí."
                />
              )}
            </section>

            <section style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <h2>Momentos destacados</h2>
                <span>{featuredStreams.length} destacados</span>
              </div>

              {featuredStreams.length > 0 ? (
                <div style={gridStyle}>
                  {featuredStreams.map((stream) => (
                    <StreamCard key={stream.id_stream} stream={stream} />
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={<FiStar />}
                  title="Sin momentos destacados"
                  text="Los streams marcados como destacados aparecerán en esta sección."
                />
              )}
            </section>
          </>
        ) : null}
      </div>
    </RootShell>
  );
}

const metricStyle: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.14)",
  borderRadius: 18,
  padding: 18,
  background: "rgba(15, 23, 42, 0.74)",
  display: "grid",
  gap: 6,
};

const sectionStyle: CSSProperties = {
  display: "grid",
  gap: 16,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 16,
};