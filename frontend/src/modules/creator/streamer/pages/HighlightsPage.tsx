import { FiEdit3, FiPlay, FiUpload } from "react-icons/fi";
import { brandAssets, streams } from "../../../../shared/mock/rootblendMock";
import { ButtonRow, CardTitle, Muted, PodcastCover, PodcastGrid, PodcastTile, PrimaryLink } from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
export default function HighlightsPage() {
  return (
    <CreatorScreen title="Momentos destacados" subtitle="Clips importantes del canal listos para publicar o editar." image={brandAssets.channelView}>
      <ButtonRow><PrimaryLink to="/creator/streamer/highlights/new"><FiUpload /> Subir nuevo</PrimaryLink></ButtonRow>
      <PodcastGrid>{streams.slice(0, 4).map((stream) => <PodcastTile key={stream.id} to="/creator/streamer/highlights/1/edit"><PodcastCover $image={stream.image}><FiPlay /></PodcastCover><div><CardTitle>{stream.title}</CardTitle><Muted>1.2K vistas</Muted></div><FiEdit3 /></PodcastTile>)}</PodcastGrid>
    </CreatorScreen>
  );
}
