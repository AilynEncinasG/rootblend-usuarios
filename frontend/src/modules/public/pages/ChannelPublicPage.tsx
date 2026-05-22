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
  FiPlay,
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
  getMomentos,
  type Canal,
  type MomentoDestacado,
  type Stream,
} from "../../streams/services/streamsService";
import { isAuthenticated } from "../../auth/utils/authStorage";
import {
  followChannel,
  getChannelInteractionState,
  subscribeChannel,
  unfollowChannel,
  unsubscribeChannel,
} from "../../interactions/services/interactionsService";

function normalizeMediaUrl(value?: string | null) {
  if (!value) return "";

  const cleanValue = value.trim();

  if (cleanValue.startsWith("http://localhost/media/")) {
    return cleanValue.replace(
      "http://localhost/media/",
      "http://localhost:8080/canales-media/",
    );
  }

  if (cleanValue.startsWith("http://127.0.0.1/media/")) {
    return cleanValue.replace(
      "http://127.0.0.1/media/",
      "http://localhost:8080/canales-media/",
    );
  }

  if (cleanValue.startsWith("/media/")) {
    return cleanValue.replace(
      "/media/",
      "http://localhost:8080/canales-media/",
    );
  }

  return cleanValue;
}

function isImageUrl(value?: string | null) {
  const cleanValue = normalizeMediaUrl(value);

  return (
    cleanValue.startsWith("http://") ||
    cleanValue.startsWith("https://") ||
    cleanValue.startsWith("data:image/")
  );
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

function getInteractionChannelType(channel: Canal | null) {
  if (!channel) return "streamer";

  const typeValue = channel.tipo_canal;

  if (typeof typeValue === "string") {
    return typeValue;
  }

  return typeValue?.nombre_tipo || "streamer";
}

function StreamCard({ stream }: { stream: Stream }) {
  const image = normalizeMediaUrl(stream.thumbnail_url || brandAssets.streamView);

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
            gap: 8,
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

function MomentCard({ momento }: { momento: MomentoDestacado }) {
  const image = normalizeMediaUrl(
    momento.thumbnail_url ||
      momento.stream?.thumbnail_url ||
      brandAssets.streamView,
  );

  return (
    <Link
      to={`/moments/${momento.id_momento}`}
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
          border: "1px solid rgba(0, 234, 255, 0.20)",
          background: "rgba(15, 23, 42, 0.78)",
          boxShadow: "0 18px 50px rgba(0,0,0,.22)",
        }}
      >
        <div
          style={{
            minHeight: 150,
            background: `linear-gradient(180deg, rgba(2,8,26,.06), rgba(2,8,26,.70)), url(${image}) center/cover`,
            position: "relative",
            display: "grid",
            placeItems: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              borderRadius: 999,
              padding: "6px 10px",
              background: "#8b5cf6",
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            CLIP
          </span>

          <FiPlay
            style={{
              width: 54,
              height: 54,
              padding: 14,
              borderRadius: "50%",
              color: "#00eaff",
              background: "rgba(2, 6, 23, 0.72)",
              border: "1px solid rgba(0, 234, 255, 0.40)",
            }}
          />
        </div>

        <div
          style={{
            padding: 16,
            display: "grid",
            gap: 8,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              lineHeight: 1.15,
            }}
          >
            {momento.titulo}
          </h3>

          <p
            style={{
              margin: 0,
              color: "rgba(203, 213, 225, 0.78)",
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            {momento.descripcion || "Clip destacado del canal."}
          </p>

          <small style={{ color: "rgba(203, 213, 225, 0.70)" }}>
            {momento.vistas_count || 0} vistas
            {momento.duracion ? ` · ${momento.duracion}` : ""}
          </small>
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
  const [momentos, setMomentos] = useState<MomentoDestacado[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [following, setFollowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [interactionFeedback, setInteractionFeedback] = useState("");

  useEffect(() => {
    let active = true;

    async function loadChannelPage() {
      setLoading(true);
      setError("");
      setInteractionFeedback("");

      if (!Number.isFinite(numericChannelId) || numericChannelId <= 0) {
        setError("ID de canal inválido.");
        setLoading(false);
        return;
      }

      try {
        const [channelResult, allStreams, channelMomentos] = await Promise.all([
          getChannelById(numericChannelId),
          getAllStreams(),
          getMomentos({ canal: numericChannelId, destacados: true }),
        ]);

        if (!active) return;

        const channelStreams = allStreams.filter(
          (stream) => stream.canal.id_canal === numericChannelId,
        );

        setChannel(channelResult);
        setStreams(channelStreams);
        setMomentos(channelMomentos);
      } catch (requestError) {
        console.error("CHANNEL_PUBLIC_LOAD_ERROR", requestError);

        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el canal.",
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

  useEffect(() => {
    let active = true;

    async function loadInteractionState() {
      if (
        !Number.isFinite(numericChannelId) ||
        numericChannelId <= 0 ||
        !isAuthenticated()
      ) {
        setFollowing(false);
        setSubscribed(false);
        return;
      }

      try {
        const state = await getChannelInteractionState(numericChannelId);

        if (!active) return;

        setFollowing(Boolean(state.siguiendo));
        setSubscribed(Boolean(state.suscrito));
      } catch (requestError) {
        console.error("CHANNEL_INTERACTION_STATE_ERROR", requestError);

        if (active) {
          setFollowing(false);
          setSubscribed(false);
        }
      }
    }

    loadInteractionState();

    return () => {
      active = false;
    };
  }, [numericChannelId]);

  const liveStreams = useMemo(
    () => streams.filter((stream) => stream.estado === "en_vivo"),
    [streams],
  );

  const recentStreams = useMemo(
    () => streams.filter((stream) => stream.estado !== "en_vivo").slice(0, 8),
    [streams],
  );

  const featuredMoments = useMemo(
    () => momentos.filter((momento) => momento.destacado).slice(0, 8),
    [momentos],
  );

  const channelBanner = normalizeMediaUrl(channel?.banner_canal || "");
  const channelPhoto = normalizeMediaUrl(channel?.foto_canal || "");
  const avatarText = getInitials(channel?.nombre_canal || "RB");

  async function toggleFollow() {
    if (!Number.isFinite(numericChannelId) || numericChannelId <= 0) return;

    if (!isAuthenticated()) {
      setInteractionFeedback("Debes iniciar sesión para seguir canales.");
      return;
    }

    try {
      setInteractionLoading(true);
      setInteractionFeedback("");

      if (following) {
        const state = await unfollowChannel(numericChannelId);

        setFollowing(Boolean(state.siguiendo));
        setSubscribed(Boolean(state.suscrito));
        setInteractionFeedback("Dejaste de seguir este canal.");
      } else {
        const state = await followChannel({
          id_canal: numericChannelId,
          nombre_canal: channel?.nombre_canal || "Canal ROOTBLEND",
          tipo_canal: getInteractionChannelType(channel),
          estado_transmision: liveStreams.length > 0 ? "online" : "offline",
        });

        setFollowing(Boolean(state.siguiendo));
        setSubscribed(Boolean(state.suscrito));
        setInteractionFeedback("Ahora sigues este canal.");
      }
    } catch (requestError) {
      console.error("CHANNEL_FOLLOW_TOGGLE_ERROR", requestError);
      setInteractionFeedback("No se pudo actualizar el seguimiento.");
    } finally {
      setInteractionLoading(false);
    }
  }

  async function toggleSubscription() {
    if (!Number.isFinite(numericChannelId) || numericChannelId <= 0) return;

    if (!isAuthenticated()) {
      setInteractionFeedback("Debes iniciar sesión para suscribirte.");
      return;
    }

    try {
      setInteractionLoading(true);
      setInteractionFeedback("");

      if (subscribed) {
        const state = await unsubscribeChannel(numericChannelId);

        setFollowing(Boolean(state.siguiendo));
        setSubscribed(Boolean(state.suscrito));
        setInteractionFeedback("Suscripción cancelada.");
      } else {
        const state = await subscribeChannel({
          id_canal: numericChannelId,
          nombre_canal: channel?.nombre_canal || "Canal ROOTBLEND",
          tipo_canal: getInteractionChannelType(channel),
          estado_transmision: liveStreams.length > 0 ? "online" : "offline",
          tipo_plan: "comunidad",
        });

        setFollowing(Boolean(state.siguiendo));
        setSubscribed(Boolean(state.suscrito));
        setInteractionFeedback("Te suscribiste a este canal.");
      }
    } catch (requestError) {
      console.error("CHANNEL_SUBSCRIPTION_TOGGLE_ERROR", requestError);
      setInteractionFeedback("No se pudo actualizar la suscripción.");
    } finally {
      setInteractionLoading(false);
    }
  }

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
                <div
                  style={{
                    width: 118,
                    height: 118,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid rgba(0, 234, 255, 0.65)",
                    background: "linear-gradient(135deg, #00eaff, #8b5cf6)",
                    display: "grid",
                    placeItems: "center",
                    color: "#020617",
                    fontWeight: 900,
                    fontSize: 28,
                    flex: "0 0 auto",
                  }}
                >
                  {isImageUrl(channelPhoto) ? (
                    <img
                      src={channelPhoto}
                      alt={channel.nombre_canal}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    avatarText
                  )}
                </div>

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
                      onClick={toggleFollow}
                      disabled={interactionLoading}
                      style={{
                        border: 0,
                        borderRadius: 14,
                        minHeight: 44,
                        padding: "0 18px",
                        background: following
                          ? "linear-gradient(135deg, #22c55e, #16a34a)"
                          : "linear-gradient(135deg, #00eaff, #22c55e)",
                        color: "#020617",
                        fontWeight: 900,
                        cursor: interactionLoading ? "not-allowed" : "pointer",
                        opacity: interactionLoading ? 0.7 : 1,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <FiUserPlus /> {following ? "Siguiendo" : "Seguir"}
                    </button>

                    <button
                      type="button"
                      disabled={!following || interactionLoading}
                      style={{
                        border: "1px solid rgba(0, 234, 255, 0.45)",
                        borderRadius: 14,
                        minHeight: 44,
                        padding: "0 18px",
                        background: following
                          ? "rgba(0, 234, 255, 0.16)"
                          : "rgba(15, 23, 42, 0.72)",
                        color: following ? "#ffffff" : "rgba(226,232,240,.55)",
                        fontWeight: 900,
                        cursor: following ? "default" : "not-allowed",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <FiBell />{" "}
                      {following ? "Notificaciones activas" : "Notificarme"}
                    </button>

                    <button
                      type="button"
                      onClick={toggleSubscription}
                      disabled={interactionLoading}
                      style={{
                        border: "1px solid rgba(168, 85, 247, 0.45)",
                        borderRadius: 14,
                        minHeight: 44,
                        padding: "0 18px",
                        background: subscribed
                          ? "rgba(34, 197, 94, 0.26)"
                          : "rgba(88, 28, 135, 0.30)",
                        color: "#ffffff",
                        fontWeight: 900,
                        cursor: interactionLoading ? "not-allowed" : "pointer",
                        opacity: interactionLoading ? 0.7 : 1,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <FiHeart /> {subscribed ? "Suscrito" : "Suscribirse"}
                    </button>
                  </div>

                  {interactionFeedback ? (
                    <p
                      style={{
                        margin: "12px 0 0",
                        color: "#00eaff",
                        fontWeight: 850,
                      }}
                    >
                      {interactionFeedback}
                    </p>
                  ) : null}
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
                <span>Momentos</span>
                <strong>{featuredMoments.length}</strong>
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
                <span>{featuredMoments.length} clips</span>
              </div>

              {featuredMoments.length > 0 ? (
                <div style={gridStyle}>
                  {featuredMoments.map((momento) => (
                    <MomentCard key={momento.id_momento} momento={momento} />
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={<FiStar />}
                  title="Sin momentos destacados"
                  text="Los clips publicados por el streamer aparecerán en esta sección."
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