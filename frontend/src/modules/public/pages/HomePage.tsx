import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  podcasts,
  type Category,
  type PodcastItem,
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
  CategoryCard,
  CategoryGrid,
  ContentCard,
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
  PanelHeader,
  PodcastCover,
  PodcastGrid,
  PodcastTile,
  PrimaryLink,
  RoundButton,
  SectionBlock,
  SectionHeader,
  SideListItem,
  SidePanel,
  StateIcon,
  StatePanel,
  TextLink,
  Thumb,
  VerifiedDot,
  ViewBadge,
} from "../../../shared/styles/legacyStyled";

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

function backendStreamToCard(stream: BackendStream): StreamItem {
  return {
    id: String(stream.id_stream),
    title: stream.titulo,
    channel: stream.canal.nombre_canal,
    handle: `@${stream.canal.nombre_canal.toLowerCase().replace(/\s+/g, "")}`,
    category: stream.categoria.nombre,
    viewers: `${stream.viewer_count || 0}`,
    avatar: getInitials(stream.canal.nombre_canal),
    image: brandAssets.streamView,
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
  liveStreams: StreamItem[]
): Category {
  const activeCount = liveStreams.filter(
    (stream) => stream.category === category.nombre
  ).length;

  return {
    id: String(category.id_categoria),
    name: category.nombre,
    icon: "grid",
    viewers: String(activeCount),
    color: "#00e5ff",
    image: brandAssets.categoriesView,
  };
}

function backendChannelToCard(channel: BackendCanal) {
  return {
    name: channel.nombre_canal,
    subtitle: channel.tipo_canal.nombre_tipo,
    viewers: "0",
    avatar: getInitials(channel.nombre_canal),
    id: String(channel.id_canal),
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

function StreamCard({ stream }: { stream: StreamItem }) {
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
          <Avatar>{stream.avatar}</Avatar>
          <span>{stream.channel}</span>
          <VerifiedDot />
        </MetaLine>

        <Muted>{stream.category}</Muted>
      </CardBody>
    </ContentCard>
  );
}

function PodcastCard({ podcast }: { podcast: PodcastItem }) {
  return (
    <PodcastTile to={`/podcasts/${podcast.id}`}>
      <PodcastCover $image={podcast.image}>
        <FiPlay />
      </PodcastCover>

      <div>
        <CardTitle>{podcast.title}</CardTitle>
        <Muted>{podcast.creator}</Muted>
        <Muted>Ultimo episodio: {podcast.duration}</Muted>
      </div>

      <RoundButton type="button" title="Reproducir">
        <FiPlay />
      </RoundButton>
    </PodcastTile>
  );
}

function DemoRightPanel({ liveStreams = [] }: { liveStreams?: StreamItem[] }) {
  return (
    <SidePanel>
      <PanelHeader>
        <strong>Ahora en vivo</strong>
        <Link to="/streams">Ver todos</Link>
      </PanelHeader>

      {liveStreams.length === 0 ? (
        <EmptyPanel
          icon={<FiWifiOff />}
          title="Sin directos"
          text="Cuando un streamer inicie transmisión, aparecerá aquí."
        />
      ) : (
        liveStreams.slice(0, 4).map((stream) => (
          <SideListItem key={stream.id} to={`/streams/${stream.id}`}>
            <Avatar>{stream.avatar}</Avatar>
            <span>{stream.channel}</span>
            <small>{stream.viewers}</small>
          </SideListItem>
        ))
      )}
    </SidePanel>
  );
}

export default function HomePage() {
  const loggedIn = isAuthenticated();

  const [liveStreams, setLiveStreams] = useState<StreamItem[]>([]);
  const [featuredStreams, setFeaturedStreams] = useState<StreamItem[]>([]);
  const [backendCategories, setBackendCategories] = useState<Category[]>([]);
  const [backendChannels, setBackendChannels] = useState<
    ReturnType<typeof backendChannelToCard>[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <RootShell
      active="home"
      rightPanel={loggedIn ? <DemoRightPanel liveStreams={liveStreams} /> : undefined}
    >
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
          <Eyebrow>{loggedIn ? "Home logueado" : "MEZCLA DE RAÍCES"}</Eyebrow>
          <h1>
            Explora transmisiones <span>en vivo</span>
          </h1>
          <p>
            Descubre streams, canales y podcasts de creadores reales registrados
            en la plataforma.
          </p>

          <ButtonRow>
            <PrimaryLink to="/streams">
              Explorar en vivo <FiPlay />
            </PrimaryLink>

            <GhostLink to="/podcasts">
              <FiHeadphones /> Podcasts de explorar
            </GhostLink>
          </ButtonRow>
        </HeroCopy>

        <HeroMedia $image={brandAssets.publicHome}>
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
            <strong>Cargando streams</strong>
            <p>Preparando la información...</p>
          </div>
        </AlertPanel>
      ) : null}

      <FilterRow>
        <FilterChip $active>Todas</FilterChip>
        {backendCategories.map((category) => (
          <FilterChip key={category.id}>{category.name}</FilterChip>
        ))}
      </FilterRow>

      <Section
        title="Transmisiones en vivo"
        action={<TextLink to="/streams">Ver todas</TextLink>}
      >
        {liveStreams.length === 0 ? (
          <EmptyPanel
            icon={<FiWifiOff />}
            title="No hay streams en vivo"
            text="Todavía ningún streamer inició transmisión. Puedes explorar categorías o podcasts mientras tanto."
          />
        ) : (
          <CardGrid>
            {liveStreams.map((stream) => (
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
            text="Cuando un creador marque un stream como destacado, aparecerá en esta sección."
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
        action={<TextLink to="/channels/1">Ver canal</TextLink>}
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
                <Avatar>{channel.avatar}</Avatar>

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

      <Section
        title="Categorías"
        action={<TextLink to="/categories">Ver todas</TextLink>}
      >
        {backendCategories.length === 0 ? (
          <EmptyPanel
            icon={<FiGrid />}
            title="No hay categorías"
            text="Aún no hay categorías disponibles."
          />
        ) : (
          <CategoryGrid>
            {backendCategories.slice(0, 4).map((category) => (
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
        title="Podcasts destacados"
        action={<TextLink to="/podcasts">Ver todos</TextLink>}
      >
        <PodcastGrid>
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </PodcastGrid>
      </Section>
    </RootShell>
  );
}