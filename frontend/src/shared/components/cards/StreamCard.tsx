import { Link } from "react-router-dom";
import { brandAssets } from "../../mock/rootblendMock";
import {
  CardBody,
  CardTitle,
  ContentCard,
  LiveBadge,
  MetaLine,
  Muted,
  TagRow,
  Thumb,
  ViewBadge,
} from "../../styles/legacyStyled";

export type StreamCardData = {
  id: string | number;
  title: string;
  channel?: string;
  handle?: string;
  category?: string;
  viewers?: string | number;
  avatar?: string;
  image?: string;
  tags?: string[];
  description?: string;
  live?: boolean;
};

type StreamCardProps = {
  stream: StreamCardData;
  to?: string;
};

export function StreamCard({ stream, to }: StreamCardProps) {
  const target = to || `/streams/${stream.id}`;

  return (
    <ContentCard as={Link} to={target}>
      <Thumb $image={stream.image || brandAssets.streamView}>
        <LiveBadge>{stream.live === false ? "STREAM" : "EN VIVO"}</LiveBadge>
        {stream.viewers !== undefined ? (
          <ViewBadge>{stream.viewers} viewers</ViewBadge>
        ) : null}
      </Thumb>

      <CardBody>
        <CardTitle>{stream.title}</CardTitle>

        <MetaLine>
          <strong>{stream.channel || "Canal ROOTBLEND"}</strong>
          {stream.handle ? <span>{stream.handle}</span> : null}
        </MetaLine>

        {stream.description ? <Muted>{stream.description}</Muted> : null}

        <TagRow>
          {stream.category ? <span>{stream.category}</span> : null}
          {(stream.tags || []).slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </TagRow>
      </CardBody>
    </ContentCard>
  );
}
