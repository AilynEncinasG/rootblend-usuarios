import { FiClock } from "react-icons/fi";
import { brandAssets, notifications } from "../../../../shared/mock/rootblendMock";
import { NotificationRow, Panel } from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
export default function PodcastHistoryPage() {
  return (
    <CreatorScreen title="Historial del podcast" subtitle="Actividad reciente, comentarios y reproducciones por episodio." image={brandAssets.podcastStats}>
      <Panel>{notifications.map((item) => <NotificationRow key={item.title} $accent={item.accent}><FiClock /><div><strong>{item.title}</strong><small>{item.meta}</small></div></NotificationRow>)}</Panel>
    </CreatorScreen>
  );
}
