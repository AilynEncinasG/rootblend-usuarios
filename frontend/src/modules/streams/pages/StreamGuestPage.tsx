import { FiHeart, FiLock, FiPlay, FiStar, FiVolume2 } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import {
  AlertPanel,
  Avatar,
  ButtonRow,
  GhostLink,
  InfoMain,
  LiveBadge,
  MetaTag,
  PlayerPanel,
  PrimaryLink,
  Progress,
  RoundButton,
  StreamInfo,
  TagRow,
  VideoControls,
  VideoFrame,
} from "../../../shared/styles/legacyStyled";
import { firstStream } from "../../../shared/utils/rootblendHelpers";
import { ChatPanel } from "../../public/utils/publicLegacyHelpers";

export default function StreamGuestPage() {
  const stream = firstStream();

  return (
    <RootShell active="streams" rightPanel={<ChatPanel allowInput={false} />}>
      <AlertPanel>
        <FiLock />
        <div>
          <strong>Vista para usuario no logueado</strong>
          <p>Puedes mirar el directo, pero para escribir, seguir o suscribirte necesitas iniciar sesion.</p>
        </div>
        <PrimaryLink to="/login">Iniciar sesion</PrimaryLink>
      </AlertPanel>
      <PlayerPanel>
        <VideoFrame $image={stream.image}>
          <LiveBadge>EN VIVO</LiveBadge>
          <VideoControls>
            <RoundButton type="button"><FiPlay /></RoundButton>
            <Progress><span /></Progress>
            <FiVolume2 />
          </VideoControls>
        </VideoFrame>
        <StreamInfo>
          <Avatar $large>{stream.avatar}</Avatar>
          <InfoMain>
            <h1>{stream.title}</h1>
            <p>{stream.channel} - {stream.description}</p>
            <TagRow>
              {stream.tags.map((tag) => <MetaTag key={tag}>{tag}</MetaTag>)}
            </TagRow>
          </InfoMain>
          <ButtonRow>
            <GhostLink to="/login"><FiHeart /> Seguir</GhostLink>
            <PrimaryLink to="/login"><FiStar /> Suscribirse</PrimaryLink>
          </ButtonRow>
        </StreamInfo>
      </PlayerPanel>
    </RootShell>
  );
}
