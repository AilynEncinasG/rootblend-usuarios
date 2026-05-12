import { useSearchParams } from "react-router-dom";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import {
  categories,
  podcasts,
  recommendedChannels,
  streams,
} from "../../../shared/mock/rootblendMock";
import {
  Avatar,
  CardGrid,
  CardTitle,
  CategoryCard,
  CategoryGrid,
  Eyebrow,
  Muted,
  PageHeading,
  PodcastGrid,
  PodcastTile,
} from "../../../shared/styles/legacyStyled";
import {
  EmptyPanel,
  PodcastCard,
  Section,
  StreamCard,
} from "../utils/publicLegacyHelpers";

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const normalizedQuery = query.toLowerCase();
  const streamResults = streams.filter((stream) =>
    `${stream.title} ${stream.channel} ${stream.category}`.toLowerCase().includes(normalizedQuery)
  );
  const channelResults = recommendedChannels.filter((channel) =>
    `${channel.name} ${channel.subtitle}`.toLowerCase().includes(normalizedQuery)
  );
  const podcastResults = podcasts.filter((podcast) =>
    `${podcast.title} ${podcast.creator} ${podcast.category}`.toLowerCase().includes(normalizedQuery)
  );
  const categoryResults = categories.filter((category) =>
    `${category.name} ${category.viewers}`.toLowerCase().includes(normalizedQuery)
  );
  const hasResults =
    !query ||
    streamResults.length > 0 ||
    channelResults.length > 0 ||
    podcastResults.length > 0 ||
    categoryResults.length > 0;

  return (
    <RootShell active="streams">
      <PageHeading>
        <Eyebrow>Busqueda</Eyebrow>
        <h1>{query ? `Resultados para "${query}"` : "Resultados de busqueda"}</h1>
        <p>Streams, canales, podcasts y categorias aparecen juntos para navegar rapido.</p>
      </PageHeading>
      {!hasResults ? (
        <EmptyPanel icon={<FiSearch />} title="No encontramos resultados" text="Verifica la ortografia o usa palabras mas generales." />
      ) : (
        <>
          <Section title="Streams encontrados">
            <CardGrid>
              {(streamResults.length ? streamResults : streams.slice(0, 4)).map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </CardGrid>
          </Section>
          <Section title="Canales encontrados">
            <PodcastGrid>
              {(channelResults.length ? channelResults : recommendedChannels.slice(0, 4)).map((channel, index) => {
                const stream = streams[index % streams.length];
                return (
                  <PodcastTile key={channel.name} to={`/channels/${stream.id}`}>
                    <Avatar>{channel.avatar}</Avatar>
                    <div>
                      <CardTitle>{channel.name}</CardTitle>
                      <Muted>{channel.subtitle} - {channel.viewers} espectadores</Muted>
                    </div>
                    <FiArrowRight />
                  </PodcastTile>
                );
              })}
            </PodcastGrid>
          </Section>
          <Section title="Podcasts relacionados">
            <PodcastGrid>
              {(podcastResults.length ? podcastResults : podcasts.slice(0, 3)).map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </PodcastGrid>
          </Section>
          <Section title="Categorias relacionadas">
            <CategoryGrid>
              {(categoryResults.length ? categoryResults : categories.slice(0, 4)).map((category) => (
                <CategoryCard key={category.id} to={`/streams?category=${encodeURIComponent(category.name)}`} $image={category.image}>
                  <span>{category.name}</span>
                  <small>{category.viewers} espectadores activos</small>
                </CategoryCard>
              ))}
            </CategoryGrid>
          </Section>
        </>
      )}
    </RootShell>
  );
}
