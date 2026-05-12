import { FiActivity, FiClock, FiHeadphones, FiPlus, FiUpload } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import { GhostLink, MetricGrid, PrimaryLink, QuickActions } from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import { StatCard } from "../../../public/utils/publicLegacyHelpers";
export default function PodcasterDashboardPage() {
  return (
    <CreatorScreen title="Panel del podcaster" subtitle="Gestiona podcasts, episodios, comentarios y monetizacion." image={brandAssets.podcasterPanel}>
      <MetricGrid>
        <StatCard label="Podcasts" value="3" trend="+1" />
        <StatCard label="Episodios" value="24" trend="+2" />
        <StatCard label="Reproducciones" value="12.4K" trend="+23.5%" />
        <StatCard label="Duracion promedio" value="48m 32s" trend="+6%" />
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
          <FiActivity /> Estadisticas
        </GhostLink>

        <GhostLink to="/creator/podcaster/history">
          <FiClock /> Historial
        </GhostLink>
      </QuickActions>
    </CreatorScreen>
  );
}
