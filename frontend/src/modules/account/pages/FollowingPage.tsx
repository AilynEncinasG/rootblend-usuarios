import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiHeart, FiRadio, FiUserMinus } from "react-icons/fi";

const Page = styled.main`
  min-height: calc(100vh - 70px);
  padding: 48px 6vw;
  color: white;
`;

const Eyebrow = styled.div`
  color: #00e5ff;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: clamp(32px, 5vw, 54px);
  margin: 0 0 10px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.68);
  margin: 0 0 28px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  padding: 18px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 46px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 0;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
`;

const Avatar = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #00e5ff, #00ff99);
  color: #071016;
  font-weight: 900;
`;

const Info = styled.div`
  strong {
    display: block;
    font-size: 15px;
  }

  span {
    color: rgba(255, 255, 255, 0.58);
    font-size: 13px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ButtonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  border-radius: 999px;
  padding: 9px 13px;
  font-size: 13px;
  font-weight: 900;
  color: #071016;
  background: linear-gradient(135deg, #00e5ff, #00ff99);
`;

const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  padding: 9px 13px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
`;

const followedChannels = [
  {
    name: "PixelNate",
    status: "En vivo ahora",
    category: "Gaming",
    to: "/channels/pixelnate",
    streamTo: "/streams/cyberpunk-2077",
    initial: "P",
  },
  {
    name: "LunaVibes",
    status: "Publicó un episodio nuevo",
    category: "Podcast musical",
    to: "/channels/lunavibes",
    streamTo: "/podcasts/podcast-raices-sonoras",
    initial: "L",
  },
  {
    name: "TechNova",
    status: "Offline",
    category: "Tecnología",
    to: "/channels/technova",
    streamTo: "/channels/technova",
    initial: "T",
  },
];

export default function FollowingPage() {
  return (
    <Page>
      <Eyebrow>Centro personal</Eyebrow>
      <Title>Canales seguidos</Title>
      <Subtitle>
        Administra los canales que sigues y entra rápido a sus directos, podcasts o perfiles.
      </Subtitle>

      <Card>
        {followedChannels.map((channel) => (
          <Row key={channel.name}>
            <Avatar>{channel.initial}</Avatar>

            <Info>
              <strong>{channel.name}</strong>
              <span>
                {channel.status} · {channel.category}
              </span>
            </Info>

            <Actions>
              <ButtonLink to={channel.streamTo}>
                <FiRadio />
                Ver contenido
              </ButtonLink>

              <ButtonLink to={channel.to}>
                <FiHeart />
                Canal
              </ButtonLink>

              <GhostButton type="button">
                <FiUserMinus />
                Dejar de seguir
              </GhostButton>
            </Actions>
          </Row>
        ))}
      </Card>
    </Page>
  );
}