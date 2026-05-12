import { useState } from "react";
import { FiMic, FiPause, FiPlay } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets, podcasts } from "../../../shared/mock/rootblendMock";
import {
  AudioBar,
  ButtonRow,
  Eyebrow,
  FeaturedFlag,
  FilterChip,
  FilterRow,
  GhostLink,
  HeroCopy,
  HeroGrid,
  HeroMedia,
  HeroOverlay,
  PodcastGrid,
  PrimaryButton,
  Progress,
  RoundButton,
} from "../../../shared/styles/legacyStyled";
import {
  PodcastCard,
  PodcastRightPanel,
  Section,
} from "../../public/utils/publicLegacyHelpers";

export default function PodcastsPage() {
  const [playing, setPlaying] = useState(podcasts[0]?.title || "Fuera de Orbita");

  return (
    <RootShell active="podcasts" rightPanel={<PodcastRightPanel />}>
      <HeroGrid>
        <HeroCopy>
          <Eyebrow>Podcasts</Eyebrow>
          <h1>Descubre podcasts</h1>
          <p>Historias, musica y conversaciones que te inspiran.</p>
          <ButtonRow>
            <PrimaryButton type="button" onClick={() => setPlaying("Fuera de Orbita")}>
              <FiPlay /> Escuchar ahora
            </PrimaryButton>
            <GhostLink to="/creator/podcaster/create-podcast"><FiMic /> Crear podcast</GhostLink>
          </ButtonRow>
        </HeroCopy>
        <HeroMedia $image={brandAssets.podcastsView}>
          <FeaturedFlag>DESTACADO</FeaturedFlag>
          <HeroOverlay><h3>{playing}</h3><p>Nuevo episodio disponible</p></HeroOverlay>
        </HeroMedia>
      </HeroGrid>
      <FilterRow>
        {["Todos", "Gaming", "Negocios", "Musica", "Ciencia", "Cultura", "Comedia", "Tech"].map((item, index) => (
          <FilterChip key={item} $active={index === 0}>{item}</FilterChip>
        ))}
      </FilterRow>
      <Section title="Podcasts recomendados">
        <PodcastGrid>
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </PodcastGrid>
      </Section>
      <AudioBar>
        <span>{playing}</span>
        <Progress><span /></Progress>
        <RoundButton type="button"><FiPause /></RoundButton>
      </AudioBar>
    </RootShell>
  );
}
