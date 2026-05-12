import { brandAssets, stats, streams } from "../../../../shared/mock/rootblendMock";
import { CardGrid, ChartPanel, MetricGrid } from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import { Section, StatCard, StreamCard } from "../../../public/utils/publicLegacyHelpers";
export default function StreamStatsPage() {
  return (
    <CreatorScreen title="Estadisticas de stream" subtitle="Resumen de audiencia, chat, streams e ingresos." image={brandAssets.streamerPanel}>
      <MetricGrid>{stats.map((item) => <StatCard key={item.label} {...item} />)}</MetricGrid>
      <ChartPanel><span /></ChartPanel>
      <Section title="Streams recientes"><CardGrid>{streams.slice(0, 3).map((stream) => <StreamCard key={stream.id} stream={stream} />)}</CardGrid></Section>
    </CreatorScreen>
  );
}
