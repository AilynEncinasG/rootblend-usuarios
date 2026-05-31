//frontend/src/modules/creator/streamer/pages/HighlightsPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiEdit3,
  FiEye,
  FiPlay,
  FiRefreshCw,
  FiStar,
  FiUpload,
} from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  ButtonRow,
  CardTitle,
  Muted,
  PodcastCover,
  PodcastGrid,
  PrimaryLink,
  StateIcon,
  StatePanel,
} from "../../../../shared/styles/legacyStyled";
import {
  getMyMomentos,
  type MomentoDestacado,
} from "../../../streams/services/streamsService";
import { CreatorScreen } from "../../shared/creatorLegacy";

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

function coverImage(momento: MomentoDestacado) {
  return normalizeMediaUrl(
    momento.thumbnail_url ||
      momento.stream?.thumbnail_url ||
      brandAssets.streamView
  );
}

export default function HighlightsPage() {
  const [momentos, setMomentos] = useState<MomentoDestacado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMomentos() {
      setLoading(true);
      setError("");

      try {
        const results = await getMyMomentos();

        if (!active) return;

        setMomentos(results);
      } catch (requestError) {
        console.error("HIGHLIGHTS_LOAD_ERROR", requestError);

        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar los momentos destacados."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMomentos();

    return () => {
      active = false;
    };
  }, []);

  return (
    <CreatorScreen
      title="Momentos destacados"
      subtitle="Clips importantes del canal listos para publicar, reproducir o editar."
      image={brandAssets.channelView}
    >
      <ButtonRow>
        <PrimaryLink to="/creator/streamer/highlights/new">
          <FiUpload /> Subir nuevo
        </PrimaryLink>
      </ButtonRow>

      {loading ? (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando momentos</strong>
            <p>Consultando clips reales de tu canal.</p>
          </div>
        </AlertPanel>
      ) : null}

      {error ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>No se pudo cargar</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      ) : null}

      {!loading && !error && momentos.length === 0 ? (
        <StatePanel>
          <StateIcon>
            <FiStar />
          </StateIcon>
          <h2>No hay momentos destacados</h2>
          <p>
            Sube tu primer clip con video y miniatura para que aparezca en tu
            canal.
          </p>
        </StatePanel>
      ) : null}

      {momentos.length > 0 ? (
        <PodcastGrid>
          {momentos.map((momento) => (
            <article
              key={momento.id_momento}
              style={{
                display: "grid",
                gridTemplateColumns: "76px 1fr auto",
                gap: 16,
                alignItems: "center",
                minHeight: 92,
                padding: 14,
                borderRadius: 18,
                border: "1px solid var(--rb-border)",
                background:
                  "linear-gradient(90deg, color-mix(in srgb, var(--rb-panel) 88%, transparent), color-mix(in srgb, var(--rb-accent-2) 18%, var(--rb-panel)))",
                boxShadow: "0 14px 34px color-mix(in srgb, var(--rb-shadow) 38%, transparent)",
                color: "var(--rb-text)",
              }}
            >
              <Link
                to={`/moments/${momento.id_momento}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
                title="Reproducir momento"
              >
                <PodcastCover $image={coverImage(momento)}>
                  <FiPlay />
                </PodcastCover>
              </Link>

              <Link
                to={`/moments/${momento.id_momento}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  display: "grid",
                  gap: 6,
                }}
                title="Reproducir momento"
              >
                <CardTitle>{momento.titulo}</CardTitle>

                <Muted>
                  {momento.descripcion || "Sin descripcion"}
                </Muted>

                <Muted>
                  <FiEye /> {momento.vistas_count || 0} vistas
                  {momento.duracion ? ` · ${momento.duracion}` : ""}
                </Muted>
              </Link>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Link
                  to={`/moments/${momento.id_momento}`}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid var(--rb-border-strong)",
                    color: "var(--rb-accent)",
                    textDecoration: "none",
                    background: "var(--rb-panel)",
                  }}
                  title="Reproducir"
                >
                  <FiPlay />
                </Link>

                <Link
                  to={`/creator/streamer/highlights/${momento.id_momento}/edit`}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid color-mix(in srgb, var(--rb-success) 45%, transparent)",
                    color: "var(--rb-success)",
                    textDecoration: "none",
                    background: "var(--rb-panel)",
                  }}
                  title="Editar"
                >
                  <FiEdit3 />
                </Link>
              </div>
            </article>
          ))}
        </PodcastGrid>
      ) : null}
    </CreatorScreen>
  );
}