import { type ReactNode, useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiEye,
  FiGrid,
  FiHeadphones,
  FiPlay,
  FiRefreshCw,
  FiStar,
  FiUsers,
  FiWifiOff,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import {
  brandAssets,
  type Category,
  type StreamItem,
} from "../../../shared/mock/rootblendMock";
import { isAuthenticated } from "../../auth/utils/authStorage";
import {
  getCategories as getBackendCategories,
  getChannels as getBackendChannels,
  getFeaturedStreams,
  getLiveStreams,
  type Canal as BackendCanal,
  type Categoria as BackendCategory,
  type Stream as BackendStream,
} from "../../streams/services/streamsService";
import {
  AlertPanel,
  Avatar,
  ButtonRow,
  CardBody,
  CardGrid,
  CardTitle,
  ContentCard,
  CategoryCard,
  CategoryGrid,
  Eyebrow,
  FeaturedFlag,
  FilterChip,
  FilterRow,
  GhostLink,
  HeroCopy,
  HeroGrid,
  HeroMedia,
  HeroOverlay,
  LiveBadge,
  MetaLine,
  Muted,
  PodcastGrid,
  PodcastTile,
  PodcastCover,
  PrimaryLink,
  SectionBlock,
  SectionHeader,
  StateIcon,
  StatePanel,
  TextLink,
  Thumb,
  VerifiedDot,
  ViewBadge,
} from "../../../shared/styles/legacyStyled";
import {
  getPodcasts,
  type PodcastItem,
} from "../../podcasts/services/podcastsCatalogService";

type HomeStreamItem = StreamItem & {
  channelId?: number;
  channelPhoto?: string | null;
};

type HomeChannelItem = {
  id: string;
  name: string;
  subtitle: string;
  viewers: string;
  avatar: string;
  photo?: string | null;
};

function getInitials(value?: string | null) {
  const clean = String(value || "").trim();

  if (!clean) {
    return "RB";
  }

  return (
    clean
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "RB"
  );
}

function isImageUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("http://") || value.startsWith("https://");
}

function backendStreamToCard(stream: BackendStream): HomeStreamItem {
  return {
    id: String(stream.id_stream),
    channelId: stream.canal.id_canal,
    channelPhoto: stream.canal.foto_canal ?? null,
    title: stream.titulo,
    channel: stream.canal.nombre_canal,
    handle: `@${stream.canal.nombre_canal.toLowerCase().replace(/\s+/g, "")}`,
    category: stream.categoria.nombre,
    viewers: `${stream.viewer_count || 0}`,
    avatar: getInitials(stream.canal.nombre_canal),
    image: stream.thumbnail_url || brandAssets.streamView,
    tags: [
      stream.categoria.nombre,
      stream.configuracion?.resolucion || "720p",
      stream.estado === "en_vivo" ? "En vivo" : stream.estado,
    ],
    description:
      stream.descripcion ||
      "Este stream todavía no tiene descripción configurada.",
  };
}

function backendCategoryToCard(
  category: BackendCategory,
  liveStreams: HomeStreamItem[]
): Category {
  const activeCount = liveStreams.filter(
    (stream) =>
      stream.category.trim().toLowerCase() ===
      category.nombre.trim().toLowerCase()
  ).length;

  const imageMap: Record<string, string> = {
    Gaming: brandAssets.gamingCategoria,
    Musica: brandAssets.musicaCategoria,
    Charlas: brandAssets.charlasCategoria,
    Tecnologia: brandAssets.tecnologiaCategoria,
    Deportes: brandAssets.deportesCategoria,
    Podcasts: brandAssets.podcastsCategoria,
  };

  return {
    id: String(category.id_categoria),
    name: category.nombre,
    icon: "grid",
    viewers: String(activeCount),
    color: "#00e5ff",
    image: imageMap[category.nombre] || brandAssets.charlasCategoria,
  };
}

function backendChannelToCard(channel: BackendCanal): HomeChannelItem {
  return {
    id: String(channel.id_canal),
    name: channel.nombre_canal,
    subtitle: channel.tipo_canal.nombre_tipo,
    viewers: "0",
    avatar: getInitials(channel.nombre_canal),
    photo: channel.foto_canal,
  };
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SectionBlock>
      <SectionHeader>
        <h2>{title}</h2>
        {action}
      </SectionHeader>
      {children}
    </SectionBlock>
  );
}

function EmptyPanel({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <StatePanel>
      <StateIcon>{icon}</StateIcon>
      <h2>{title}</h2>
      <p>{text}</p>
    </StatePanel>
  );
}

