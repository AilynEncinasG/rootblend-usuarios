import { useEffect, useState } from "react";
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
  PodcastTile,
  PrimaryLink,
  StateIcon,
  StatePanel,
} from "../../../../shared/styles/legacyStyled";
import {
  getMyMomentos,
  type MomentoDestacado,
} from "../../../streams/services/streamsService";
import { CreatorScreen } from "../../shared/creatorLegacy";

function coverImage(momento: MomentoDestacado) {
  return (
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
      subtitle="Clips importantes del canal listos para publicar o editar."
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
            Sube tu primer clip con una URL de video y una miniatura para que
            aparezca en tu canal.
          </p>
        </StatePanel>
      ) : null}

      {momentos.length > 0 ? (
        <PodcastGrid>
          {momentos.map((momento) => (
            <PodcastTile
              key={momento.id_momento}
              to={`/creator/streamer/highlights/${momento.id_momento}/edit`}
            >
              <PodcastCover $image={coverImage(momento)}>
                <FiPlay />
              </PodcastCover>

              <div>
                <CardTitle>{momento.titulo}</CardTitle>
                <Muted>{momento.descripcion || "Sin descripcion"}</Muted>
                <Muted>
                  <FiEye /> {momento.vistas_count || 0} vistas
                  {momento.duracion ? ` · ${momento.duracion}` : ""}
                </Muted>
              </div>

              <FiEdit3 />
            </PodcastTile>
          ))}
        </PodcastGrid>
      ) : null}
    </CreatorScreen>
  );
}