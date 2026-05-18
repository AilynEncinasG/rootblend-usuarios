import { useState } from "react";
import { FiMic, FiPause, FiPlay } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets, podcasts } from "../../../shared/mock/rootblendMock";
import {
  AudioBar,
  ButtonRow,
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
  Section,
} from "../../public/utils/publicLegacyHelpers";

export default function PodcastsPage() {
  const [playing, setPlaying] = useState(podcasts[0]?.title || "Fuera de Orbita");
  
  const [activeCategory, setActiveCategory] = useState("Todos");

  const currentPodcast = podcasts.find((p) => p.title === playing);

  const filteredPodcasts = podcasts.filter((podcast) => {
    if (activeCategory === "Todos") return true;
    
    return podcast.category === activeCategory;
  });

  return (
    <RootShell active="podcasts">
      <HeroGrid>
        <HeroCopy>
          <h1>Descubre podcasts</h1>
          <p>Historias, musica y conversations que te inspiran.</p>
          <ButtonRow>
            <PrimaryButton type="button" onClick={() => setPlaying(podcasts[0]?.title || "Fuera de Orbita")}>
              <FiPlay /> Escuchar ahora
            </PrimaryButton>
            <GhostLink to="/creator/podcaster/create-podcast"><FiMic /> Crear podcast</GhostLink>
          </ButtonRow>
        </HeroCopy>
        
        <HeroMedia $image={currentPodcast?.image ? currentPodcast.image : brandAssets.podcastsCategoria}>
          <FeaturedFlag>DESTACADO</FeaturedFlag>
          <HeroOverlay>
            <h3>{playing}</h3>
            <p>Nuevo episodio disponible</p>
          </HeroOverlay>
        </HeroMedia>
      </HeroGrid>
      
      <FilterRow>
        {["Todos", "Gaming", "Negocios", "Musica", "Ciencia", "Cultura", "Comedia", "Tech"].map((item) => (
          <FilterChip 
            key={item} 
            $active={activeCategory === item}
            onClick={() => setActiveCategory(item)}
            style={{ cursor: "pointer" }}
          >
            {item}
          </FilterChip>
        ))}
      </FilterRow>
      
      <Section title={activeCategory === "Todos" ? "Podcasts recomendados" : `Podcasts de ${activeCategory}`}>
        <PodcastGrid>
          {filteredPodcasts.length === 0 ? (
            <p style={{ color: "rgba(226, 232, 240, 0.5)", gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
              No hay podcasts en esta categoría por ahora.
            </p>
          ) : (
            filteredPodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))
          )}
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