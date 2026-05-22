import { useEffect, useState } from "react";
import { FiAlertTriangle, FiHeadphones, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  EpisodeRow,
  GhostLink,
  Panel,
  PanelHeader,
  ServicePill,
  StateIcon,
  StatePanel,
} from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import {
  getPodcasterEpisodes,
  type PodcasterEpisode,
} from "../services/podcasterCreatorService";

export default function EpisodesListPage() {
  const [episodes, setEpisodes] = useState<PodcasterEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEpisodes() {
      setLoading(true);
      setError("");

      try {
        const items = await getPodcasterEpisodes();

        if (active) {
          setEpisodes(items);
        }
      } catch (loadError) {
        console.error("PODCAST_EPISODES_ERROR", loadError);

        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los episodios.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEpisodes();

    return () => {
      active = false;
    };
  }, []);

  return (
    <CreatorScreen
      title="Lista de episodios"
      subtitle="Filtra, edita y publica episodios del podcast con datos reales."
      image={brandAssets.podcasterPanel}
    >
      {loading ? (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando episodios</strong>
            <p>Consultando podcasts-service...</p>
          </div>
        </AlertPanel>
      ) : null}

      {error ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      ) : null}

      <Panel>
        <PanelHeader>
          <strong>Episodios publicados</strong>
          <ServicePill $status="Operativo">{episodes.length} reales</ServicePill>
        </PanelHeader>

        {episodes.length > 0 ? (
          episodes.map((episode) => (
            <EpisodeRow key={episode.id}>
              <FiHeadphones />
              <span>{episode.title}</span>
              <small>{episode.podcastTitle || `Podcast #${episode.podcastId}`}</small>
              <GhostLink to={`/creator/podcaster/episodes/${episode.id}/edit`}>Editar</GhostLink>
              <GhostLink to={`/creator/podcaster/episodes/${episode.id}/delete`}>
                <FiTrash2 />
              </GhostLink>
            </EpisodeRow>
          ))
        ) : (
          <StatePanel>
            <StateIcon>
              <FiHeadphones />
            </StateIcon>
            <h2>No hay episodios todavía</h2>
            <p>Sube un episodio desde “Subir episodio” y aparecerá en esta lista.</p>
          </StatePanel>
        )}
      </Panel>
    </CreatorScreen>
  );
}
