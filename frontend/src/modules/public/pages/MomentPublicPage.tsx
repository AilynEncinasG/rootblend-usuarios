//frontend/src/modules/public/pages/MomentPublicPage.tsx
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiClock,
  FiEye,
  FiPlay,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import { getInitials } from "../../../shared/utils/rootblendHelpers";
import {
  getMomentoById,
  type MomentoDestacado,
} from "../../streams/services/streamsService";

function normalizeMediaUrl(value?: string | null) {
  if (!value) return "";

  const cleanValue = value.trim();

  if (cleanValue.startsWith("http://localhost/media/")) {
    return cleanValue.replace(
      "http://localhost/media/",
      "http://localhost:8080/canales-media/"
    );
  }

  if (cleanValue.startsWith("http://127.0.0.1/media/")) {
    return cleanValue.replace(
      "http://127.0.0.1/media/",
      "http://localhost:8080/canales-media/"
    );
  }

  if (cleanValue.startsWith("/media/")) {
    return cleanValue.replace(
      "/media/",
      "http://localhost:8080/canales-media/"
    );
  }

  return cleanValue;
}

function getYouTubeVideoId(value?: string | null) {
  if (!value) return "";

  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const watchId = url.searchParams.get("v");

      if (watchId) {
        return watchId;
      }

      const parts = url.pathname.split("/").filter(Boolean);

      if (parts[0] === "shorts" && parts[1]) {
        return parts[1];
      }

      if (parts[0] === "embed" && parts[1]) {
        return parts[1];
      }

      if (parts[0] === "live" && parts[1]) {
        return parts[1];
      }
    }

    return "";
  } catch {
    return "";
  }
}

function getYouTubeEmbedUrl(value?: string | null) {
  const videoId = getYouTubeVideoId(value);

  if (!videoId) return "";

  return `https://www.youtube.com/embed/${videoId}`;
}

function isImageUrl(value?: string | null) {
  const cleanValue = normalizeMediaUrl(value);

  return (
    cleanValue.startsWith("http://") ||
    cleanValue.startsWith("https://") ||
    cleanValue.startsWith("data:image/")
  );
}

function ChannelAvatar({ momento }: { momento: MomentoDestacado }) {
  const channelName =
    momento.canal?.nombre_canal || momento.nombre_canal || "ROOTBLEND";
  const channelPhoto = normalizeMediaUrl(momento.canal?.foto_canal || "");

  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        overflow: "hidden",
        background: "linear-gradient(135deg, var(--rb-accent), var(--rb-accent-2))",
        border: "2px solid var(--rb-border-strong)",
        display: "grid",
        placeItems: "center",
        color: "var(--rb-text-inverse)",
        fontWeight: 900,
        flex: "0 0 auto",
        boxShadow: "0 12px 26px color-mix(in srgb, var(--rb-accent) 16%, transparent)",
      }}
    >
      {isImageUrl(channelPhoto) ? (
        <img
          src={channelPhoto}
          alt={channelName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        getInitials(channelName)
      )}
    </div>
  );
}

