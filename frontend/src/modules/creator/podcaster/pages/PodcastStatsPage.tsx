import { brandAssets } from "../../../../shared/mock/rootblendMock";
import { ChartPanel, MetricGrid } from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import { StatCard } from "../../../public/utils/publicLegacyHelpers";
export default function PodcastStatsPage() {
  return (
    <CreatorScreen title="Estadisticas de podcast" subtitle="Reproducciones, audiencia, episodios y dispositivos." image={brandAssets.podcastStats}>
      <MetricGrid>
        <StatCard label="Reproducciones" value="12.4K" trend="+23.5%" />
        <StatCard label="Oyentes unicos" value="8.7K" trend="+21.1%" />
        <StatCard label="Episodios" value="24" trend="+2" />
        <StatCard label="Duracion promedio" value="48m 32s" trend="+6.2%" />
      </MetricGrid>
      <ChartPanel><span /></ChartPanel>
    </CreatorScreen>
  );
}
