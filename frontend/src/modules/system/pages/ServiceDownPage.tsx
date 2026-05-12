import { FiAlertTriangle } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { podcasts, streams } from "../../../shared/mock/rootblendMock";
import { AlertPanel, CardGrid, PodcastGrid } from "../../../shared/styles/legacyStyled";
import { PodcastCard, Section, StreamCard } from "../../public/utils/publicLegacyHelpers";
export default function ServiceDownPage() {
  return (
    <RootShell active="system">
      <AlertPanel><FiAlertTriangle /><div><strong>Algunas funciones no estan disponibles</strong><p>Tenemos problemas con estadisticas-service. El resto de la plataforma funciona con normalidad.</p></div></AlertPanel>
      <Section title="En vivo ahora"><CardGrid>{streams.slice(0, 3).map((stream) => <StreamCard key={stream.id} stream={stream} />)}</CardGrid></Section>
      <Section title="Podcasts"><PodcastGrid>{podcasts.slice(0, 3).map((podcast) => <PodcastCard key={podcast.id} podcast={podcast} />)}</PodcastGrid></Section>
    </RootShell>
  );
}
