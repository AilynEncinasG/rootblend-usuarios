import { useEffect, useState } from "react";
import { FiAlertTriangle, FiBarChart2, FiRefreshCw } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  ChartPanel,
  EpisodeRow,
  MetricGrid,
  Panel,
  PanelHeader,
  ServicePill,
  StateIcon,
  StatePanel,
} from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import { StatCard } from "../../../public/utils/publicLegacyHelpers";
import {
  getPodcasterStats,
  type PodcasterStats,
} from "../services/podcasterCreatorService";

export default function PodcastStatsPage() {
  const [stats, setStats] = useState<PodcasterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      setLoading(true);
      setError("");

      try {
        const data = await getPodcasterStats();

        if (active) {
          setStats(data);
        }
      } catch (loadError) {
        console.error("PODCAST_STATS_ERROR", loadError);

        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las estadísticas.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <CreatorScreen
      title="Estadísticas de podcast"
      subtitle="Reproducciones, episodios publicados, borradores y dispositivos."
      image={brandAssets.podcastStats}
    >
      {loading ? (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando estadísticas</strong>
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

      <MetricGrid>
        <StatCard label="Podcasts" value={String(stats?.podcasts ?? 0)} trend="series" />
        <StatCard label="Episodios" value={String(stats?.episodes ?? 0)} trend="total" />
        <StatCard label="Publicados" value={String(stats?.publishedEpisodes ?? 0)} trend="visibles" />
        <StatCard label="Reproducciones" value={String(stats?.totalPlays ?? 0)} trend="plays" />
      </MetricGrid>

      <Panel>
        <PanelHeader>
          <strong>Reproducciones por episodio</strong>
          <ServicePill $status="Operativo">Backend real</ServicePill>
        </PanelHeader>

        {stats?.playsByEpisode && stats.playsByEpisode.length > 0 ? (
          stats.playsByEpisode.map((row) => (
            <EpisodeRow key={row.id_episodio}>
              <FiBarChart2 />
              <span>{row.titulo}</span>
              <small>{row.reproducciones} plays</small>
              <small>episodio #{row.id_episodio}</small>
            </EpisodeRow>
          ))
        ) : (
          <StatePanel>
            <StateIcon>
              <FiBarChart2 />
            </StateIcon>
            <h2>Aún no hay reproducciones</h2>
            <p>Reproduce un episodio desde la vista pública para que se registre aquí.</p>
          </StatePanel>
        )}
      </Panel>

      <ChartPanel>
        <span />
      </ChartPanel>
    </CreatorScreen>
  );
}
