import { useState } from "react";
import { useParams } from "react-router-dom";
import { FiHeadphones, FiHeart, FiPause, FiPlay } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { podcasts } from "../../../shared/mock/rootblendMock";
import {
  AudioBar,
  ButtonRow,
  ChannelHero,
  EpisodeRow,
  Eyebrow,
  GhostButton,
  InfoGrid,
  Panel,
  PanelHeader,
  PodcastCover,
  PrimaryButton,
  Progress,
  RoundButton,
} from "../../../shared/styles/legacyStyled";
import { firstPodcast } from "../../../shared/utils/rootblendHelpers";

export default function PodcastDetailPage() {
  const { podcastId } = useParams();
  const podcast = podcasts.find((item) => item.id === podcastId) || firstPodcast();
  const [currentEpisode, setCurrentEpisode] = useState(podcast.episodes[0]?.title || podcast.title);

  return (
    <RootShell active="podcasts">
      <ChannelHero $image={podcast.image}>
        <PodcastCover $image={podcast.image}><FiHeadphones /></PodcastCover>
        <div>
          <Eyebrow>Podcast destacado</Eyebrow>
          <h1>{podcast.title}</h1>
          <p>{podcast.creator} - {podcast.category}</p>
          <ButtonRow>
            <PrimaryButton type="button" onClick={() => setCurrentEpisode(podcast.episodes[0]?.title || podcast.title)}>
              <FiPlay /> Reproducir
            </PrimaryButton>
            <GhostButton type="button"><FiHeart /> Seguir</GhostButton>
          </ButtonRow>
        </div>
      </ChannelHero>
      <InfoGrid>
        <Panel>
          <PanelHeader><strong>Podcast destacado</strong></PanelHeader>
          <p>Descripcion del podcast, estadisticas y lista completa de episodios preparada para el servicio de podcasts.</p>
        </Panel>
        <Panel>
          <PanelHeader><strong>Episodios</strong></PanelHeader>
          {podcast.episodes.map((episode) => (
            <EpisodeRow key={episode.id}>
              <button type="button" onClick={() => setCurrentEpisode(episode.title)}><FiPlay /></button>
              <span>{episode.title}</span>
              <small>{episode.duration}</small>
            </EpisodeRow>
          ))}
        </Panel>
      </InfoGrid>
      <AudioBar>
        <span>{currentEpisode}</span>
        <Progress><span /></Progress>
        <RoundButton type="button"><FiPause /></RoundButton>
      </AudioBar>
    </RootShell>
  );
}
