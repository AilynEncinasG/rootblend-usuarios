import { FiRadio, FiSearch } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { EmptyPanel, Section, StreamCard } from "../../../shared/components";
import {
  ButtonRow,
  CardGrid,
  FilterChip,
  FilterRow,
  GhostLink,
  PageHeading,
} from "../../../shared/styles/legacyStyled";
import { getStreams } from "../services/streamCatalogService";

const filters = ["Todos", "Gaming", "Música", "Tecnología", "En vivo"];

export default function ExploreStreamsPage() {
  const streams = getStreams();

  return (
    <RootShell>
      <PageHeading>
        <span>Streams</span>
        <h1>Explorar transmisiones</h1>
        <p>
          Descubre directos, canales activos y contenido relacionado con la demo
          distribuida de ROOTBLEND.
        </p>
      </PageHeading>

      <FilterRow>
        {filters.map((filter) => (
          <FilterChip key={filter}>{filter}</FilterChip>
        ))}
      </FilterRow>

      {streams.length > 0 ? (
        <Section
          title="Streams disponibles"
          subtitle="Transmisiones preparadas para probar navegación, detalle y chat."
          actionLabel="Buscar contenido"
          actionTo="/search"
        >
          <CardGrid>
            {streams.map((stream) => (
              <StreamCard
                key={stream.id}
                stream={{
                  id: stream.id,
                  title: stream.title,
                  channel: stream.channel,
                  handle: stream.handle,
                  category: stream.category,
                  viewers: stream.viewers,
                  tags: stream.tags,
                  description: stream.description,
                  live: stream.status === "live",
                }}
              />
            ))}
          </CardGrid>
        </Section>
      ) : (
        <EmptyPanel
          icon={<FiRadio />}
          title="No hay streams disponibles"
          description="Cuando canales-service responda, aquí aparecerán las transmisiones activas."
          actionLabel="Ver estado del sistema"
          actionTo="/system-status"
        />
      )}

      <ButtonRow>
        <GhostLink to="/search">
          <FiSearch />
          Buscar streams
        </GhostLink>
      </ButtonRow>
    </RootShell>
  );
}