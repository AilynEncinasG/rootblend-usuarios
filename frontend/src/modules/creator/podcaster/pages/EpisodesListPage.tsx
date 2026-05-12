import { FiHeadphones } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import { EpisodeRow, GhostLink, Panel, PodcastCover } from "../../../../shared/styles/legacyStyled";
import { firstPodcast } from "../../../../shared/utils/rootblendHelpers";
import { CreatorScreen } from "../../shared/creatorLegacy";
export default function EpisodesListPage() {
  return (
    <CreatorScreen title="Lista de episodios" subtitle="Filtra, edita y publica episodios del podcast." image={brandAssets.podcasterPanel}>
      <Panel>
        {firstPodcast().episodes.concat(firstPodcast().episodes).map((episode, index) => (
          <EpisodeRow key={`${episode.id}-${index}`}>
            <PodcastCover $image={brandAssets.podcastsView}><FiHeadphones /></PodcastCover>
            <span>{episode.title}</span>
            <small>{episode.plays}</small>
            <GhostLink to={`/creator/podcaster/episodes/${episode.id}/edit`}>Editar</GhostLink>
          </EpisodeRow>
        ))}
      </Panel>
    </CreatorScreen>
  );
}