function StreamAvatar({ stream }: { stream: HomeStreamItem }) {
  if (isImageUrl(stream.channelPhoto)) {
    return (
      <Avatar>
        <img
          src={stream.channelPhoto || ""}
          alt={stream.channel}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Avatar>
    );
  }

  return <Avatar>{stream.avatar}</Avatar>;
}

function StreamCard({ stream }: { stream: HomeStreamItem }) {
  return (
    <ContentCard to={`/streams/${stream.id}`}>
      <Thumb $image={stream.image}>
        <LiveBadge>EN VIVO</LiveBadge>
        <ViewBadge>
          <FiEye /> {stream.viewers}
        </ViewBadge>
      </Thumb>

      <CardBody>
        <CardTitle>{stream.title}</CardTitle>

        <MetaLine>
          <StreamAvatar stream={stream} />
          <span>{stream.channel}</span>
          <VerifiedDot />
        </MetaLine>

        <Muted>{stream.category}</Muted>
      </CardBody>
    </ContentCard>
  );
}

function ChannelAvatar({ channel }: { channel: HomeChannelItem }) {
  if (isImageUrl(channel.photo)) {
    return (
      <Avatar>
        <img
          src={channel.photo || ""}
          alt={channel.name}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Avatar>
    );
  }

  return <Avatar>{channel.avatar}</Avatar>;
}

