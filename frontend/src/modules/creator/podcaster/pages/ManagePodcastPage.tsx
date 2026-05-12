import { Link } from "react-router-dom";
import { FiHeadphones } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import { EpisodeRow, InfoGrid, Panel, PanelHeader, TwoCol } from "../../../../shared/styles/legacyStyled";
import { firstPodcast } from "../../../../shared/utils/rootblendHelpers";
import { CreatorScreen } from "../../shared/creatorLegacy";
export default function ManagePodcastPage() {
  return (
    <CreatorScreen title="Administrar podcast" subtitle="Informacion, episodios, configuracion y estado publico." image={brandAssets.podcasterPanel}>
      <InfoGrid>
        <Panel><PanelHeader><strong>Informacion</strong><Link to="/creator/podcaster/create-podcast">Editar</Link></PanelHeader><TwoCol><span>Nombre</span><strong>TechTalk</strong><span>Categoria</span><strong>Tecnologia</strong><span>Estado</span><strong>Publicado</strong></TwoCol></Panel>
        <Panel><PanelHeader><strong>Ultimos episodios</strong><Link to="/creator/podcaster/episodes">Ver todos</Link></PanelHeader>{firstPodcast().episodes.map((episode) => <EpisodeRow key={episode.id}><FiHeadphones /><span>{episode.title}</span><small>{episode.duration}</small></EpisodeRow>)}</Panel>
      </InfoGrid>
    </CreatorScreen>
  );
}
