//frontend/src/modules/public/pages/StreamPublicPage.tsx
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
  if (status === "en_vivo") return "var(--rb-danger)";
  if (status === "programado") return "var(--rb-accent)";
  return "var(--rb-muted-soft)";
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
        background: "linear-gradient(135deg, var(--rb-accent), var(--rb-accent-2))",
        display: "grid",
        placeItems: "center",
        color: "var(--rb-text-inverse)",
        fontWeight: 900,
        fontSize: 24,
        border: "2px solid var(--rb-border-strong)",
        flex: "0 0 auto",
        boxShadow: "0 12px 26px color-mix(in srgb, var(--rb-accent) 16%, transparent)",
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
          color: "var(--rb-text)",
        }}
      >
        {loading ? (
          <div
            style={{
              borderRadius: 20,
              padding: 22,
              border: "1px solid var(--rb-border)",
              background: "var(--rb-panel)",
              color: "var(--rb-text)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 14px 36px var(--rb-shadow)",
            }}
          >
            <FiRefreshCw style={{ color: "var(--rb-accent)" }} />
            <div>
              <strong style={{ color: "var(--rb-text-strong)" }}>Cargando stream</strong>
              <p style={{ margin: "4px 0 0", color: "var(--rb-muted)" }}>
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
              border: "1px solid color-mix(in srgb, var(--rb-warning) 35%, transparent)",
              background: "color-mix(in srgb, var(--rb-warning) 10%, transparent)",
              color: "var(--rb-warning)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <FiAlertTriangle />
            <div>
              <strong style={{ color: "var(--rb-text-strong)" }}>No se pudo cargar</strong>
              <p style={{ margin: "4px 0 0", color: "var(--rb-muted)" }}>{error}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && stream ? (
          <section
            style={{
              borderRadius: 28,
              overflow: "hidden",
              border: "1px solid var(--rb-border-strong)",
              background: "var(--rb-card-bg)",
              boxShadow: "0 24px 80px var(--rb-shadow)",
              color: "var(--rb-text)",
            }}
          >
            <div
              style={{
                minHeight: 430,
                background: isImageUrl(thumbnail)
                  ? `linear-gradient(180deg, color-mix(in srgb, var(--rb-bg-deep) 8%, transparent), color-mix(in srgb, var(--rb-bg-deep) 82%, transparent), url(${thumbnail}) center/cover`
                  : "linear-gradient(135deg, color-mix(in srgb, var(--rb-accent) 12%, var(--rb-panel)), color-mix(in srgb, var(--rb-accent-2) 14%, var(--rb-panel)))",
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
                    color: "var(--rb-text-inverse)",
                    fontWeight: 900,
                    fontSize: 12,
                    boxShadow: "0 10px 22px color-mix(in srgb, var(--rb-shadow) 36%, transparent)",
                  }}
                >
                  {statusLabel(stream.estado)}
                </span>

                <span
                  style={{
                    borderRadius: 999,
                    padding: "8px 12px",
                    background: "color-mix(in srgb, var(--rb-panel) 88%, transparent)",
                    color: "var(--rb-text)",
                    border: "1px solid var(--rb-border)",
                    fontWeight: 900,
                    fontSize: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    backdropFilter: "blur(14px)",
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
                    background: "color-mix(in srgb, var(--rb-accent) 16%, transparent)",
                    color: "var(--rb-accent)",
                    fontSize: 48,
                    border: "1px solid color-mix(in srgb, var(--rb-accent) 30%, transparent)",
                    boxShadow: "0 18px 42px color-mix(in srgb, var(--rb-accent) 14%, transparent)",
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
                background: "var(--rb-card-bg)",
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
                      color: "var(--rb-text-strong)",
                    }}
                  >
                    {stream.titulo}
                  </h1>

                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "var(--rb-muted)",
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
                  color: "var(--rb-muted)",
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
                  color: "var(--rb-muted)",
                }}
              >
                <Link
                  to={`/channels/${stream.canal.id_canal}`}
                  style={{
                    color: "var(--rb-accent)",
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
