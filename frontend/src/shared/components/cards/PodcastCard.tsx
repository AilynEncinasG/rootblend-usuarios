import { Link } from "react-router-dom";
import { brandAssets } from "../../mock/rootblendMock";
import {
  CardTitle,
  Muted,
  PodcastCover,
  PodcastTile,
  TagRow,
} from "../../styles/legacyStyled";

export type PodcastCardData = {
  id: string | number;
  title?: string;
  name?: string;
  host?: string;
  author?: string;
  category?: string;
  episodes?: number;
  image?: string;
  description?: string;
};

type PodcastCardProps = {
  podcast: PodcastCardData;
  to?: string;
};

export function PodcastCard({ podcast, to }: PodcastCardProps) {
  const target = to || `/podcasts/${podcast.id}`;
  const title = podcast.title || podcast.name || "Podcast ROOTBLEND";

  return (
    <PodcastTile as={Link} to={target}>
      <PodcastCover $image={podcast.image || brandAssets.streamView} />

      <div>
        <CardTitle>{title}</CardTitle>

        <Muted>
          {podcast.host || podcast.author || "Creador ROOTBLEND"}
        </Muted>

        {podcast.description ? <Muted>{podcast.description}</Muted> : null}

        <TagRow>
          {podcast.category ? <span>{podcast.category}</span> : null}
          {podcast.episodes !== undefined ? (
            <span>{podcast.episodes} episodios</span>
          ) : null}
        </TagRow>
      </div>
    </PodcastTile>
  );
}
