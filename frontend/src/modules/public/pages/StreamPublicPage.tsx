import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiClock,
  FiEye,
  FiRefreshCw,
  FiRadio,
  FiTv,
  FiUser,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import { getInitials } from "../../../shared/utils/rootblendHelpers";
import {
  getStreamById,
  getStreamSignalStatus,
  joinStreamViewer,
  leaveStreamViewer,
  type Stream,
} from "../../streams/services/streamsService";

function isImageUrl(value?: string | null) {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://");
}

function statusLabel(status?: Stream["estado"]) {
  if (status === "en_vivo") return "EN VIVO";
  if (status === "programado") return "PROGRAMADO";
  if (status === "finalizado") return "FINALIZADO";
  return "STREAM";
}

function statusColor(status?: Stream["estado"]) {
  if (status === "en_vivo") return "#ff2d55";
  if (status === "programado") return "#00eaff";
  return "#94a3b8";
}

function ChannelAvatar({
  image,
  name,
}: {
  image?: string | null;
  name: string;
}) {
  return (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        overflow: "hidden",
        background: "linear-gradient(135deg, #00eaff, #8b5cf6)",
        display: "grid",
        placeItems: "center",
        color: "#020617",
        fontWeight: 900,
        fontSize: 24,
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

export default function StreamPublicPage() {
  const { streamId } = useParams();

  const numericStreamId = Number(streamId);

  const [stream, setStream] = useState<Stream | null>(null);
  const [viewerCount, setViewerCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const thumbnail = useMemo(() => {
    return stream?.thumbnail_url || brandAssets.streamView;
  }, [stream]);

  useEffect(() => {
    let active = true;
    let joined = false;
    let intervalId: number | undefined;

    async function loadStream() {
      setLoading(true);
      setError("");

      if (!Number.isFinite(numericStreamId) || numericStreamId <= 0) {
        setError("ID de stream inválido.");
        setLoading(false);
        return;
      }

      try {
        const streamResult = await getStreamById(numericStreamId);

        if (!active) return;

        setStream(streamResult);
        setViewerCount(streamResult.viewer_count || 0);

        const joinResult = await joinStreamViewer(numericStreamId);

        if (!active) return;

        joined = true;
        setViewerCount(joinResult.viewer_count || 0);

        intervalId = window.setInterval(async () => {
          try {
            const status = await getStreamSignalStatus(numericStreamId);

            if (active) {
              setViewerCount(status.viewer_count || 0);
            }
          } catch (pollError) {
            console.error("STREAM_VIEWER_POLL_ERROR", pollError);
          }
        }, 5000);
      } catch (requestError) {
        console.error("STREAM_PUBLIC_LOAD_ERROR", requestError);

        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el stream."
          );
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

      if (intervalId) {
        window.clearInterval(intervalId);
      }

      if (joined && Number.isFinite(numericStreamId) && numericStreamId > 0) {
        leaveStreamViewer(numericStreamId).catch((leaveError) => {
          console.error("STREAM_VIEWER_LEAVE_ERROR", leaveError);
        });
      }
    };
  }, [numericStreamId]);

  return (
    <RootShell active="streams">
      <div
        style={{
          display: "grid",
          gap: 24,
          width: "100%",
        }}
      >
        {loading ? (
          <div
            style={{
              borderRadius: 20,
              padding: 22,
              border: "1px solid rgba(148, 163, 184, 0.16)",
              background: "rgba(15, 23, 42, 0.74)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <FiRefreshCw />
            <div>
              <strong>Cargando stream</strong>
              <p style={{ margin: "4px 0 0" }}>
                Consultando información de la transmisión.
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            style={{
              borderRadius: 20,
              padding: 22,
              border: "1px solid rgba(250, 204, 21, 0.35)",
              background: "rgba(250, 204, 21, 0.10)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <FiAlertTriangle />
            <div>
              <strong>No se pudo cargar</strong>
              <p style={{ margin: "4px 0 0" }}>{error}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && stream ? (
          <section
            style={{
              borderRadius: 28,
              overflow: "hidden",
              border: "1px solid rgba(0, 234, 255, 0.18)",
              background: "rgba(2, 6, 23, 0.90)",
              boxShadow: "0 24px 80px rgba(0,0,0,.34)",
            }}
          >
            <div
              style={{
                minHeight: 430,
                background: isImageUrl(thumbnail)
                  ? `linear-gradient(180deg, rgba(2,8,26,.06), rgba(2,8,26,.80)), url(${thumbnail}) center/cover`
                  : "linear-gradient(135deg, rgba(0, 234, 255, 0.12), rgba(139, 92, 246, 0.14))",
                display: "grid",
                placeItems: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    borderRadius: 999,
                    padding: "8px 12px",
                    background: statusColor(stream.estado),
                    color: stream.estado === "finalizado" ? "#020617" : "#fff",
                    fontWeight: 900,
                    fontSize: 12,
                  }}
                >
                  {statusLabel(stream.estado)}
                </span>

                <span
                  style={{
                    borderRadius: 999,
                    padding: "8px 12px",
                    background: "rgba(15, 23, 42, 0.82)",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FiEye /> {viewerCount} espectadores
                </span>
              </div>

              {stream.playback_url && stream.estado === "en_vivo" ? (
                <video
                  src={stream.playback_url}
                  controls
                  autoPlay
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: 520,
                    background: "#000",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 118,
                    height: 118,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(0, 234, 255, 0.16)",
                    color: "#00eaff",
                    fontSize: 48,
                    border: "1px solid rgba(0, 234, 255, 0.30)",
                  }}
                >
                  <FiTv />
                </div>
              )}
            </div>

            <div
              style={{
                padding: 26,
                display: "grid",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <ChannelAvatar
                  image={stream.canal.foto_canal}
                  name={stream.canal.nombre_canal}
                />

                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "clamp(32px, 4vw, 54px)",
                      lineHeight: 1,
                    }}
                  >
                    {stream.titulo}
                  </h1>

                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "rgba(226, 232, 240, 0.82)",
                      fontSize: 15,
                    }}
                  >
                    {stream.canal.nombre_canal}
                  </p>
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "rgba(226, 232, 240, 0.82)",
                  maxWidth: 900,
                  fontSize: 16,
                  lineHeight: 1.55,
                }}
              >
                {stream.descripcion || "Este stream todavía no tiene descripción."}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  color: "rgba(226, 232, 240, 0.82)",
                }}
              >
                <Link
                  to={`/channels/${stream.canal.id_canal}`}
                  style={{
                    color: "#00eaff",
                    textDecoration: "none",
                    fontWeight: 900,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <FiUser /> {stream.canal.nombre_canal}
                </Link>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <FiRadio /> {stream.categoria.nombre}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <FiClock /> {stream.configuracion?.resolucion || "720p"}
                </span>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </RootShell>
  );
}