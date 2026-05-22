import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiGrid,
  FiRefreshCw,
  FiSearch,
  FiTv,
  FiUser,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
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
  AlertPanel,
} from "../../../shared/styles/legacyStyled";
import {
  EmptyPanel,
  Section,
  StreamCard,
  backendCategoryToCard,
  backendChannelToCard,
  backendStreamToCard,
} from "../utils/publicLegacyHelpers";
import {
  getActiveChannels,
  getCategories,
  getLiveStreams,
} from "../../streams/services/streamsService";

function normalizeText(value: string | number | null | undefined) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const normalizedQuery = normalizeText(query);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liveStreams, setLiveStreams] = useState<
    ReturnType<typeof backendStreamToCard>[]
  >([]);
  const [channels, setChannels] = useState<
    ReturnType<typeof backendChannelToCard>[]
  >([]);
  const [categories, setCategories] = useState<
    ReturnType<typeof backendCategoryToCard>[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadRealSearchData() {
      setLoading(true);
      setError("");

      try {
        const [streamsResult, channelsResult, categoriesResult] =
          await Promise.all([
            getLiveStreams(),
            getActiveChannels(),
            getCategories(),
          ]);

        if (!active) return;

        const streamCards = streamsResult.map(backendStreamToCard);

        setLiveStreams(streamCards);
        setChannels(channelsResult.map(backendChannelToCard));
        setCategories(
          categoriesResult.map((category) =>
            backendCategoryToCard(category, streamCards)
          )
        );
      } catch (error) {
        console.error("SEARCH_REAL_DATA_ERROR", error);

        if (active) {
          setError("No se pudieron cargar los resultados reales de búsqueda.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRealSearchData();

    return () => {
      active = false;
    };
  }, []);

  const streamResults = useMemo(() => {
    if (!normalizedQuery) return [];

    return liveStreams.filter((stream) => {
      const searchable = normalizeText(
        `${stream.title} ${stream.channel} ${stream.category} ${stream.description}`
      );

      return searchable.includes(normalizedQuery);
    });
  }, [liveStreams, normalizedQuery]);

  const channelResults = useMemo(() => {
    if (!normalizedQuery) return [];

    return channels.filter((channel) => {
      const searchable = normalizeText(
        `${channel.name} ${channel.subtitle} ${channel.viewers}`
      );

      return searchable.includes(normalizedQuery);
    });
  }, [channels, normalizedQuery]);

  const categoryResults = useMemo(() => {
    if (!normalizedQuery) return [];

    return categories.filter((category) => {
      const searchable = normalizeText(
        `${category.name} ${category.viewers}`
      );

      return searchable.includes(normalizedQuery);
    });
  }, [categories, normalizedQuery]);

  const hasTypedQuery = normalizedQuery.length > 0;
  const hasResults =
    streamResults.length > 0 ||
    channelResults.length > 0 ||
    categoryResults.length > 0;

  return (
    <RootShell active="streams">
      <PageHeading>
        <Eyebrow>Búsqueda</Eyebrow>
        <h1>{query ? `Resultados para "${query}"` : "Resultados de búsqueda"}</h1>
        <p>
          Se muestran solamente streams, canales y categorías reales cargadas
          desde el backend.
        </p>
      </PageHeading>

      {loading && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando búsqueda</strong>
            <p>Consultando streams en vivo, canales activos y categorías reales.</p>
          </div>
        </AlertPanel>
      )}

      {error && (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Error al buscar</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      )}

      {!loading && !hasTypedQuery && (
        <EmptyPanel
          icon={<FiSearch />}
          title="Escribe algo para buscar"
          text="Puedes buscar por nombre de stream, canal o categoría."
        />
      )}

      {!loading && hasTypedQuery && !hasResults && (
        <EmptyPanel
          icon={<FiSearch />}
          title="No encontramos resultados reales"
          text="No hay streams en vivo, canales activos o categorías que coincidan con tu búsqueda."
        />
      )}

      {!loading && hasResults && (
        <>
          {streamResults.length > 0 ? (
            <Section title="Streams en vivo encontrados">
              <CardGrid>
                {streamResults.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </CardGrid>
            </Section>
          ) : (
            <Section title="Streams en vivo encontrados">
              <EmptyPanel
                icon={<FiTv />}
                title="No hay streams en vivo para esta búsqueda"
                text="La categoría o canal puede existir, pero no tiene transmisiones activas ahora."
              />
            </Section>
          )}

          {channelResults.length > 0 && (
            <Section title="Canales encontrados">
              <PodcastGrid>
                {channelResults.map((channel) => (
                  <PodcastTile key={channel.id} to={`/channels/${channel.id}`}>
                    <Avatar>{channel.avatar}</Avatar>

                    <div>
                      <CardTitle>{channel.name}</CardTitle>
                      <Muted>
                        {channel.subtitle} - {channel.viewers} espectadores
                      </Muted>
                    </div>

                    <FiArrowRight />
                  </PodcastTile>
                ))}
              </PodcastGrid>
            </Section>
          )}

          {categoryResults.length > 0 && (
            <Section title="Categorías relacionadas">
              <CategoryGrid>
                {categoryResults.map((category) => (
                  <CategoryCard
                    key={category.id}
                    to={`/streams?category=${encodeURIComponent(category.name)}`}
                    $image={category.image}
                  >
                    <span>{category.name}</span>
                    <small>{category.viewers} streams activos</small>
                  </CategoryCard>
                ))}
              </CategoryGrid>
            </Section>
          )}

          {channelResults.length === 0 && categoryResults.length === 0 && (
            <Section title="Otros resultados">
              <EmptyPanel
                icon={<FiUser />}
                title="Sin canales ni categorías relacionadas"
                text="Solo se encontraron streams en vivo reales para esta búsqueda."
              />
            </Section>
          )}

          {streamResults.length === 0 &&
            channelResults.length === 0 &&
            categoryResults.length > 0 && (
              <Section title="Aviso">
                <EmptyPanel
                  icon={<FiGrid />}
                  title="La categoría existe, pero no tiene streams en vivo"
                  text="Esto es correcto: el sistema ya no muestra transmisiones falsas."
                />
              </Section>
            )}
        </>
      )}
    </RootShell>
  );
}