export default function MomentPublicPage() {
  const { momentoId } = useParams();
  const numericMomentoId = Number(momentoId);

  const [momento, setMomento] = useState<MomentoDestacado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMoment() {
      setLoading(true);
      setError("");

      if (!Number.isFinite(numericMomentoId) || numericMomentoId <= 0) {
        setError("ID de momento inválido.");
        setLoading(false);
        return;
      }

      try {
        const result = await getMomentoById(numericMomentoId);

        if (!active) return;

        setMomento(result);
      } catch (requestError) {
        console.error("MOMENT_PUBLIC_LOAD_ERROR", requestError);

        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el momento destacado."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMoment();

    return () => {
      active = false;
    };
  }, [numericMomentoId]);

  const videoUrl = useMemo(
    () => normalizeMediaUrl(momento?.url_video || ""),
    [momento?.url_video]
  );

  const youtubeEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl(videoUrl),
    [videoUrl]
  );

  const thumbnailUrl = useMemo(
    () =>
      normalizeMediaUrl(
        momento?.thumbnail_url ||
          momento?.stream?.thumbnail_url ||
          brandAssets.streamView
      ),
    [momento?.stream?.thumbnail_url, momento?.thumbnail_url]
  );

  const channelName =
    momento?.canal?.nombre_canal || momento?.nombre_canal || "ROOTBLEND";
  const channelId = momento?.canal?.id_canal || momento?.id_canal;

  return (
    <RootShell active="streams">
      <div style={{ display: "grid", gap: 22, color: "var(--rb-text)" }}>
        <Link
          to={channelId ? `/channels/${channelId}` : "/streams"}
          style={{
            width: "fit-content",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--rb-accent)",
            textDecoration: "none",
            fontWeight: 900,
          }}
        >
          <FiArrowLeft /> Volver al canal
        </Link>

        {loading ? (
          <div style={noticeStyle}>
            <FiRefreshCw style={{ color: "var(--rb-accent)" }} />
            <div>
              <strong style={{ color: "var(--rb-text-strong)" }}>
                Cargando momento
              </strong>
              <p style={{ margin: "4px 0 0", color: "var(--rb-muted)" }}>
                Consultando el clip destacado.
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <div style={warningStyle}>
            <FiAlertTriangle style={{ color: "var(--rb-warning)" }} />
            <div>
              <strong style={{ color: "var(--rb-text-strong)" }}>
                No se pudo cargar
              </strong>
              <p style={{ margin: "4px 0 0", color: "var(--rb-muted)" }}>
                {error}
              </p>
            </div>
          </div>
        ) : null}

        {!loading && !error && momento ? (
          <>
            <section
              style={{
                borderRadius: 26,
                overflow: "hidden",
                border: "1px solid var(--rb-border-strong)",
                background: "#000",
                boxShadow: "0 26px 90px var(--rb-shadow)",
              }}
            >
              {youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={momento.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    width: "100%",
                    height: "72vh",
                    minHeight: 520,
                    border: 0,
                    background: "#000",
                    display: "block",
                  }}
                />
              ) : (
                <video
                  src={videoUrl}
                  poster={thumbnailUrl}
                  controls
                  playsInline
                  preload="metadata"
                  style={{
                    width: "100%",
                    maxHeight: "72vh",
                    background: "#000",
                    display: "block",
                  }}
                />
              )}
            </section>

            <section
              style={{
                display: "grid",
                gap: 18,
                border: "1px solid var(--rb-border)",
                borderRadius: 24,
                padding: 22,
                background: "var(--rb-card-bg)",
                boxShadow: "0 18px 48px var(--rb-shadow)",
                color: "var(--rb-text)",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <ChannelAvatar momento={momento} />

                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--rb-accent)",
                      textTransform: "uppercase",
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    Momento destacado
                  </p>

                  <h1
                    style={{
                      margin: "4px 0",
                      fontSize: "clamp(32px, 4vw, 56px)",
                      lineHeight: 1,
                      color: "var(--rb-text-strong)",
                    }}
                  >
                    {momento.titulo}
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      color: "var(--rb-muted)",
                      fontWeight: 800,
                    }}
                  >
                    {channelName}
                  </p>
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "var(--rb-muted)",
                  fontSize: 16,
                  lineHeight: 1.55,
                }}
              >
                {momento.descripcion ||
                  "Este momento todavía no tiene descripción."}
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span style={pillStyle}>
                  <FiEye /> {momento.vistas_count || 0} vistas
                </span>

                {momento.duracion ? (
                  <span style={pillStyle}>
                    <FiClock /> {momento.duracion}
                  </span>
                ) : null}

                {momento.destacado ? (
                  <span style={pillStyle}>
                    <FiStar /> Destacado
                  </span>
                ) : null}

                {momento.stream?.titulo ? (
                  <span style={pillStyle}>
                    <FiPlay /> {momento.stream.titulo}
                  </span>
                ) : null}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </RootShell>
  );
}

const noticeStyle: CSSProperties = {
  border: "1px solid color-mix(in srgb, var(--rb-accent) 25%, transparent)",
  borderRadius: 20,
  padding: 18,
  background: "color-mix(in srgb, var(--rb-accent) 8%, transparent)",
  display: "flex",
  gap: 12,
  alignItems: "center",
  color: "var(--rb-text)",
};

const warningStyle: CSSProperties = {
  border: "1px solid color-mix(in srgb, var(--rb-warning) 35%, transparent)",
  borderRadius: 20,
  padding: 18,
  background: "color-mix(in srgb, var(--rb-warning) 10%, transparent)",
  display: "flex",
  gap: 12,
  alignItems: "center",
  color: "var(--rb-text)",
};

const pillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  borderRadius: 999,
  padding: "8px 12px",
  background: "var(--rb-chip-bg)",
  border: "1px solid var(--rb-border-strong)",
  color: "var(--rb-chip-text)",
  fontWeight: 800,
};