export default function HomePage() {
  const loggedIn = isAuthenticated();

  const [liveStreams, setLiveStreams] = useState<HomeStreamItem[]>([]);
  const [featuredStreams, setFeaturedStreams] = useState<HomeStreamItem[]>([]);
  const [backendCategories, setBackendCategories] = useState<Category[]>([]);
  const [backendChannels, setBackendChannels] = useState<HomeChannelItem[]>([]);
  const [homePodcasts, setHomePodcasts] = useState<PodcastItem[]>([]);
  const [podcastsError, setPodcastsError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      setLoading(true);
      setError("");

      try {
        const [live, featured, categoriesResult, channelsResult] =
          await Promise.all([
            getLiveStreams(),
            getFeaturedStreams(),
            getBackendCategories(),
            getBackendChannels(),
          ]);

        if (!active) return;

        const liveCards = live.map(backendStreamToCard);

        setLiveStreams(liveCards);
        setFeaturedStreams(featured.map(backendStreamToCard));
        setBackendCategories(
          categoriesResult.map((category) =>
            backendCategoryToCard(category, liveCards)
          )
        );
        setBackendChannels(channelsResult.map(backendChannelToCard));
        try {
          const podcastsResult = await getPodcasts();

          if (!active) return;

          setHomePodcasts(podcastsResult.slice(0, 4));
          setPodcastsError("");
        } catch (error) {
          console.error("HOME_PODCASTS_LOAD_ERROR", error);

          if (active) {
            setHomePodcasts([]);
            setPodcastsError(
              "No pudimos cargar los podcasts reales en este momento."
            );
          }
        }
      } catch (error) {
        console.error("HOME_STREAMS_LOAD_ERROR", error);

        if (active) {
          setError(
            "No pudimos cargar la información de canales en este momento. Intenta actualizar la página."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      active = false;
    };
  }, []);

  const heroStream = liveStreams[0];

  const filteredStreams =
    selectedCategory === "Todas"
      ? liveStreams
      : liveStreams.filter(
          (stream) =>
            stream.category?.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
        );

  return (
    <RootShell active="home">
      {error ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>No se pudo cargar contenido</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      ) : null}

      <HeroGrid>
        <HeroCopy>
          <Eyebrow>{loggedIn ? "¡Bienvenido de nuevo!" : "ROOTBLEND"}</Eyebrow>
          <h1>
            Explora transmisiones <span>en vivo</span>
          </h1>
          <p>
            Descubre streams, canales, categorías y podcasts desde una sola
            plataforma distribuida.
          </p>

          <ButtonRow>
            <PrimaryLink to="/streams">
              Explorar en vivo <FiPlay />
            </PrimaryLink>

            <GhostLink to="/podcasts">
              <FiHeadphones /> Ver podcasts
            </GhostLink>
          </ButtonRow>
        </HeroCopy>

        <HeroMedia
          $image={heroStream?.image ? heroStream.image : brandAssets.fondo}
        >
          <FeaturedFlag>DESTACADO</FeaturedFlag>

          <HeroOverlay>
            {heroStream ? (
              <>
                <LiveBadge>EN VIVO</LiveBadge>
                <h3>{heroStream.title}</h3>
                <p>{heroStream.channel}</p>
              </>
            ) : (
              <>
                <h3>No hay transmisiones en vivo</h3>
                <p>Cuando un streamer inicie directo, aparecerá aquí.</p>
              </>
            )}
          </HeroOverlay>
        </HeroMedia>
      </HeroGrid>

      {loading ? (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando </strong>
            <p>Consultando streams, canales, categorías y podcasts reales.</p>
          </div>
        </AlertPanel>
      ) : null}

      <FilterRow>
        <FilterChip
          $active={selectedCategory === "Todas"}
          onClick={() => setSelectedCategory("Todas")}
        >
          Todas
        </FilterChip>

        {backendCategories.map((category) => (
          <FilterChip
            key={category.id}
            $active={selectedCategory === category.name}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </FilterChip>
        ))}
      </FilterRow>

      <Section
        title="Transmisiones en vivo"
        action={<TextLink to="/streams">Ver todas</TextLink>}
      >
        {filteredStreams.length === 0 ? (
          <EmptyPanel
            icon={<FiWifiOff />}
            title="No hay streams en esta categoría"
            text="El home solo muestra transmisiones reales. Prueba seleccionando otra categoría o vuelve a Todas."
          />
        ) : (
          <CardGrid>
            {filteredStreams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </CardGrid>
        )}
      </Section>

      <Section
        title="Transmisiones destacadas"
        action={<TextLink to="/streams">Explorar</TextLink>}
      >
        {featuredStreams.length === 0 ? (
          <EmptyPanel
            icon={<FiStar />}
            title="No hay transmisiones destacadas"
            text="Cuando un creador marque un stream real como destacado, aparecerá en esta sección."
          />
        ) : (
          <CardGrid>
            {featuredStreams.map((stream) => (
              <StreamCard key={`featured-${stream.id}`} stream={stream} />
            ))}
          </CardGrid>
        )}
      </Section>

      <Section
        title="Canales registrados"
        action={<TextLink to="/creators">Ver todos</TextLink>}
      >
        {backendChannels.length === 0 ? (
          <EmptyPanel
            icon={<FiUsers />}
            title="No hay canales creados"
            text="Los canales aparecerán aquí cuando los usuarios activen su canal de creador."
          />
        ) : (
          <PodcastGrid>
            {backendChannels.map((channel) => (
              <PodcastTile key={channel.id} to={`/channels/${channel.id}`}>
                <ChannelAvatar channel={channel} />

                <div>
                  <CardTitle>{channel.name}</CardTitle>
                  <Muted>{channel.subtitle}</Muted>
                </div>

                <FiArrowRight />
              </PodcastTile>
            ))}
          </PodcastGrid>
        )}
      </Section>

      <Section title="Categorías">
        {backendCategories.length === 0 ? (
          <EmptyPanel
            icon={<FiGrid />}
            title="No hay categorías"
            text="Aún no hay categorías disponibles."
          />
        ) : (
          <CategoryGrid>
            {backendCategories.map((category) => (
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
        )}
      </Section>

      <Section
        title="Podcasts"
        action={<TextLink to="/podcasts">Abrir sección</TextLink>}
      >
        {podcastsError ? (
          <EmptyPanel
            icon={<FiHeadphones />}
            title="Podcasts no disponibles"
            text={podcastsError}
          />
        ) : homePodcasts.length === 0 ? (
          <EmptyPanel
            icon={<FiHeadphones />}
            title="No hay podcasts publicados"
            text="Cuando existan podcasts reales publicados, aparecerán aquí."
          />
        ) : (
          <PodcastGrid>
            {homePodcasts.map((podcast) => (
              <PodcastTile key={podcast.id} to={`/podcasts/${podcast.id}`}>
                <PodcastCover $image={podcast.cover || brandAssets.podcastsCategoria}>
                  <FiHeadphones />
                </PodcastCover>

                <div>
                  <CardTitle>{podcast.title}</CardTitle>

                  <MetaLine>
                    <span>{podcast.category || "Sin categoría"}</span>
                    <span>{podcast.episodes} episodios</span>
                    <span>{podcast.plays ?? 0} reproducciones</span>
                  </MetaLine>

                  <Muted>{podcast.description}</Muted>
                </div>

                <FiArrowRight />
              </PodcastTile>
            ))}
          </PodcastGrid>
        )}
      </Section>
    </RootShell>
  );
}