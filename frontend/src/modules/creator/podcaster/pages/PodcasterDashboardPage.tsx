import { useEffect, useState } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiClock,
  FiHeadphones,
  FiPlus,
  FiRefreshCw,
  FiUpload,
} from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  EpisodeRow,
  GhostLink,
  MetricGrid,
  Panel,
  PanelHeader,
  PrimaryLink,
  QuickActions,
  ServicePill,
  StateIcon,
  StatePanel,
} from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import { StatCard } from "../../../public/utils/publicLegacyHelpers";
import {
  getPodcasterDashboard,
  type PodcasterDashboard,
} from "../services/podcasterCreatorService";

export default function PodcasterDashboardPage() {
  const [dashboard, setDashboard] = useState<PodcasterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const data = await getPodcasterDashboard();

        if (active) {
          setDashboard(data);
        }
      } catch (loadError) {
        console.error("PODCASTER_DASHBOARD_ERROR", loadError);

        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el panel podcaster.");
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

  const summary = dashboard?.summary;

  return (
    <CreatorScreen
      title="Panel del podcaster"
      subtitle="Gestiona podcasts, episodios, historial y estadísticas con datos reales."
      image={brandAssets.podcasterPanel}
    >
      {loading ? (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando panel</strong>
            <p>Consultando podcasts-service...</p>
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

      <MetricGrid>
        <StatCard label="Podcasts" value={String(summary?.podcasts ?? 0)} trend="reales" />
        <StatCard label="Episodios" value={String(summary?.episodes ?? 0)} trend="total" />
        <StatCard label="Publicados" value={String(summary?.publishedEpisodes ?? 0)} trend="visibles" />
        <StatCard label="Reproducciones" value={String(summary?.totalPlays ?? 0)} trend="plays" />
      </MetricGrid>

      <QuickActions>
        <PrimaryLink to="/creator/podcaster/create-podcast">
          <FiPlus /> Crear podcast
        </PrimaryLink>

        <GhostLink to="/creator/podcaster/episodes/new">
          <FiUpload /> Subir episodio
        </GhostLink>

        <GhostLink to="/creator/podcaster/episodes">
          <FiHeadphones /> Episodios
        </GhostLink>

        <GhostLink to="/creator/podcaster/stats">
          <FiActivity /> Estadísticas
        </GhostLink>

        <GhostLink to="/creator/podcaster/history">
          <FiClock /> Historial
        </GhostLink>
      </QuickActions>

      <Panel>
        <PanelHeader>
          <strong>Últimos episodios</strong>
          <ServicePill $status="Operativo">Backend real</ServicePill>
        </PanelHeader>

        {dashboard && dashboard.episodes.length > 0 ? (
          dashboard.episodes.map((episode) => (
            <EpisodeRow key={episode.id}>
              <FiHeadphones />
              <span>{episode.title}</span>
              <small>{episode.duration}</small>
              <GhostLink to={`/creator/podcaster/episodes/${episode.id}/edit`}>Editar</GhostLink>
            </EpisodeRow>
          ))
        ) : (
          <StatePanel>
            <StateIcon>
              <FiHeadphones />
            </StateIcon>
            <h2>Todavía no tienes episodios</h2>
            <p>Crea un podcast y sube tu primer episodio para verlo en este panel.</p>
          </StatePanel>
        )}
      </Panel>
    </CreatorScreen>
  );
}
