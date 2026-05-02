import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiBell,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiEdit3,
  FiEye,
  FiFile,
  FiGrid,
  FiHeadphones,
  FiHeart,
  FiHome,
  FiLock,
  FiLogOut,
  FiMail,
  FiMic,
  FiMonitor,
  FiMoreVertical,
  FiPause,
  FiPlay,
  FiPlus,
  FiRadio,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiSend,
  FiSettings,
  FiShield,
  FiStar,
  FiTrash2,
  FiUpload,
  FiUser,
  FiUsers,
  FiVolume2,
  FiWifiOff,
  FiXCircle,
  FiZap,
} from "react-icons/fi";
import {
  brandAssets,
  categories,
  chatMessages,
  moderationRows,
  notifications,
  podcasts,
  recommendedChannels,
  serviceStatuses,
  stats,
  streams,
  type ChatMessage,
  type PodcastItem,
  type StreamItem,
} from "./rootblendMock";
import { clearAuthStorage, getStoredUser, isAuthenticated } from "../auth/utils/authStorage";
import {
  saveAuthSession,
  loginUser,
  registerUser,
  logoutUser,
} from "../auth/services/authService";

type ShellProps = {
  active?: string;
  children: ReactNode;
  rightPanel?: ReactNode;
};

const demoUser = {
  id_usuario: 1,
  correo: "usuario_123@rootblend.dev",
  estado: "activo",
  nombre_visible: "usuario_123",
};

const pageLinks = [
  { label: "Inicio", to: "/", icon: FiHome, key: "home" },
  { label: "Explorar", to: "/streams", icon: FiCompass, key: "streams" },
  { label: "Categorias", to: "/categories", icon: FiGrid, key: "categories" },
  { label: "Podcasts", to: "/podcasts", icon: FiHeadphones, key: "podcasts" },
  { label: "Creador", to: "/creator/activate", icon: FiRadio, key: "creator" },
  { label: "Moderacion", to: "/moderation", icon: FiShield, key: "moderation" },
  { label: "Servicios", to: "/system-status", icon: FiMonitor, key: "system" },
];

function loginMock(email: string) {
  const fallbackName = "usuario_123";
  const cleanEmail = email.trim() || `${fallbackName}@rootblend.dev`;
  const visibleName = cleanEmail.includes("@")
    ? cleanEmail.split("@")[0] || fallbackName
    : cleanEmail || fallbackName;

  saveAuthSession({
    access_token: "mock_access_token_rootblend",
    refresh_token: "mock_refresh_token_rootblend",
    token_type: "Bearer",
    expires_in: 3600,
    usuario: {
      ...demoUser,
      correo: cleanEmail,
      nombre_visible: visibleName,
    },
  });
}

function formatApiError(errors: unknown, fallback: string) {
  if (!errors || typeof errors !== "object") {
    return fallback;
  }

  const firstValue = Object.values(errors as Record<string, unknown>)[0];

  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return String(firstValue[0]);
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return fallback;
}

function getUserLabel() {
  const stored = getStoredUser() as { nombre_visible?: string; correo?: string } | null;
  return stored?.nombre_visible || stored?.correo || "usuario_123";
}

function firstStream() {
  return streams[0];
}

function firstPodcast() {
  return podcasts[0];
}

const CREATOR_ROLE_KEY = "creator_role";
const MODERATORS_KEY = "rootblend:moderators:cyberpunk-2077";

type CreatorRole = "streamer" | "podcaster";

function getCreatorRole(): CreatorRole | null {
  const role = localStorage.getItem(CREATOR_ROLE_KEY);
  return role === "streamer" || role === "podcaster" ? role : null;
}

function setCreatorRole(role: CreatorRole) {
  localStorage.setItem(CREATOR_ROLE_KEY, role);
  window.dispatchEvent(new Event("creator-role-changed"));
}

function getModerators() {
  const stored = localStorage.getItem(MODERATORS_KEY);

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return ["GamerX", "PixelKing", "LunaVibes"];
    }
  }

  return ["GamerX", "PixelKing", "LunaVibes"];
}

function saveModerators(moderators: string[]) {
  localStorage.setItem(MODERATORS_KEY, JSON.stringify(moderators));
}

export function RootShell({ active = "home", children, rightPanel }: ShellProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const loggedIn = isAuthenticated();
  const role = getCreatorRole();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  return (
    <AppFrame>
      <Topbar>
        <BrandLink to="/">
          <img src={brandAssets.logo} alt="ROOTBLEND" />
          <strong>ROOT<span>BLEND</span></strong>
        </BrandLink>

        <SearchForm onSubmit={submitSearch}>
          <FiSearch />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar transmisiones, canales o categorias..."
          />
        </SearchForm>

        <TopActions>
          {loggedIn ? (
            <>
              <TopPopoverWrap>
                <IconRound
                  type="button"
                  title="Notificaciones"
                  onClick={() => {
                    setNotificationsOpen((value) => !value);
                    setMenuOpen(false);
                  }}
                >
                  <FiBell />
                  <UnreadDot />
                </IconRound>

                {notificationsOpen && (
                  <DropdownPanel $wide>
                    <DropdownHeader>
                      <strong>Notificaciones</strong>
                      <Link to="/notifications" onClick={() => setNotificationsOpen(false)}>
                        Ver todas
                      </Link>
                    </DropdownHeader>

                    {notifications.map((item, index) => (
                      <DropdownItem
                        key={item.title}
                        to={index === 1 ? "/podcasts/fuera-orbita" : "/streams/cyberpunk-2077"}
                        onClick={() => setNotificationsOpen(false)}
                      >
                        <NotificationMark $accent={item.accent} />
                        <div>
                          <strong>{item.title}</strong>
                          <small>{item.meta}</small>
                        </div>
                      </DropdownItem>
                    ))}
                  </DropdownPanel>
                )}
              </TopPopoverWrap>

              <TopPopoverWrap>
                <UserPill
                  type="button"
                  onClick={() => {
                    setMenuOpen((value) => !value);
                    setNotificationsOpen(false);
                  }}
                >
                  <Avatar>U</Avatar>
                  <span>{getUserLabel()}</span>
                </UserPill>

                {menuOpen && (
                  <DropdownPanel>
                    <ProfileHeader>
                      <Avatar $large>U</Avatar>
                      <div>
                        <h2>{getUserLabel()}</h2>
                        <p>
                          {role
                            ? `Creador ${role === "streamer" ? "streamer" : "podcaster"}`
                            : "Viewer ROOTBLEND"}
                        </p>
                      </div>
                    </ProfileHeader>

                    <DropdownMenuLink to="/" onClick={() => setMenuOpen(false)}>
                      <FiHome /> Inicio
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/profile" onClick={() => setMenuOpen(false)}>
                      <FiUser /> Perfil
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/channels/cyberpunk-2077" onClick={() => setMenuOpen(false)}>
                      <FiEye /> Mi canal
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/creator/activate" onClick={() => setMenuOpen(false)}>
                      <FiRadio /> Activar canal
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/creator/dashboard" onClick={() => setMenuOpen(false)}>
                      <FiGrid /> Panel creador
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/stats" onClick={() => setMenuOpen(false)}>
                      <FiActivity /> Estadisticas
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/settings" onClick={() => setMenuOpen(false)}>
                      <FiSettings /> Configuracion
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/notifications" onClick={() => setMenuOpen(false)}>
                      <FiBell /> Notificaciones
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/following" onClick={() => setMenuOpen(false)}>
                      <FiUsers /> Seguidos
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/subscriptions" onClick={() => setMenuOpen(false)}>
                      <FiStar /> Suscripciones
                    </DropdownMenuLink>
                    <DropdownMenuLink to="/change-password" onClick={() => setMenuOpen(false)}>
                      <FiLock /> Cambiar contrasena
                    </DropdownMenuLink>
                    <DropdownMenuLink
                      to="/"
                      onClick={async () => {
                        await logoutUser();
                        clearAuthStorage();
                        setMenuOpen(false);
                        navigate("/");
                      }}
                    >
                      <FiLogOut /> Cerrar sesión
                    </DropdownMenuLink>
                  </DropdownPanel>
                )}
              </TopPopoverWrap>
            </>
          ) : (
            <>
              <GhostLink to="/login">Iniciar sesion</GhostLink>
              <PrimaryLink to="/register">Registrarse</PrimaryLink>
            </>
          )}
        </TopActions>
      </Topbar>

      <ShellGrid $hasRightPanel={Boolean(rightPanel)}>
        <Sidebar>
          <SidebarSection>
            <SidebarTitle>Recomendados</SidebarTitle>
            {recommendedChannels.map((channel) => (
              <ChannelMini key={channel.name} to="/streams/cyberpunk-2077">
                <Avatar>{channel.avatar}</Avatar>
                <MiniText>
                  <strong>{channel.name}</strong>
                  <small>{channel.subtitle}</small>
                </MiniText>
                <ViewerDot>{channel.viewers}</ViewerDot>
              </ChannelMini>
            ))}
          </SidebarSection>

          <SidebarSection>
            <SidebarTitle>Explorar</SidebarTitle>
            {pageLinks.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarLink
                  key={item.key}
                  to={item.to}
                  $active={active === item.key}
                >
                  <Icon />
                  <span>{item.label}</span>
                </SidebarLink>
              );
            })}
          </SidebarSection>

          <PromoPanel>
            <strong>Suscribete a ROOTBLEND</strong>
            <p>Apoya a tus creadores favoritos y desbloquea beneficios.</p>
            <PrimaryLink to="/subscriptions">Descubre mas</PrimaryLink>
          </PromoPanel>
        </Sidebar>

        <MainArea>{children}</MainArea>
        {rightPanel && <RightRail>{rightPanel}</RightRail>}
      </ShellGrid>
    </AppFrame>
  );
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

function StreamCard({ stream }: { stream: StreamItem }) {
  return (
    <ContentCard to={`/streams/${stream.id}`}>
      <Thumb $image={stream.image}>
        <LiveBadge>EN VIVO</LiveBadge>
        <ViewBadge><FiEye /> {stream.viewers}</ViewBadge>
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

function ChatPanel({ allowInput = true }: { allowInput?: boolean }) {
  const [items, setItems] = useState<ChatMessage[]>(chatMessages);
  const [message, setMessage] = useState("");
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [moderators, setModerators] = useState<string[]>(() => getModerators());
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [actionFeedback, setActionFeedback] = useState("Moderacion por canal: PixelNate / Cyberpunk 2077.");
  const loggedIn = isAuthenticated();
  const ownerMode = getCreatorRole() === "streamer";
  const canModerate = ownerMode || moderators.includes(getUserLabel());

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentUser = getUserLabel();
    if (!message.trim() || !loggedIn || !allowInput) return;
    if (mutedUsers.includes(currentUser) || blockedUsers.includes(currentUser)) {
      setActionFeedback("No puedes escribir porque tienes una sancion activa en este canal.");
      return;
    }
    setItems((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        user: currentUser,
        badge: "TU",
        text: message.trim(),
        time: "Ahora",
        color: "#00e5ff",
      },
    ]);
    setMessage("");
  }

  function assignModerator(user: string) {
    if (!ownerMode) {
      setActionFeedback("Solo el duenio del canal puede asignar moderadores.");
      return;
    }

    const next = Array.from(new Set([...moderators, user]));
    setModerators(next);
    saveModerators(next);
    setItems((current) =>
      current.map((item) =>
        item.user === user
          ? {
              ...item,
              badge: "MOD",
            }
          : item
      )
    );
    setActionFeedback(`${user} ahora es moderador solo de este canal.`);
    setActiveMessageId(null);
  }

  function deleteMessage(id: string, user: string) {
    if (!canModerate) {
      setActionFeedback("Necesitas ser moderador de este canal para eliminar mensajes.");
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              text: "Mensaje eliminado por moderacion.",
              color: "#94a3b8",
            }
          : item
      )
    );
    setActionFeedback(`Mensaje de ${user} eliminado para todos.`);
    setActiveMessageId(null);
  }

  function silenceUser(user: string) {
    if (!canModerate) {
      setActionFeedback("Necesitas ser moderador de este canal para silenciar usuarios.");
      return;
    }

    setMutedUsers((current) => Array.from(new Set([...current, user])));
    setActionFeedback(`${user} fue silenciado 10 minutos en este canal.`);
    setActiveMessageId(null);
  }

  function blockUser(user: string) {
    if (!canModerate) {
      setActionFeedback("Necesitas ser moderador de este canal para bloquear usuarios.");
      return;
    }

    setBlockedUsers((current) => Array.from(new Set([...current, user])));
    setItems((current) => current.filter((item) => item.user !== user));
    setActionFeedback(`${user} fue bloqueado del chat de este canal.`);
    setActiveMessageId(null);
  }

  function viewProfile(user: string) {
    setActionFeedback(`Vista demo del perfil de ${user}. En backend abrira el perfil publico real.`);
    setActiveMessageId(null);
  }

  return (
    <ChatBox>
      <PanelHeader>
        <strong>Chat en vivo</strong>
        <HeaderActionGroup>
          <ServicePill $status={canModerate ? "Operativo" : "Degradado"}>
            {canModerate ? "MOD activo" : "Viewer"}
          </ServicePill>
          <Link to="/moderation"><FiSettings /></Link>
        </HeaderActionGroup>
      </PanelHeader>
      <ChatStatus>{actionFeedback}</ChatStatus>
      <ChatMessages>
        {items.map((item) => (
          <ChatRow key={item.id}>
            <Avatar $small>{item.user.slice(0, 2).toUpperCase()}</Avatar>
            <ChatBubble>
              <ChatName $color={item.color}>
                {item.user} {item.badge && <span>{item.badge}</span>}
                <time>{item.time}</time>
              </ChatName>
              <p>{item.text}</p>
            </ChatBubble>
            <ChatActionButton
              type="button"
              title="Acciones de chat"
              onClick={() =>
                setActiveMessageId((current) => current === item.id ? null : item.id)
              }
            >
              <FiMoreVertical />
            </ChatActionButton>
            {activeMessageId === item.id && (
              <ChatActionMenu>
                <button type="button" onClick={() => viewProfile(item.user)}>
                  <FiEye /> Ver perfil
                </button>
                <button type="button" onClick={() => assignModerator(item.user)}>
                  <FiShield /> Hacer moderador
                </button>
                <button type="button" onClick={() => deleteMessage(item.id, item.user)}>
                  <FiTrash2 /> Eliminar mensaje
                </button>
                <button type="button" onClick={() => silenceUser(item.user)}>
                  <FiVolume2 /> Silenciar usuario
                </button>
                <button type="button" onClick={() => blockUser(item.user)}>
                  <FiXCircle /> Bloquear usuario
                </button>
              </ChatActionMenu>
            )}
          </ChatRow>
        ))}
      </ChatMessages>
      {loggedIn && allowInput ? (
        <ChatForm onSubmit={sendMessage}>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Enviar un mensaje..."
          />
          <button type="submit">
            <FiSend />
          </button>
        </ChatForm>
      ) : (
        <LoginNotice>
          Inicia sesion para escribir en el chat.
          <PrimaryLink to="/login">Iniciar sesion</PrimaryLink>
        </LoginNotice>
      )}
    </ChatBox>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <MetricCard>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </MetricCard>
  );
}

function DemoRightPanel() {
  return (
    <SidePanel>
      <PanelHeader>
        <strong>Ahora en vivo</strong>
        <Link to="/streams">Ver todos</Link>
      </PanelHeader>
      {streams.slice(0, 4).map((stream) => (
        <SideListItem key={stream.id} to={`/streams/${stream.id}`}>
          <Avatar>{stream.avatar}</Avatar>
          <span>{stream.channel}</span>
          <small>{stream.viewers}</small>
        </SideListItem>
      ))}
      <Divider />
      <PanelHeader>
        <strong>Estado demo</strong>
        <Link to="/system-status">Abrir</Link>
      </PanelHeader>
      <ServicePill $status="Degradado">
        <FiAlertTriangle />
        estadisticas-service degradado
      </ServicePill>
    </SidePanel>
  );
}

export function HomePage() {
  const loggedIn = isAuthenticated();

  return (
    <RootShell active="home" rightPanel={loggedIn ? <DemoRightPanel /> : undefined}>
      <HeroGrid>
        <HeroCopy>
          <Eyebrow>{loggedIn ? "Home logueado" : "ROOTBLEND"}</Eyebrow>
          <h1>
            Explora transmisiones <span>en vivo</span>
          </h1>
          <p>
            Descubre streams, canales y podcasts de creadores increibles en todo
            tipo de categorias.
          </p>
          <ButtonRow>
            <PrimaryLink to="/streams">
              Explorar en vivo <FiPlay />
            </PrimaryLink>
            <GhostLink to="/podcasts">
              <FiHeadphones /> Explorar podcasts
            </GhostLink>
          </ButtonRow>
        </HeroCopy>
        <HeroMedia $image={brandAssets.publicHome}>
          <FeaturedFlag>DESTACADO</FeaturedFlag>
          <HeroOverlay>
            <LiveBadge>EN VIVO</LiveBadge>
            <h3>Cyberpunk 2077: Phantom Liberty</h3>
            <p>PixelNate - 5.2K espectadores</p>
          </HeroOverlay>
        </HeroMedia>
      </HeroGrid>

      <FilterRow>
        {["Todas", "Juego de azar", "Just Chatting", "Videojuegos", "Musica", "Deportes", "Tecnologia", "Podcasts"].map((item, index) => (
          <FilterChip key={item} $active={index === 0}>{item}</FilterChip>
        ))}
      </FilterRow>

      <Section title="Transmisiones en vivo" action={<TextLink to="/streams">Ver todas</TextLink>}>
        <CardGrid>
          {streams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </CardGrid>
      </Section>

      <Section title="Streams destacados" action={<TextLink to="/streams">Explorar</TextLink>}>
        <CardGrid>
          {streams.slice(0, 3).map((stream) => (
            <StreamCard key={`featured-${stream.id}`} stream={stream} />
          ))}
        </CardGrid>
      </Section>

      <Section title="Canales recomendados" action={<TextLink to="/channels/cyberpunk-2077">Ver canal</TextLink>}>
        <PodcastGrid>
          {recommendedChannels.map((channel, index) => {
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

      <Section title="Categorias populares" action={<TextLink to="/categories">Ver todas</TextLink>}>
        <CategoryGrid>
          {categories.slice(0, 4).map((category) => (
            <CategoryCard key={category.id} to={`/streams?category=${encodeURIComponent(category.name)}`} $image={category.image}>
              <span>{category.name}</span>
              <small>{category.viewers} espectadores activos</small>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Section>

      <Section title="Podcasts destacados" action={<TextLink to="/podcasts">Ver todos</TextLink>}>
        <PodcastGrid>
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </PodcastGrid>
      </Section>

      <FeatureStrip>
        <FeatureItem><FiZap /> <span>En vivo 24/7</span><small>Siempre hay algo increible pasando.</small></FeatureItem>
        <FeatureItem><FiUsers /> <span>Comunidad global</span><small>Conecta, chatea y forma parte.</small></FeatureItem>
        <FeatureItem><FiStar /> <span>Apoya a creadores</span><small>Suscribete y se parte del crecimiento.</small></FeatureItem>
      </FeatureStrip>
    </RootShell>
  );
}

export function ExploreStreamsPage() {
  const [params] = useSearchParams();
  const initialCategory = params.get("category") || "Todos";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [visibleCount, setVisibleCount] = useState(12);
  const repeatedStreams = [...streams, ...streams, ...streams].map((stream, index) => ({
    ...stream,
    id: `${stream.id}-${index}`,
  }));

  const filtered = useMemo(() => {
    return repeatedStreams.filter((stream) => {
      const text = `${stream.title} ${stream.channel} ${stream.category}`.toLowerCase();
      const bySearch = text.includes(search.toLowerCase());
      const byCategory = category === "Todos" || stream.category === category;
      return bySearch && byCategory;
    });
  }, [category, repeatedStreams, search]);

  return (
    <RootShell active="streams">
      <PageHeading>
        <Eyebrow>Explorar</Eyebrow>
        <h1>Explorar transmisiones en vivo</h1>
        <p>Busca por categoria, streamer o titulo y entra a cualquier directo.</p>
      </PageHeading>
      <Toolbar>
        <InputWrap>
          <FiSearch />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar stream..." />
        </InputWrap>
        <Select value={category} onChange={(event) => setCategory(event.target.value)}>
          {["Todos", "Gaming", "Musica", "Tecnologia", "Deportes", "Videojuegos", "Juego de azar"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </Toolbar>
      <CardGrid>
        {filtered.slice(0, visibleCount).map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </CardGrid>
      {filtered.length === 0 && <EmptyPanel icon={<FiSearch />} title="No encontramos resultados" text="Prueba con otra palabra o cambia los filtros." />}
      {filtered.length > visibleCount && (
        <Centered>
          <GhostButton type="button" onClick={() => setVisibleCount((count) => count + 6)}>
            Cargar mas transmisiones
          </GhostButton>
        </Centered>
      )}
    </RootShell>
  );
}

export function CategoriesPage() {
  return (
    <RootShell active="categories" rightPanel={<DemoRightPanel />}>
      <PageHeading>
        <Eyebrow>Descubrimiento</Eyebrow>
        <h1>Explora por categorias</h1>
        <p>Elige un interes y salta directamente al contenido activo.</p>
      </PageHeading>
      <CategoryGrid>
        {categories.map((category) => (
          <CategoryCard key={category.id} to={`/streams?category=${encodeURIComponent(category.name)}`} $image={category.image}>
            <span>{category.name}</span>
            <small>{category.viewers} espectadores activos</small>
          </CategoryCard>
        ))}
      </CategoryGrid>
      <Section title="Categorias destacadas" action={<TextLink to="/streams">Ver todo el catalogo</TextLink>}>
        <PodcastGrid>
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </PodcastGrid>
      </Section>
    </RootShell>
  );
}

export function SearchResultsPage() {
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

export function ChannelPage() {
  const { channelId } = useParams();
  const stream = streams.find((item) => item.id === channelId) || firstStream();

  return (
    <RootShell active="streams" rightPanel={<DemoRightPanel />}>
      <ChannelHero $image={brandAssets.channelView}>
        <Avatar $large>{stream.avatar}</Avatar>
        <div>
          <h1>{stream.channel}</h1>
          <p>{stream.handle} - {stream.category} - 24.5K seguidores</p>
          <ButtonRow>
            <PrimaryLink to={`/streams/${stream.id}`}><FiPlay /> Ver directo</PrimaryLink>
            <GhostLink to="/subscriptions"><FiHeart /> Suscribirse</GhostLink>
          </ButtonRow>
        </div>
      </ChannelHero>
      <Tabs>
        {["Inicio", "Acerca de", "Calendario", "Videos", "Clips", "Chat"].map((tab, index) => (
          <FilterChip key={tab} $active={index === 0}>{tab}</FilterChip>
        ))}
      </Tabs>
      <Section title="En vivo ahora">
        <CardGrid>
          <StreamCard stream={stream} />
          {streams.slice(1, 4).map((item) => <StreamCard key={item.id} stream={item} />)}
        </CardGrid>
      </Section>
      <Section title="Momentos destacados">
        <PodcastGrid>
          {streams.slice(0, 4).map((item) => (
            <PodcastTile key={item.id} to={`/streams/${item.id}`}>
              <PodcastCover $image={item.image}><FiPlay /></PodcastCover>
              <div>
                <CardTitle>{item.title}</CardTitle>
                <Muted>{item.viewers} vistas</Muted>
              </div>
            </PodcastTile>
          ))}
        </PodcastGrid>
      </Section>
    </RootShell>
  );
}

export function StreamDetailPage() {
  const { streamId } = useParams();
  const stream = streams.find((item) => item.id === streamId) || firstStream();
  const [following, setFollowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const loggedIn = isAuthenticated();

  return (
    <RootShell active="streams" rightPanel={<ChatPanel allowInput={loggedIn} />}>
      {!loggedIn && (
        <AlertPanel>
          <FiLock />
          <div>
            <strong>Modo visitante</strong>
            <p>Puedes ver el directo y leer el chat. Para escribir, seguir o suscribirte necesitas iniciar sesion.</p>
          </div>
          <PrimaryLink to="/login">Iniciar sesion</PrimaryLink>
          <GhostLink to="/register">Registrarse</GhostLink>
        </AlertPanel>
      )}
      <PlayerPanel>
        <VideoFrame $image={stream.image}>
          <LiveBadge>EN VIVO</LiveBadge>
          <VideoControls>
            <RoundButton type="button" onClick={() => setPlaying((value) => !value)}>
              {playing ? <FiPause /> : <FiPlay />}
            </RoundButton>
            <Progress><span /></Progress>
            <FiVolume2 />
            <FiMoreVertical />
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
            {loggedIn ? (
              <>
                <GhostButton type="button" onClick={() => setFollowing((value) => !value)}>
                  <FiHeart /> {following ? "Siguiendo" : "Seguir"}
                </GhostButton>
                <PrimaryButton type="button" onClick={() => setSubscribed((value) => !value)}>
                  <FiStar /> {subscribed ? "Suscrito" : "Suscribirse"}
                </PrimaryButton>
              </>
            ) : (
              <>
                <GhostLink to="/login"><FiHeart /> Seguir</GhostLink>
                <PrimaryLink to="/register"><FiStar /> Suscribirse</PrimaryLink>
              </>
            )}
          </ButtonRow>
        </StreamInfo>
      </PlayerPanel>

      <InfoGrid>
        <Panel>
          <PanelHeader><strong>Sobre el canal</strong></PanelHeader>
          <p>Directo activo con chat en vivo, acciones de viewer y datos listos para conectar al backend.</p>
        </Panel>
        <Panel>
          <PanelHeader><strong>Datos del stream</strong></PanelHeader>
          <TwoCol>
            <span>Categoria</span><strong>{stream.category}</strong>
            <span>Espectadores</span><strong>{stream.viewers}</strong>
            <span>Fecha de inicio</span><strong>Hoy, 20:45</strong>
          </TwoCol>
        </Panel>
      </InfoGrid>

      <Section title="Transmisiones relacionadas">
        <CardGrid>
          {streams.filter((item) => item.id !== stream.id).slice(0, 4).map((item) => (
            <StreamCard key={item.id} stream={item} />
          ))}
        </CardGrid>
      </Section>
    </RootShell>
  );
}

export function StreamWithChatPage() {
  return <StreamDetailPage />;
}

export function StreamGuestPage() {
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

export function PodcastsPage() {
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

function PodcastRightPanel() {
  return (
    <SidePanel>
      <PanelHeader><strong>Tendencias</strong><Link to="/podcasts">Ver todo</Link></PanelHeader>
      {podcasts.map((podcast) => (
        <SideListItem key={podcast.id} to={`/podcasts/${podcast.id}`}>
          <Avatar>{podcast.title.slice(0, 2).toUpperCase()}</Avatar>
          <span>{podcast.title}</span>
          <small>{podcast.duration}</small>
        </SideListItem>
      ))}
      <Divider />
      <PromoPanel>
        <strong>¿Tienes un podcast?</strong>
        <p>Publica episodios y conecta con tu audiencia.</p>
        <PrimaryLink to="/creator/activate">Hazlo crecer</PrimaryLink>
      </PromoPanel>
    </SidePanel>
  );
}

export function PodcastDetailPage() {
  const { podcastId } = useParams();
  const podcast = podcasts.find((item) => item.id === podcastId) || firstPodcast();
  const [currentEpisode, setCurrentEpisode] = useState(podcast.episodes[0]?.title || podcast.title);

  return (
    <RootShell active="podcasts" rightPanel={<PodcastRightPanel />}>
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

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("usuario_123@rootblend.dev");
  const [password, setPassword] = useState("Rootblend2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await loginUser(email, password);

      if (!result.success || !result.data) {
        setError(
          formatApiError(
            result.errors,
            result.message || "No se pudo iniciar sesión."
          )
        );
        return;
      }

      saveAuthSession(result.data);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("LOGIN_ERROR", error);
      setError("No se pudo conectar con el servicio de usuarios.");
    } finally {
      setLoading(false);
    }
  }

  function demoLogin() {
    loginMock(email);
    navigate("/", { replace: true });
  }

  return (
    <AuthScreen $image={brandAssets.loginView}>
      <AuthCard onSubmit={submit}>
        <BrandBlock>
          <img src={brandAssets.logo} alt="ROOTBLEND" />
          <h1>ROOT<span>BLEND</span></h1>
          <p>Inicia sesión en tu cuenta</p>
        </BrandBlock>

        <Label>Correo electrónico</Label>
        <Field>
          <FiMail />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Label>Contraseña</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <FormLine>
          <label>
            <input type="checkbox" /> Recordarme
          </label>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </FormLine>

        {error && (
          <AlertPanel>
            <FiAlertTriangle />
            <div>
              <strong>Error de inicio de sesión</strong>
              <p>{error}</p>
            </div>
          </AlertPanel>
        )}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Conectando..." : "Iniciar sesión"}
        </PrimaryButton>

        <GhostButton type="button" onClick={demoLogin}>
          Entrar en modo demo
        </GhostButton>

        <Muted>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </Muted>
      </AuthCard>
    </AuthScreen>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("nuevo_usuario@rootblend.dev");
  const [password, setPassword] = useState("Rootblend2026");
  const [confirmPassword, setConfirmPassword] = useState("Rootblend2026");
  const [role, setRole] = useState<"viewer" | "streamer" | "podcaster">("viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await registerUser(email, password);

      if (!result.success) {
        setError(
          formatApiError(
            result.errors,
            result.message || "No se pudo registrar el usuario."
          )
        );
        return;
      }

      if (role === "streamer" || role === "podcaster") {
        localStorage.setItem("creator_role", role);
        window.dispatchEvent(new Event("creator-role-changed"));
      }

      const loginResult = await loginUser(email, password);

      if (loginResult.success && loginResult.data) {
        saveAuthSession(loginResult.data);

        navigate(
          role === "streamer"
            ? "/creator/streamer"
            : role === "podcaster"
              ? "/creator/podcaster"
              : "/",
          { replace: true }
        );

        return;
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("REGISTER_ERROR", error);
      setError("No se pudo conectar con el servicio de usuarios.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen $image={brandAssets.cover}>
      <AuthCard onSubmit={submit}>
        <BrandBlock>
          <img src={brandAssets.logo} alt="ROOTBLEND" />
          <h1>Crea tu cuenta</h1>
          <p>Únete a la comunidad de ROOTBLEND</p>
        </BrandBlock>

        <Label>Correo electrónico</Label>
        <Field>
          <FiMail />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Label>Contraseña</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <Label>Confirmar contraseña</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Field>

        <ChoiceGrid>
          <ChoiceButton
            type="button"
            $active={role === "viewer"}
            onClick={() => setRole("viewer")}
          >
            Viewer
          </ChoiceButton>

          <ChoiceButton
            type="button"
            $active={role === "streamer"}
            onClick={() => setRole("streamer")}
          >
            Streamer
          </ChoiceButton>

          <ChoiceButton
            type="button"
            $active={role === "podcaster"}
            onClick={() => setRole("podcaster")}
          >
            Podcaster
          </ChoiceButton>
        </ChoiceGrid>

        {error && (
          <AlertPanel>
            <FiAlertTriangle />
            <div>
              <strong>Error de registro</strong>
              <p>{error}</p>
            </div>
          </AlertPanel>
        )}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </PrimaryButton>

        <Muted>
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </Muted>
      </AuthCard>
    </AuthScreen>
  );
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <AuthScreen $image={brandAssets.loginView}>
      <AuthCard onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
        <BrandBlock>
          <FiMail />
          <h1>Recupera tu contrasena</h1>
          <p>Te enviaremos un enlace para restablecerla.</p>
        </BrandBlock>
        <Label>Correo electronico</Label>
        <Field><FiMail /><input defaultValue="ejemplo@correo.com" /></Field>
        <PrimaryButton type="submit">Enviar enlace</PrimaryButton>
        {sent && <SuccessBox><FiCheckCircle /> Revisa tu bandeja de entrada.</SuccessBox>}
        <GhostLink to="/login">Volver al inicio de sesion</GhostLink>
      </AuthCard>
    </AuthScreen>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => navigate("/login"), 900);
  }

  return (
    <AuthScreen $image={brandAssets.loginView}>
      <AuthCard onSubmit={submit}>
        <BrandBlock>
          <FiLock />
          <h1>Nueva contrasena</h1>
          <p>Completa el segundo paso de recuperacion antes de volver al login.</p>
        </BrandBlock>
        <Label>Nueva contrasena</Label>
        <Field><FiLock /><input type="password" defaultValue="rootblend2026" /></Field>
        <Label>Confirmar contrasena</Label>
        <Field><FiLock /><input type="password" defaultValue="rootblend2026" /></Field>
        <PrimaryButton type="submit">Guardar nueva contrasena</PrimaryButton>
        {saved && <SuccessBox><FiCheckCircle /> Contrasena actualizada. Redirigiendo al login...</SuccessBox>}
        <GhostLink to="/login">Volver al inicio de sesion</GhostLink>
      </AuthCard>
    </AuthScreen>
  );
}

export function UserMenuPage() {
  const navigate = useNavigate();

  return (
    <RootShell active="home">
      <NarrowPanel>
        <ProfileHeader>
          <Avatar $large>U</Avatar>
          <div>
            <h1>usuario_123</h1>
            <p>Ver mi perfil</p>
          </div>
        </ProfileHeader>
        {[
          ["Mi canal", "/channels/cyberpunk-2077"],
          ["Panel de creador", "/creator/dashboard"],
          ["Estadisticas", "/creator/streamer/stats"],
          ["Configuracion", "/settings"],
          ["Notificaciones", "/notifications"],
          ["Idioma: Espanol", "/settings"],
        ].map(([label, to]) => (
          <MenuLine key={label} to={to}>{label}<FiArrowRight /></MenuLine>
        ))}
        <DangerButton type="button" onClick={() => { clearAuthStorage(); navigate("/"); }}>
          <FiLogOut /> Cerrar sesion
        </DangerButton>
      </NarrowPanel>
    </RootShell>
  );
}

export function ProfilePage() {
  return (
    <RootShell active="home" rightPanel={<DemoRightPanel />}>
      <ChannelHero $image={brandAssets.channelView}>
        <Avatar $large>U</Avatar>
        <div>
          <h1>usuario_123</h1>
          <p>Amante de los videojuegos, la musica y las buenas charlas.</p>
          <ButtonRow><PrimaryLink to="/profile/edit"><FiEdit3 /> Editar perfil</PrimaryLink><GhostLink to="/subscriptions">Seguidos</GhostLink></ButtonRow>
        </div>
      </ChannelHero>
      <MetricGrid>
        <StatCard label="Siguiendo" value="128" trend="+4 esta semana" />
        <StatCard label="Seguidores" value="354" trend="+12%" />
        <StatCard label="Suscripciones" value="12" trend="Activas" />
        <StatCard label="Streams vistos" value="86" trend="Mes actual" />
      </MetricGrid>
      <Section title="Streams recientes">
        <CardGrid>{streams.slice(0, 3).map((stream) => <StreamCard key={stream.id} stream={stream} />)}</CardGrid>
      </Section>
    </RootShell>
  );
}

export function EditProfilePage() {
  return (
    <RootShell active="home">
      <FormPanel title="Editar perfil" subtitle="Actualiza tu informacion visible dentro de ROOTBLEND." button="Guardar cambios">
        <ProfileHeader><Avatar $large>U</Avatar><GhostButton type="button">Cambiar foto</GhostButton></ProfileHeader>
        <Label>Nombre de usuario</Label><Field><FiUser /><input defaultValue="usuario_123" /></Field>
        <Label>Nombre visible</Label><Field><FiStar /><input defaultValue="Usuario 123" /></Field>
        <Label>Biografia</Label><TextArea defaultValue="Amante de los videojuegos, la musica y las buenas charlas." />
      </FormPanel>
    </RootShell>
  );
}

export function SettingsPage() {
  return (
    <RootShell active="home">
      <FormPanel title="Preferencias de cuenta" subtitle="Gestiona privacidad, idioma, reproduccion y notificaciones." button="Guardar preferencias">
        <Tabs><FilterChip $active>Cuenta</FilterChip><FilterChip>Privacidad</FilterChip><FilterChip>Apariencia</FilterChip><FilterChip>Reproduccion</FilterChip></Tabs>
        <Label>Tema</Label><Select defaultValue="Oscuro"><option>Oscuro</option><option>Claro</option></Select>
        <Label>Idioma</Label><Select defaultValue="Espanol"><option>Espanol</option><option>English</option></Select>
        <ToggleLine><span>Reproduccion automatica</span><input type="checkbox" defaultChecked /></ToggleLine>
        <ToggleLine><span>Notificaciones por correo</span><input type="checkbox" defaultChecked /></ToggleLine>
        <ToggleLine><span>Mostrar contenido +18</span><input type="checkbox" /></ToggleLine>
      </FormPanel>
    </RootShell>
  );
}

export function ChangePasswordPage() {
  return (
    <RootShell active="home">
      <FormPanel title="Cambiar contrasena" subtitle="Usa una clave fuerte y distinta a tus claves anteriores." button="Actualizar contrasena">
        <Label>Contrasena actual</Label><Field><FiLock /><input type="password" defaultValue="12345678" /></Field>
        <Label>Nueva contrasena</Label><Field><FiLock /><input type="password" defaultValue="rootblend2026" /></Field>
        <Label>Confirmar nueva contrasena</Label><Field><FiLock /><input type="password" defaultValue="rootblend2026" /></Field>
      </FormPanel>
    </RootShell>
  );
}

export function NotificationsPage() {
  return (
    <RootShell active="home">
      <PageHeading><Eyebrow>Centro personal</Eyebrow><h1>Notificaciones</h1><p>Todo lo que pasa en tus canales seguidos.</p></PageHeading>
      <Panel>
        {notifications.map((item) => (
          <NotificationRow key={item.title} $accent={item.accent}>
            <FiBell />
            <div><strong>{item.title}</strong><small>{item.meta}</small></div>
            <span />
          </NotificationRow>
        ))}
      </Panel>
    </RootShell>
  );
}

export function SubscriptionsPage() {
  const [items, setItems] = useState(() => streams.slice(1, 4));
  const [pendingCancel, setPendingCancel] = useState<StreamItem | null>(null);

  return (
    <RootShell active="home">
      <PageHeading><Eyebrow>Comunidad</Eyebrow><h1>Suscripciones</h1><p>Administra los canales suscritos, beneficios y cancelaciones demo.</p></PageHeading>
      <Panel>
        <PanelHeader><strong>Canales suscritos</strong><Link to="/following">Ver seguidos</Link></PanelHeader>
        {items.map((stream) => (
          <NotificationRow key={stream.id} $accent="#a855f7">
            <Avatar>{stream.avatar}</Avatar>
            <div>
              <strong>{stream.channel}</strong>
              <small>Plan comunidad - vence el 30/06/2026</small>
            </div>
            <ButtonRow>
              <GhostLink to={`/channels/${stream.id}`}>Ver canal</GhostLink>
              <DangerButton type="button" onClick={() => setPendingCancel(stream)}>Cancelar</DangerButton>
            </ButtonRow>
          </NotificationRow>
        ))}
      </Panel>
      {pendingCancel && (
        <DialogCard>
          <FiAlertTriangle size={34} />
          <h2>Cancelar suscripcion</h2>
          <p>Se cancelara la suscripcion demo a {pendingCancel.channel}. El acceso se conserva hasta el vencimiento.</p>
          <ButtonRow>
            <GhostButton type="button" onClick={() => setPendingCancel(null)}>Volver</GhostButton>
            <DangerButton
              type="button"
              onClick={() => {
                setItems((current) => current.filter((stream) => stream.id !== pendingCancel.id));
                setPendingCancel(null);
              }}
            >
              Confirmar
            </DangerButton>
          </ButtonRow>
        </DialogCard>
      )}
    </RootShell>
  );
}

export function FollowingPage() {
  const [items, setItems] = useState(() => streams.slice(0, 6));

  return (
    <RootShell active="home">
      <PageHeading><Eyebrow>Comunidad</Eyebrow><h1>Canales seguidos</h1><p>Vista separada para administrar solo los canales que sigues.</p></PageHeading>
      <Panel>
        <PanelHeader><strong>Siguiendo ahora</strong><Link to="/subscriptions">Ver suscripciones</Link></PanelHeader>
        {items.map((stream) => (
          <NotificationRow key={stream.id} $accent="#00e5ff">
            <Avatar>{stream.avatar}</Avatar>
            <div><strong>{stream.channel}</strong><small>{stream.category} - {stream.viewers} espectadores</small></div>
            <ButtonRow>
              <GhostLink to={`/channels/${stream.id}`}>Ver canal</GhostLink>
              <GhostButton type="button" onClick={() => setItems((current) => current.filter((item) => item.id !== stream.id))}>
                Dejar de seguir
              </GhostButton>
            </ButtonRow>
          </NotificationRow>
        ))}
      </Panel>
    </RootShell>
  );
}

export function CreatorActivatePage() {
  const navigate = useNavigate();
  const existingRole = getCreatorRole();
  const [role, setRole] = useState<CreatorRole>(existingRole || "streamer");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (existingRole) {
      navigate(existingRole === "streamer" ? "/creator/streamer" : "/creator/podcaster");
      return;
    }

    setCreatorRole(role);
    navigate(role === "streamer" ? "/creator/streamer" : "/creator/podcaster");
  }

  function resetDemoRole() {
    localStorage.removeItem(CREATOR_ROLE_KEY);
    window.dispatchEvent(new Event("creator-role-changed"));
    setRole("streamer");
  }

  return (
    <RootShell active="creator">
      {existingRole && (
        <AlertPanel>
          <FiLock />
          <div>
            <strong>Ya tienes un canal activo como {existingRole}</strong>
            <p>Una cuenta solo puede ser streamer o podcaster. El panel contrario se redirige al rol activo.</p>
          </div>
          <PrimaryLink to={existingRole === "streamer" ? "/creator/streamer" : "/creator/podcaster"}>
            Ir a mi panel
          </PrimaryLink>
          <GhostButton type="button" onClick={resetDemoRole}>Reiniciar demo</GhostButton>
        </AlertPanel>
      )}
      <FormPanel
        title="Activa tu canal de creador"
        subtitle="Escoge un solo tipo de canal: streamer o podcaster."
        button={existingRole ? "Ir al panel activo" : "Continuar"}
        onSubmit={submit}
      >
        <ProgressSteps><span>Informacion</span><span>Tipo de canal</span><span>Listo</span></ProgressSteps>
        <Label>Nombre del canal</Label><Field><FiRadio /><input defaultValue="NeoPlayer" disabled={Boolean(existingRole)} /></Field>
        <Label>URL personalizada</Label><Field><FiLinkIcon /> <input defaultValue="rootblend/neoplayer" disabled={Boolean(existingRole)} /></Field>
        <Label>Descripcion del canal</Label><TextArea defaultValue="Streams de juegos, tecnologia y charlas epicas." disabled={Boolean(existingRole)} />
        <ChoiceGrid>
          <ChoiceButton type="button" $active={role === "streamer"} disabled={Boolean(existingRole)} onClick={() => setRole("streamer")}><FiRadio /> Streamer</ChoiceButton>
          <ChoiceButton type="button" $active={role === "podcaster"} disabled={Boolean(existingRole)} onClick={() => setRole("podcaster")}><FiMic /> Podcaster</ChoiceButton>
        </ChoiceGrid>
      </FormPanel>
    </RootShell>
  );
}

function FiLinkIcon() {
  return <FiArrowRight />;
}

export function CreatorDashboardPage() {
  const role = getCreatorRole() || "streamer";
  return <Navigate to={role === "podcaster" ? "/creator/podcaster" : "/creator/streamer"} replace />;
}

export function StatsRedirectPage() {
  const role = getCreatorRole() || "streamer";
  return <Navigate to={role === "podcaster" ? "/creator/podcaster/stats" : "/creator/streamer/stats"} replace />;
}

export function StreamerDashboardPage() {
  return (
    <CreatorScreen title="Panel del streamer" subtitle="Gestiona directos, canal, momentos y estadisticas." image={brandAssets.streamerPanel}>
      <MetricGrid>{stats.map((item) => <StatCard key={item.label} {...item} />)}</MetricGrid>
      <QuickActions>
        <PrimaryLink to="/creator/streamer/control"><FiRadio /> Iniciar transmision</PrimaryLink>
        <GhostLink to="/creator/streamer/create-stream"><FiPlus /> Crear stream</GhostLink>
        <GhostLink to="/creator/streamer/highlights"><FiStar /> Momentos</GhostLink>
        <GhostLink to="/creator/streamer/stats"><FiActivity /> Estadisticas</GhostLink>
        <GhostLink to="/moderation/moderators"><FiShield /> Moderadores</GhostLink>
      </QuickActions>
    </CreatorScreen>
  );
}

export function CreateStreamPage() {
  return (
    <CreatorForm title="Crear / configurar stream" subtitle="Define titulo, categoria, etiquetas y calidad." button="Guardar configuracion">
      <Label>Titulo del stream</Label><Field><FiRadio /><input defaultValue="Rankeando en Valorant con la squad" /></Field>
      <Label>Categoria</Label><Select defaultValue="VALORANT"><option>VALORANT</option><option>Just Chatting</option><option>Musica</option></Select>
      <Label>Etiquetas</Label><TagRow><MetaTag>FPS</MetaTag><MetaTag>Competitivo</MetaTag><MetaTag>Espanol</MetaTag></TagRow>
      <Label>Descripcion</Label><TextArea defaultValue="Directo competitivo rankeando y pasando un buen rato con la comunidad." />
      <Label>Calidad</Label><Select defaultValue="1080p"><option>1080p recomendado</option><option>720p</option></Select>
    </CreatorForm>
  );
}

export function LiveControlPage() {
  const [live, setLive] = useState(false);

  return (
    <CreatorScreen title="Control de transmision" subtitle={live ? "El stream esta al aire." : "Configura tu stream y presiona iniciar."} image={brandAssets.streamControl}>
      <AlertPanel>
        {live ? <FiCheckCircle /> : <FiAlertTriangle />}
        <div><strong>{live ? "Estas en vivo" : "Estas offline"}</strong><p>{live ? "El chat y las estadisticas estan activos." : "Configura el stream antes de iniciar."}</p></div>
      </AlertPanel>
      <MetricGrid>
        <StatCard label="Espectadores" value={live ? "1.2K" : "0"} trend="Ahora" />
        <StatCard label="Duracion" value={live ? "00:21:43" : "00:00:00"} trend="Directo" />
        <StatCard label="Seguidores en vivo" value={live ? "19" : "0"} trend="+ hoy" />
      </MetricGrid>
      <ButtonRow>
        <PrimaryButton type="button" onClick={() => setLive(true)}>Iniciar transmision</PrimaryButton>
        <DangerButton type="button" onClick={() => setLive(false)}>Finalizar stream</DangerButton>
      </ButtonRow>
    </CreatorScreen>
  );
}

export function EditChannelPage() {
  return (
    <CreatorForm title="Editar informacion del canal" subtitle="Ajusta identidad publica, banner y redes sociales." button="Guardar cambios">
      <ChannelHero $image={brandAssets.channelView}><Avatar $large>NP</Avatar><div><h2>NeoPlayer</h2><p>Game. Stream. Repeat.</p></div></ChannelHero>
      <Label>Nombre del canal</Label><Field><FiUser /><input defaultValue="NeoPlayer" /></Field>
      <Label>Biografia</Label><TextArea defaultValue="Streams de juegos, tecnologia y charlas epicas." />
      <Label>URL personalizada</Label><Field><FiArrowRight /><input defaultValue="rootblend/neoplayer" /></Field>
    </CreatorForm>
  );
}

export function StreamStatsPage() {
  return (
    <CreatorScreen title="Estadisticas de stream" subtitle="Resumen de audiencia, chat, streams e ingresos." image={brandAssets.streamerPanel}>
      <MetricGrid>{stats.map((item) => <StatCard key={item.label} {...item} />)}</MetricGrid>
      <ChartPanel><span /></ChartPanel>
      <Section title="Streams recientes"><CardGrid>{streams.slice(0, 3).map((stream) => <StreamCard key={stream.id} stream={stream} />)}</CardGrid></Section>
    </CreatorScreen>
  );
}

export function HighlightsPage() {
  return (
    <CreatorScreen title="Momentos destacados" subtitle="Clips importantes del canal listos para publicar o editar." image={brandAssets.channelView}>
      <ButtonRow><PrimaryLink to="/creator/streamer/highlights/new"><FiUpload /> Subir nuevo</PrimaryLink></ButtonRow>
      <PodcastGrid>{streams.slice(0, 4).map((stream) => <PodcastTile key={stream.id} to="/creator/streamer/highlights/1/edit"><PodcastCover $image={stream.image}><FiPlay /></PodcastCover><div><CardTitle>{stream.title}</CardTitle><Muted>1.2K vistas</Muted></div><FiEdit3 /></PodcastTile>)}</PodcastGrid>
    </CreatorScreen>
  );
}

export function HighlightUploadPage() {
  return <UploadForm title="Subir momento destacado" subtitle="Comparte los mejores momentos de tu stream." />;
}

export function HighlightEditPage() {
  return <UploadForm title="Editar / eliminar momento" subtitle="Actualiza el clip o eliminalo si ya no debe mostrarse." danger />;
}

function UploadForm({ title, subtitle, danger = false }: { title: string; subtitle: string; danger?: boolean }) {
  return (
    <CreatorForm title={title} subtitle={subtitle} button="Guardar cambios">
      <UploadZone><FiUpload /><strong>Arrastra y suelta tu video aqui</strong><small>MP4, MOV, WebM hasta 500MB</small></UploadZone>
      <Label>Titulo</Label><Field><FiEdit3 /><input defaultValue="Clutch epico 1v4" /></Field>
      <Label>Descripcion</Label><TextArea defaultValue="Una de las mejores jugadas del directo." />
      {danger && <DangerButton type="button"><FiTrash2 /> Eliminar</DangerButton>}
    </CreatorForm>
  );
}

export function PodcasterDashboardPage() {
  return (
    <CreatorScreen title="Panel del podcaster" subtitle="Gestiona podcasts, episodios, comentarios y monetizacion." image={brandAssets.podcasterPanel}>
      <MetricGrid>
        <StatCard label="Podcasts" value="3" trend="+1" />
        <StatCard label="Episodios" value="24" trend="+2" />
        <StatCard label="Reproducciones" value="12.4K" trend="+23.5%" />
        <StatCard label="Duracion promedio" value="48m 32s" trend="+6%" />
      </MetricGrid>
      <QuickActions>
        <PrimaryLink to="/creator/podcaster/create-podcast">
          <FiPlus /> Crear podcast
        </PrimaryLink>

        <GhostLink to="/creator/podcaster/episodes/new">
          <FiUpload /> Subir episodio
        </GhostLink>

        <GhostLink to="/creator/podcaster/episodes">
          <FiHeadphones /> Episodios
        </GhostLink>

        <GhostLink to="/creator/podcaster/stats">
          <FiActivity /> Estadisticas
        </GhostLink>

        <GhostLink to="/creator/podcaster/history">
          <FiClock /> Historial
        </GhostLink>
      </QuickActions>
    </CreatorScreen>
  );
}

export function CreatePodcastPage() {
  return (
    <CreatorForm title="Crear podcast" subtitle="Configura el nombre, descripcion y portada." button="Crear podcast">
      <Label>Nombre del podcast</Label><Field><FiMic /><input defaultValue="Hablemos de Tecnologia" /></Field>
      <Label>Descripcion</Label><TextArea defaultValue="Podcast de tecnologia, gadgets y futuro." />
      <Label>Categoria</Label><Select defaultValue="Tecnologia"><option>Tecnologia</option><option>Gaming</option><option>Negocios</option></Select>
      <UploadZone><FiUpload /><strong>Arrastra una imagen</strong><small>PNG o JPG</small></UploadZone>
    </CreatorForm>
  );
}

export function ManagePodcastPage() {
  return (
    <CreatorScreen title="Administrar podcast" subtitle="Informacion, episodios, configuracion y estado publico." image={brandAssets.podcasterPanel}>
      <InfoGrid>
        <Panel><PanelHeader><strong>Informacion</strong><Link to="/creator/podcaster/create-podcast">Editar</Link></PanelHeader><TwoCol><span>Nombre</span><strong>TechTalk</strong><span>Categoria</span><strong>Tecnologia</strong><span>Estado</span><strong>Publicado</strong></TwoCol></Panel>
        <Panel><PanelHeader><strong>Ultimos episodios</strong><Link to="/creator/podcaster/episodes">Ver todos</Link></PanelHeader>{firstPodcast().episodes.map((episode) => <EpisodeRow key={episode.id}><FiHeadphones /><span>{episode.title}</span><small>{episode.duration}</small></EpisodeRow>)}</Panel>
      </InfoGrid>
    </CreatorScreen>
  );
}

export function UploadEpisodePage() {
  return (
    <CreatorForm title="Subir episodio" subtitle="Carga el audio, completa metadatos y publica." button="Publicar episodio">
      <UploadZone><FiUpload /><strong>Arrastra tu archivo de audio aqui</strong><small>MP3, WAV, M4A</small></UploadZone>
      <Label>Titulo del episodio</Label><Field><FiHeadphones /><input defaultValue="El impacto de la IA en 2026" /></Field>
      <Label>Descripcion</Label><TextArea defaultValue="Descripcion breve del episodio." />
      <Label>Numero de episodio</Label><Field><FiFile /><input defaultValue="25" /></Field>
    </CreatorForm>
  );
}

export function EpisodesListPage() {
  return (
    <CreatorScreen title="Lista de episodios" subtitle="Filtra, edita y publica episodios del podcast." image={brandAssets.podcasterPanel}>
      <Panel>
        {firstPodcast().episodes.concat(firstPodcast().episodes).map((episode, index) => (
          <EpisodeRow key={`${episode.id}-${index}`}>
            <PodcastCover $image={brandAssets.podcastsView}><FiHeadphones /></PodcastCover>
            <span>{episode.title}</span>
            <small>{episode.plays}</small>
            <GhostLink to={`/creator/podcaster/episodes/${episode.id}/edit`}>Editar</GhostLink>
          </EpisodeRow>
        ))}
      </Panel>
    </CreatorScreen>
  );
}

export function PodcastStatsPage() {
  return (
    <CreatorScreen title="Estadisticas de podcast" subtitle="Reproducciones, audiencia, episodios y dispositivos." image={brandAssets.podcastStats}>
      <MetricGrid>
        <StatCard label="Reproducciones" value="12.4K" trend="+23.5%" />
        <StatCard label="Oyentes unicos" value="8.7K" trend="+21.1%" />
        <StatCard label="Episodios" value="24" trend="+2" />
        <StatCard label="Duracion promedio" value="48m 32s" trend="+6.2%" />
      </MetricGrid>
      <ChartPanel><span /></ChartPanel>
    </CreatorScreen>
  );
}

export function PodcastHistoryPage() {
  return (
    <CreatorScreen title="Historial del podcast" subtitle="Actividad reciente, comentarios y reproducciones por episodio." image={brandAssets.podcastStats}>
      <Panel>{notifications.map((item) => <NotificationRow key={item.title} $accent={item.accent}><FiClock /><div><strong>{item.title}</strong><small>{item.meta}</small></div></NotificationRow>)}</Panel>
    </CreatorScreen>
  );
}

export function EditEpisodePage() {
  return <UploadForm title="Editar episodio" subtitle="Actualiza portada, audio, titulo y descripcion." />;
}

export function DeleteEpisodePage() {
  return (
    <CreatorScreen title="Eliminar episodio" subtitle="Confirma antes de eliminar un contenido publicado." image={brandAssets.podcasterPanel}>
      <DialogCard>
        <DangerIcon><FiTrash2 /></DangerIcon>
        <h2>¿Eliminar este episodio?</h2>
        <p>Esta accion no se puede deshacer.</p>
        <ButtonRow><GhostLink to="/creator/podcaster/episodes">Cancelar</GhostLink><DangerButton type="button">Eliminar</DangerButton></ButtonRow>
      </DialogCard>
    </CreatorScreen>
  );
}

export function InteractionsPage() {
  return (
    <RootShell active="home">
      <PageHeading><Eyebrow>Comunidad</Eyebrow><h1>Centro de interacciones</h1><p>Seguimientos, suscripciones, menciones, comentarios y directos.</p></PageHeading>
      <InfoGrid>
        <Panel><PanelHeader><strong>Hoy</strong></PanelHeader>{notifications.map((item) => <NotificationRow key={item.title} $accent={item.accent}><FiBell /><div><strong>{item.title}</strong><small>{item.meta}</small></div><GhostButton type="button">Ver</GhostButton></NotificationRow>)}</Panel>
        <Panel><PanelHeader><strong>Configuracion rapida</strong></PanelHeader>{["Nuevos seguidores", "Nuevas suscripciones", "Comentarios", "Menciones", "Inicio de directos"].map((item) => <ToggleLine key={item}><span>{item}</span><input type="checkbox" defaultChecked /></ToggleLine>)}</Panel>
      </InfoGrid>
    </RootShell>
  );
}

function CreatorScreen({ title, subtitle, image, children }: { title: string; subtitle: string; image: string; children: ReactNode }) {
  return (
    <RootShell active="creator">
      <CreatorLayout>
        <CreatorNav />
        <CreatorMain>
          <ChannelHero $image={image}><Avatar $large>RB</Avatar><div><Eyebrow>ROOTBLEND Creator</Eyebrow><h1>{title}</h1><p>{subtitle}</p></div></ChannelHero>
          {children}
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}

function CreatorForm({ title, subtitle, button, children, onSubmit }: { title: string; subtitle: string; button: string; children: ReactNode; onSubmit?: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <RootShell active="creator">
      <FormPanel title={title} subtitle={subtitle} button={button} onSubmit={onSubmit}>{children}</FormPanel>
    </RootShell>
  );
}

function CreatorNav() {
  const links = [
    ["/creator/streamer", "Streamer"],
    ["/creator/streamer/control", "Control"],
    ["/creator/streamer/stats", "Estadisticas"],
    ["/creator/podcaster", "Podcaster"],
    ["/creator/podcaster/episodes", "Episodios"],
    ["/moderation", "Moderacion"],
  ];

  return (
    <CreatorSidebar>
      {links.map(([to, label]) => <SidebarLink key={to} to={to}><FiArrowRight /><span>{label}</span></SidebarLink>)}
    </CreatorSidebar>
  );
}

function FormPanel({ title, subtitle, button, children, onSubmit }: { title: string; subtitle: string; button: string; children: ReactNode; onSubmit?: (event: FormEvent<HTMLFormElement>) => void }) {
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(event);
    setSaved(true);
  }

  return (
    <FormCard onSubmit={submit}>
      <PageHeading><Eyebrow>Formulario</Eyebrow><h1>{title}</h1><p>{subtitle}</p></PageHeading>
      {children}
      {saved && <SuccessBox><FiCheckCircle /> Cambios guardados en el mock frontend.</SuccessBox>}
      <ButtonRow><GhostLink to="/">Cancelar</GhostLink><PrimaryButton type="submit"><FiSave /> {button}</PrimaryButton></ButtonRow>
    </FormCard>
  );
}

export function LoadingDemoPage() {
  return (
    <RootShell active="system">
      <PageHeading><Eyebrow>Estado global</Eyebrow><h1>Cargando contenido</h1><p>Skeleton para cuando el gateway aun esta respondiendo.</p></PageHeading>
      <SkeletonGrid>{Array.from({ length: 8 }, (_, index) => <SkeletonCard key={index} />)}</SkeletonGrid>
    </RootShell>
  );
}

export function NoStreamsPage() {
  return <StatePage icon={<FiRadio />} title="No hay streams en vivo" text="Parece que todos estan descansando. Vuelve mas tarde o explora podcasts." primary="/categories" primaryLabel="Explorar categorias" />;
}

export function EmptySearchPage() {
  return <StatePage icon={<FiSearch />} title="No encontramos resultados" text="Intenta con otras palabras clave o limpia los filtros." primary="/streams" primaryLabel="Limpiar busqueda" />;
}

export function ServiceDownPage() {
  return (
    <RootShell active="system">
      <AlertPanel><FiAlertTriangle /><div><strong>Algunas funciones no estan disponibles</strong><p>Tenemos problemas con estadisticas-service. El resto de la plataforma funciona con normalidad.</p></div></AlertPanel>
      <Section title="En vivo ahora"><CardGrid>{streams.slice(0, 3).map((stream) => <StreamCard key={stream.id} stream={stream} />)}</CardGrid></Section>
      <Section title="Podcasts"><PodcastGrid>{podcasts.slice(0, 3).map((podcast) => <PodcastCard key={podcast.id} podcast={podcast} />)}</PodcastGrid></Section>
    </RootShell>
  );
}

export function GatewayErrorPage() {
  return <StatePage icon={<FiWifiOff />} title="Ups! Algo salio mal" text="No pudimos conectar con el servicio en este momento. Codigo de error: 502 Bad Gateway." primary="/partial-unavailable" primaryLabel="Intentar de nuevo" secondary="/" secondaryLabel="Ir al inicio" />;
}

export function ConfirmDeletePage() {
  return (
    <RootShell active="system">
      <DialogCard>
        <DangerIcon><FiTrash2 /></DangerIcon>
        <h2>¿Eliminar este contenido?</h2>
        <p>Esta accion se puede usar para episodios, clips o mensajes.</p>
        <ButtonRow><GhostLink to="/">Cancelar</GhostLink><DangerButton type="button">Eliminar</DangerButton></ButtonRow>
      </DialogCard>
    </RootShell>
  );
}

export function InvalidFilePage() {
  return <StatePage icon={<FiFile />} title="Archivo no valido" text="El archivo que intentaste subir no cumple con los requisitos." primary="/creator/podcaster/episodes/new" primaryLabel="Entendido" />;
}

export function AccessRestrictedPage() {
  return <StatePage icon={<FiLock />} title="Acceso restringido" text="No tienes permisos para acceder a esta seccion. Debes ser creador o moderador." primary="/" primaryLabel="Ir al inicio" secondary="/creator/activate" secondaryLabel="Activar canal" />;
}

export function NotFoundPage() {
  return <StatePage icon={<strong>404</strong>} title="Pagina no encontrada" text="La pagina que buscas no existe o fue movida." primary="/" primaryLabel="Volver al inicio" secondary="/streams" secondaryLabel="Explorar contenido" />;
}

export function SystemStatusPage() {
  return (
    <RootShell active="system">
      <PageHeading><Eyebrow>Demo distribuida</Eyebrow><h1>Estado de los servicios</h1><p>Panel visual para demostrar resiliencia cuando un servicio cae.</p></PageHeading>
      <MetricGrid>
        <StatCard label="Servicios totales" value="8" trend="Monitoreados" />
        <StatCard label="Operativos" value="7" trend="OK" />
        <StatCard label="Degradados" value="1" trend="Parcial" />
        <StatCard label="Caidos" value="0" trend="Criticos" />
      </MetricGrid>
      <Panel>
        {serviceStatuses.map((service) => (
          <ServiceRow key={service.name}>
            <span>{service.name}</span>
            <small>{service.type}</small>
            <ServicePill $status={service.status}>{service.status}</ServicePill>
            <small>{service.latency}</small>
            <small>{service.lastCheck}</small>
          </ServiceRow>
        ))}
      </Panel>
      <ButtonRow><PrimaryLink to="/partial-unavailable"><FiAlertTriangle /> Simular servicio caido</PrimaryLink><GhostButton type="button"><FiRefreshCw /> Actualizar</GhostButton></ButtonRow>
    </RootShell>
  );
}

function StatePage({ icon, title, text, primary, primaryLabel, secondary, secondaryLabel }: { icon: ReactNode; title: string; text: string; primary: string; primaryLabel: string; secondary?: string; secondaryLabel?: string }) {
  return (
    <RootShell active="system">
      <StatePanel>
        <StateIcon>{icon}</StateIcon>
        <h1>{title}</h1>
        <p>{text}</p>
        <ButtonRow>
          <PrimaryLink to={primary}>{primaryLabel}</PrimaryLink>
          {secondary && secondaryLabel && <GhostLink to={secondary}>{secondaryLabel}</GhostLink>}
        </ButtonRow>
      </StatePanel>
    </RootShell>
  );
}

function EmptyPanel({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <StatePanel>
      <StateIcon>{icon}</StateIcon>
      <h2>{title}</h2>
      <p>{text}</p>
    </StatePanel>
  );
}

export function AssignModeratorPage() {
  return (
    <ModerationScreen title="Asignar moderador desde el chat" subtitle="Selecciona un usuario del chat y confirma permisos.">
      <ChatPanel />
      <DialogCard>
        <FiShield size={38} />
        <h2>¿Hacer moderador a este usuario?</h2>
        <p>GamerX podra eliminar mensajes, silenciar usuarios y mantener el orden.</p>
        <ButtonRow><GhostLink to="/moderation">Cancelar</GhostLink><PrimaryLink to="/moderation/assign/confirm">Confirmar</PrimaryLink></ButtonRow>
      </DialogCard>
    </ModerationScreen>
  );
}

export function ConfirmModeratorPage() {
  return <StatePage icon={<FiShield />} title="Confirmacion de asignacion" text="El usuario recibira permisos de moderador solo para este canal." primary="/moderation/assigned" primaryLabel="Confirmar" />;
}

export function ModeratorAssignedPage() {
  return <StatePage icon={<FiCheckCircle />} title="Moderador asignado" text="GamerX ahora puede ayudarte a gestionar el chat en vivo." primary="/moderation/moderators" primaryLabel="Ver moderadores" />;
}

export function ModeratorsListPage() {
  const [moderators, setModerators] = useState<string[]>(() => getModerators());
  const [newModerator, setNewModerator] = useState("NeoModerator");
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);
  const ownerMode = getCreatorRole() === "streamer";

  function addModerator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ownerMode) return;
    const cleanName = newModerator.trim();
    if (!cleanName) return;

    const next = Array.from(new Set([...moderators, cleanName]));
    setModerators(next);
    saveModerators(next);
    setNewModerator("");
  }

  function removeModerator(name: string) {
    const next = moderators.filter((moderator) => moderator !== name);
    setModerators(next);
    saveModerators(next);
  }

  return (
    <ModerationScreen title="Lista de moderadores" subtitle="Gestiona los moderadores de tu canal.">
      <Panel>
        {ownerMode ? (
          <ModeratorToolbar onSubmit={addModerator}>
            <Field>
              <FiUser />
              <input
                value={newModerator}
                onChange={(event) => setNewModerator(event.target.value)}
                placeholder="Nombre del usuario"
              />
            </Field>
            <PrimaryButton type="submit"><FiPlus /> Agregar moderador</PrimaryButton>
            <GhostLink to="/moderation/permissions">Ver permisos</GhostLink>
          </ModeratorToolbar>
        ) : (
          <AlertPanel>
            <FiLock />
            <div>
              <strong>Modo moderador</strong>
              <p>Puedes revisar la lista, pero solo el duenio streamer agrega o quita moderadores.</p>
            </div>
            <GhostLink to="/moderation/permissions">Ver permisos</GhostLink>
          </AlertPanel>
        )}

        <AlertPanel>
          <FiShield />
          <div>
            <strong>Moderacion por canal</strong>
            <p>Estos permisos aplican solo al canal Cyberpunk 2077 / PixelNate. Para otro canal, el duenio debe asignarlo de nuevo.</p>
          </div>
        </AlertPanel>

        {moderators.length === 0 ? (
          <EmptyPanel icon={<FiShield />} title="Sin moderadores" text="Agrega usuarios para ayudarte a ordenar el chat." />
        ) : (
          moderators.map((name) => (
            <NotificationRow key={name} $accent="#00e5ff">
              <Avatar>{name.slice(0, 2).toUpperCase()}</Avatar>
              <div>
                <strong>{name}</strong>
                <small>Activo - Canal Cyberpunk 2077</small>
              </div>
              {ownerMode ? (
                <DangerButton type="button" onClick={() => setPendingRemove(name)}>
                  Quitar rol
                </DangerButton>
              ) : (
                <ServicePill $status="Operativo">Activo</ServicePill>
              )}
            </NotificationRow>
          ))
        )}
      </Panel>
      {pendingRemove && (
        <DialogCard>
          <FiAlertTriangle size={34} />
          <h2>Quitar moderador</h2>
          <p>{pendingRemove} perdera permisos de moderacion solo en este canal.</p>
          <ButtonRow>
            <GhostButton type="button" onClick={() => setPendingRemove(null)}>Cancelar</GhostButton>
            <DangerButton
              type="button"
              onClick={() => {
                removeModerator(pendingRemove);
                setPendingRemove(null);
              }}
            >
              Quitar rol
            </DangerButton>
          </ButtonRow>
        </DialogCard>
      )}
    </ModerationScreen>
  );
}

export function DeleteMessagePage() {
  return (
    <ModerationScreen title="Eliminar mensaje" subtitle="Accion rapida para limpiar el chat sin tumbar el stream.">
      <ChatPanel />
      <AlertPanel><FiCheckCircle /><div><strong>Mensaje eliminado</strong><p>El mensaje se oculto del chat.</p></div></AlertPanel>
    </ModerationScreen>
  );
}

export function SilenceUserPage() {
  return (
    <ModerationScreen title="Silenciar usuario" subtitle="Impide temporalmente que escriba en el chat.">
      <FormPanel title="Silenciar a un usuario" subtitle="Configura duracion y motivo." button="Silenciar usuario">
        <Label>Usuario</Label><Field><FiUser /><input defaultValue="ToxicUser" /></Field>
        <ChoiceGrid>{["5 min", "10 min", "1 h", "24 h"].map((item, index) => <ChoiceButton type="button" key={item} $active={index === 1}>{item}</ChoiceButton>)}</ChoiceGrid>
        <Label>Motivo</Label><TextArea defaultValue="Lenguaje ofensivo / faltas de respeto" />
      </FormPanel>
    </ModerationScreen>
  );
}

export function BlockUserPage() {
  return (
    <ModerationScreen title="Bloquear usuario del chat" subtitle="Bloqueo permanente para usuarios toxicos.">
      <DialogCard>
        <DangerIcon><FiAlertTriangle /></DangerIcon>
        <h2>¿Bloquear a este usuario?</h2>
        <p>El usuario no podra escribir en el chat ni ver ciertas acciones del canal.</p>
        <ButtonRow><GhostLink to="/moderation">Cancelar</GhostLink><DangerButton type="button">Bloquear usuario</DangerButton></ButtonRow>
      </DialogCard>
    </ModerationScreen>
  );
}

export function SanctionsPage() {
  return (
    <ModerationScreen title="Usuarios sancionados" subtitle="Silenciados, bloqueados y sanciones activas.">
      <Panel>
        <Table>
          <thead><tr><th>Usuario</th><th>Tipo</th><th>Motivo</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {moderationRows.map((row) => (
              <tr key={row.user}><td>{row.user}</td><td>{row.type}</td><td>{row.reason}</td><td>{row.date}</td><td>{row.status}</td><td><GhostButton type="button">Levantar</GhostButton></td></tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    </ModerationScreen>
  );
}

export function ModeratorDashboardPage() {
  return (
    <ModerationScreen title="Panel del moderador" subtitle="Acciones rapidas, incidentes recientes y salud del chat.">
      <QuickActions>
        <PrimaryLink to="/moderation/delete-message"><FiTrash2 /> Eliminar mensaje</PrimaryLink>
        <GhostLink to="/moderation/silence"><FiVolume2 /> Silenciar usuario</GhostLink>
        <DangerLink to="/moderation/block"><FiXCircle /> Bloquear usuario</DangerLink>
        <GhostLink to="/moderation/moderators"><FiUsers /> Moderadores</GhostLink>
        <GhostLink to="/moderation/sanctions"><FiShield /> Sanciones</GhostLink>
        <GhostLink to="/moderation/permissions"><FiLock /> Permisos</GhostLink>
      </QuickActions>
      <MetricGrid>
        <StatCard label="Mensajes reportados" value="12" trend="Ultimas 24h" />
        <StatCard label="Usuarios silenciados" value="7" trend="Actualmente" />
        <StatCard label="Bloqueados" value="3" trend="Total" />
      </MetricGrid>
      <ChatPanel />
    </ModerationScreen>
  );
}

export function ModeratorPermissionsPage() {
  return (
    <ModerationScreen title="Permisos y funciones del moderador" subtitle="Resumen claro de lo que puede y no puede hacer.">
      <InfoGrid>
        <Panel><PanelHeader><strong>Lo que si pueden hacer</strong></PanelHeader>{["Eliminar mensajes inapropiados", "Silenciar usuarios", "Bloquear usuarios toxicos", "Gestionar orden del chat"].map((item) => <PermissionLine key={item}><FiCheckCircle /> {item}</PermissionLine>)}</Panel>
        <Panel><PanelHeader><strong>Lo que no pueden hacer</strong></PanelHeader>{["Iniciar directos", "Finalizar directos", "Editar canal", "Ver estadisticas privadas", "Administrar podcast", "Cambiar propietario"].map((item) => <PermissionLine key={item}><FiXCircle /> {item}</PermissionLine>)}</Panel>
      </InfoGrid>
    </ModerationScreen>
  );
}

function ModerationScreen({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <RootShell active="moderation">
      <PageHeading><Eyebrow>Moderacion</Eyebrow><h1>{title}</h1><p>{subtitle}</p></PageHeading>
      {children}
    </RootShell>
  );
}

const AppFrame = styled.div`
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.98), rgba(3, 7, 18, 1)),
    url(${brandAssets.fondo});
  background-size: cover;
  color: #f8fbff;
`;

const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  height: 64px;
  display: grid;
  grid-template-columns: 250px minmax(220px, 560px) auto;
  align-items: center;
  gap: 22px;
  padding: 0 22px;
  background: rgba(3, 7, 18, 0.94);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  backdrop-filter: blur(18px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr auto;
  }
`;

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 950;
  font-size: 18px;

  img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  span {
    color: #00e5ff;
  }
`;

const SearchForm = styled.form`
  height: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.82);
  color: rgba(255, 255, 255, 0.54);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #fff;
    font-size: 13px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const TopPopoverWrap = styled.div`
  position: relative;
`;

const DropdownPanel = styled.div<{ $wide?: boolean }>`
  position: absolute;
  top: 46px;
  right: 0;
  z-index: 80;
  width: ${({ $wide }) => ($wide ? "360px" : "310px")};
  max-width: calc(100vw - 24px);
  padding: 12px;
  border-radius: 12px;
  background: rgba(7, 12, 27, 0.98);
  border: 1px solid rgba(0, 229, 255, 0.22);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.44);
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;

  a {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 850;
  }
`;

const DropdownItem = styled(Link)`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  min-height: 58px;
  padding: 9px;
  border-radius: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: #fff;
    font-size: 13px;
  }

  small {
    margin-top: 3px;
    color: rgba(226, 232, 240, 0.58);
    font-size: 12px;
  }
`;

const NotificationMark = styled.span<{ $accent: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $accent }) => $accent};
  box-shadow: 0 0 18px ${({ $accent }) => $accent};
`;

const DropdownMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 10px;
  border-radius: 9px;
  color: rgba(226, 232, 240, 0.86);
  font-size: 13px;
  font-weight: 850;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }
`;

const UnreadDot = styled.span`
  position: absolute;
  top: 6px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a855f7;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.9);
`;

const ShellGrid = styled.div<{ $hasRightPanel: boolean }>`
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) ${({ $hasRightPanel }) => ($hasRightPanel ? "300px" : "0")};
  min-height: calc(100vh - 64px);

  @media (max-width: 1180px) {
    grid-template-columns: 86px minmax(0, 1fr);

    > aside:last-child {
      display: none;
    }
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  padding: 18px 14px;
  background: rgba(4, 10, 24, 0.9);
  border-right: 1px solid rgba(148, 163, 184, 0.11);
  overflow-y: auto;

  @media (max-width: 760px) {
    display: none;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 24px;
`;

const SidebarTitle = styled.h3`
  margin: 0 0 12px;
  color: rgba(226, 232, 240, 0.62);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0;
`;

const SidebarLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  margin-bottom: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  color: ${({ $active }) => ($active ? "#04111f" : "rgba(226, 232, 240, 0.78)")};
  background: ${({ $active }) => ($active ? "linear-gradient(135deg, #00e5ff, #22c55e)" : "transparent")};
  font-size: 13px;
  font-weight: 800;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
  }

  @media (max-width: 1180px) {
    span {
      display: none;
    }
  }
`;

const ChannelMini = styled(Link)`
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 1180px) {
    grid-template-columns: 34px;

    div,
    span {
      display: none;
    }
  }
`;

const MiniText = styled.div`
  min-width: 0;

  strong,
  small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    font-size: 13px;
  }

  small {
    color: rgba(226, 232, 240, 0.58);
    font-size: 11px;
  }
`;

const ViewerDot = styled.span`
  color: #00e5ff;
  font-size: 11px;
  font-weight: 800;
`;

const MainArea = styled.main`
  padding: 24px;
  min-width: 0;

  @media (max-width: 760px) {
    padding: 16px;
  }
`;

const RightRail = styled.aside`
  border-left: 1px solid rgba(148, 163, 184, 0.1);
  background: rgba(4, 10, 24, 0.7);
  padding: 16px;
`;

const HeroGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.3fr);
  gap: 28px;
  align-items: center;
  margin-bottom: 26px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const HeroCopy = styled.div`
  max-width: 620px;

  h1 {
    margin: 0;
    font-size: clamp(36px, 6vw, 64px);
    line-height: 0.98;
    font-weight: 950;

    span {
      color: #00e5ff;
      display: block;
    }
  }

  p {
    margin: 18px 0 0;
    color: rgba(226, 232, 240, 0.72);
    line-height: 1.6;
  }
`;

const Eyebrow = styled.span`
  display: inline-flex;
  margin-bottom: 10px;
  color: #00e5ff;
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0;
`;

const HeroMedia = styled.div<{ $image: string }>`
  position: relative;
  min-height: 300px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 229, 255, 0.32);
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.1), rgba(2, 6, 23, 0.78)), url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 45px rgba(124, 58, 237, 0.28);
`;

const FeaturedFlag = styled.span`
  position: absolute;
  top: 18px;
  left: 18px;
  padding: 7px 10px;
  border-radius: 8px;
  color: #021016;
  background: #00e5ff;
  font-size: 11px;
  font-weight: 950;
`;

const HeroOverlay = styled.div`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;

  h3 {
    margin: 8px 0 4px;
    font-size: clamp(22px, 3vw, 34px);
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.76);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 18px;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  color: #03111c;
  background: linear-gradient(135deg, #00e5ff, #22c55e);
  font-weight: 950;
  font-size: 13px;
  cursor: pointer;
`;

const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 229, 255, 0.28);
  color: #e8fbff;
  background: rgba(15, 23, 42, 0.7);
  font-weight: 850;
  font-size: 13px;
`;

const DangerLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fecdd3;
  background: rgba(127, 29, 29, 0.24);
  font-weight: 850;
  font-size: 13px;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  color: #03111c;
  background: linear-gradient(135deg, #00e5ff, #22c55e);
  font-weight: 950;
  font-size: 13px;
  cursor: pointer;
`;

const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 229, 255, 0.28);
  color: #e8fbff;
  background: rgba(15, 23, 42, 0.7);
  font-weight: 850;
  font-size: 13px;
  cursor: pointer;
`;

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fecdd3;
  background: rgba(127, 29, 29, 0.24);
  font-weight: 850;
  font-size: 13px;
  cursor: pointer;
`;

const IconRound = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.16);
  cursor: pointer;
`;

const UserPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 10px 0 4px;
  border-radius: 999px;
  color: #fff;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.16);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
`;

const Avatar = styled.div<{ $large?: boolean; $small?: boolean }>`
  width: ${({ $large, $small }) => ($large ? "82px" : $small ? "26px" : "34px")};
  height: ${({ $large, $small }) => ($large ? "82px" : $small ? "26px" : "34px")};
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: #04111f;
  background: linear-gradient(135deg, #00e5ff, #8b5cf6);
  font-size: ${({ $large, $small }) => ($large ? "25px" : $small ? "10px" : "12px")};
  font-weight: 950;
  border: 2px solid rgba(255, 255, 255, 0.18);
`;

const PromoPanel = styled.div`
  padding: 16px;
  border-radius: 12px;
  background:
    linear-gradient(135deg, rgba(0, 229, 255, 0.16), rgba(124, 58, 237, 0.13)),
    rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(0, 229, 255, 0.22);

  p {
    color: rgba(226, 232, 240, 0.68);
    font-size: 12px;
    line-height: 1.5;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 24px;
`;

const FilterChip = styled.button<{ $active?: boolean }>`
  min-height: 32px;
  border: 0;
  border-radius: 999px;
  padding: 0 13px;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "#021016" : "rgba(226, 232, 240, 0.82)")};
  background: ${({ $active }) => ($active ? "#00e5ff" : "rgba(148, 163, 184, 0.12)")};
  font-size: 12px;
  font-weight: 850;
`;

const SectionBlock = styled.section`
  margin: 0 0 30px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;

  h2 {
    margin: 0;
    font-size: 22px;
  }
`;

const TextLink = styled(Link)`
  color: #00e5ff;
  font-size: 13px;
  font-weight: 900;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
`;

const ContentCard = styled(Link)`
  overflow: hidden;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(148, 163, 184, 0.12);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);

  &:hover {
    border-color: rgba(0, 229, 255, 0.38);
    transform: translateY(-2px);
  }
`;

const Thumb = styled.div<{ $image: string }>`
  position: relative;
  aspect-ratio: 16 / 9;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.05), rgba(2, 6, 23, 0.45)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  padding: 4px 7px;
  color: #fff;
  background: #ef123f;
  font-size: 10px;
  font-weight: 950;
`;

const ViewBadge = styled.span`
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.76);
  color: #f8fbff;
  font-size: 11px;
  font-weight: 850;
`;

const CardBody = styled.div`
  padding: 10px;
`;

const CardTitle = styled.h3`
  margin: 0 0 7px;
  color: #fff;
  font-size: 14px;
  line-height: 1.25;
`;

const MetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: rgba(226, 232, 240, 0.82);
  font-size: 12px;
  font-weight: 800;
`;

const VerifiedDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00e5ff;
`;

const Muted = styled.p`
  margin: 4px 0 0;
  color: rgba(226, 232, 240, 0.62);
  font-size: 12px;
`;

const PodcastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
`;

const PodcastTile = styled(Link)`
  display: grid;
  grid-template-columns: 68px 1fr auto;
  align-items: center;
  gap: 12px;
  min-height: 86px;
  padding: 10px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.86), rgba(88, 28, 135, 0.24));
  border: 1px solid rgba(148, 163, 184, 0.12);
`;

const PodcastCover = styled.div<{ $image: string }>`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.42)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  color: #fff;
`;

const RoundButton = styled.button`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  color: #fff;
  background: rgba(15, 23, 42, 0.78);
  cursor: pointer;
`;

const FeatureStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin: 26px 0 8px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 12px;
  align-items: center;
  padding: 15px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.11);

  svg {
    grid-row: span 2;
    width: 34px;
    height: 34px;
    padding: 8px;
    border-radius: 50%;
    color: #00e5ff;
    background: rgba(0, 229, 255, 0.12);
  }

  span {
    color: #00e5ff;
    font-weight: 950;
  }

  small {
    color: rgba(226, 232, 240, 0.62);
  }
`;

const PageHeading = styled.div`
  margin: 0 0 22px;

  h1 {
    margin: 0 0 8px;
    font-size: clamp(30px, 4vw, 46px);
    line-height: 1.04;
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.66);
    line-height: 1.6;
  }
`;

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const InputWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.74);

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #fff;
    background: transparent;
  }
`;

const Select = styled.select`
  min-height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  color: #fff;
  background: rgba(15, 23, 42, 0.92);
  padding: 0 12px;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 22px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 14px;
  margin-bottom: 30px;
`;

const CategoryCard = styled(Link)<{ $image: string }>`
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.13);
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.82)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;

  span {
    font-size: 18px;
    font-weight: 950;
  }

  small {
    margin-top: 4px;
    color: rgba(226, 232, 240, 0.72);
  }
`;

const ChannelHero = styled.section<{ $image: string }>`
  min-height: 230px;
  display: flex;
  align-items: flex-end;
  gap: 18px;
  margin-bottom: 22px;
  padding: 22px;
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.86)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(0, 229, 255, 0.22);

  h1,
  h2,
  p {
    margin: 0;
  }

  p {
    margin-top: 6px;
    color: rgba(226, 232, 240, 0.74);
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  overflow-x: auto;
`;

const PlayerPanel = styled.section`
  margin-bottom: 20px;
`;

const VideoFrame = styled.div<{ $image: string }>`
  position: relative;
  min-height: 470px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.05), rgba(2, 6, 23, 0.26)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;

  > ${LiveBadge} {
    position: absolute;
    top: 14px;
    left: 14px;
  }

  @media (max-width: 900px) {
    min-height: 280px;
  }
`;

const VideoControls = styled.div`
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.72);
`;

const Progress = styled.div`
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.17);
  overflow: hidden;

  span {
    display: block;
    width: 42%;
    height: 100%;
    background: #00e5ff;
  }
`;

const StreamInfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InfoMain = styled.div`
  h1 {
    margin: 0 0 5px;
    font-size: 24px;
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.68);
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const MetaTag = styled.span`
  display: inline-flex;
  min-height: 27px;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  color: #dffaff;
  background: rgba(0, 229, 255, 0.12);
  border: 1px solid rgba(0, 229, 255, 0.16);
  font-size: 12px;
  font-weight: 850;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-bottom: 26px;
`;

const Panel = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.12);

  p {
    color: rgba(226, 232, 240, 0.68);
    line-height: 1.6;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  a {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 850;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px 16px;

  span {
    color: rgba(226, 232, 240, 0.6);
  }
`;

const ChatBox = styled.div`
  height: calc(100vh - 98px);
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);
`;

const HeaderActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  a {
    color: rgba(226, 232, 240, 0.74);
  }
`;

const ChatStatus = styled.div`
  margin: 0 12px 10px;
  padding: 9px 10px;
  border-radius: 9px;
  color: rgba(226, 232, 240, 0.76);
  background: rgba(0, 229, 255, 0.08);
  border: 1px solid rgba(0, 229, 255, 0.14);
  font-size: 12px;
  line-height: 1.4;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow: auto;
  padding: 12px;
`;

const ChatRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 26px 1fr 28px;
  gap: 8px;
  margin-bottom: 12px;
`;

const ChatBubble = styled.div`
  min-width: 0;

  p {
    margin: 3px 0 0;
    color: rgba(226, 232, 240, 0.84);
    font-size: 13px;
    line-height: 1.4;
  }
`;

const ChatName = styled.div<{ $color: string }>`
  display: flex;
  gap: 6px;
  align-items: center;
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 950;

  span {
    color: #04111f;
    background: #00e5ff;
    border-radius: 4px;
    padding: 1px 4px;
    font-size: 9px;
  }

  time {
    margin-left: auto;
    color: rgba(226, 232, 240, 0.42);
    font-weight: 600;
  }
`;

const ChatActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 8px;
  color: rgba(226, 232, 240, 0.72);
  background: rgba(2, 6, 23, 0.56);
  cursor: pointer;

  &:hover {
    color: #fff;
    border-color: rgba(0, 229, 255, 0.28);
  }
`;

const ChatActionMenu = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  z-index: 20;
  width: 210px;
  padding: 8px;
  border-radius: 10px;
  background: rgba(7, 12, 27, 0.98);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.4);

  button {
    width: 100%;
    min-height: 34px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 8px;
    color: rgba(226, 232, 240, 0.86);
    background: transparent;
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
    text-align: left;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
  }
`;

const ChatForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 38px;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);

  input {
    min-height: 36px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 8px;
    padding: 0 11px;
    color: #fff;
    background: rgba(2, 6, 23, 0.78);
    outline: 0;
  }

  button {
    border: 0;
    border-radius: 8px;
    color: #03111c;
    background: #8b5cf6;
  }
`;

const LoginNotice = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  color: rgba(226, 232, 240, 0.68);
  font-size: 13px;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SideListItem = styled(Link)`
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 9px;
  align-items: center;
  padding: 9px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);

  span {
    font-size: 13px;
    font-weight: 850;
  }

  small {
    color: #00e5ff;
    font-weight: 800;
  }
`;

const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  margin: 12px 0;
`;

const ServicePill = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  border-radius: 999px;
  padding: 0 10px;
  color: ${({ $status }) => ($status === "Operativo" ? "#86efac" : $status === "Degradado" ? "#fde68a" : "#fecdd3")};
  background: ${({ $status }) => ($status === "Operativo" ? "rgba(22, 163, 74, 0.14)" : $status === "Degradado" ? "rgba(202, 138, 4, 0.18)" : "rgba(220, 38, 38, 0.18)")};
  font-size: 12px;
  font-weight: 850;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
`;

const MetricCard = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);

  span,
  small {
    color: rgba(226, 232, 240, 0.64);
    font-size: 12px;
  }

  strong {
    display: block;
    margin: 6px 0 3px;
    font-size: 27px;
  }

  small {
    color: #22c55e;
    font-weight: 850;
  }
`;

const AudioBar = styled.div`
  position: sticky;
  bottom: 12px;
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(2, 6, 23, 0.92);
  border: 1px solid rgba(0, 229, 255, 0.22);
`;

const EpisodeRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  button {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 50%;
    color: #03111c;
    background: #00e5ff;
  }

  small {
    color: rgba(226, 232, 240, 0.62);
  }
`;

const AuthScreen = styled.main<{ $image: string }>`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.74), rgba(2, 6, 23, 0.94)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`;

const AuthCard = styled.form`
  width: min(440px, 100%);
  padding: 28px;
  border-radius: 14px;
  background: rgba(7, 12, 27, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
`;

const BrandBlock = styled.div`
  text-align: center;
  margin-bottom: 22px;

  img {
    width: 66px;
  }

  svg {
    width: 42px;
    height: 42px;
    color: #8b5cf6;
  }

  h1 {
    margin: 8px 0 4px;

    span {
      color: #00e5ff;
    }
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.64);
  }
`;

const Label = styled.label`
  display: block;
  margin: 12px 0 7px;
  color: rgba(226, 232, 240, 0.8);
  font-size: 12px;
  font-weight: 850;
`;

const Field = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 9px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.76);
  color: #00e5ff;

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #fff;
    background: transparent;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 98px;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  padding: 12px;
  color: #fff;
  background: rgba(15, 23, 42, 0.76);
  outline: 0;
`;

const FormLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 12px 0;
  color: rgba(226, 232, 240, 0.64);
  font-size: 12px;

  a {
    color: #c084fc;
  }
`;

const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 9px;
  margin: 12px 0;
`;

const ChoiceButton = styled.button<{ $active?: boolean }>`
  min-height: 48px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? "#8b5cf6" : "rgba(148, 163, 184, 0.14)")};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(226, 232, 240, 0.76)")};
  background: ${({ $active }) => ($active ? "rgba(124, 58, 237, 0.28)" : "rgba(15, 23, 42, 0.76)")};
  font-weight: 850;
  cursor: pointer;
`;

const SuccessBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  padding: 11px;
  border-radius: 9px;
  color: #86efac;
  background: rgba(22, 163, 74, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.24);
`;

const NarrowPanel = styled.div`
  width: min(460px, 100%);
  padding: 18px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;

  h1 {
    margin: 0;
  }

  p {
    margin: 4px 0 0;
    color: rgba(226, 232, 240, 0.62);
  }
`;

const MenuLine = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 9px;
  color: rgba(226, 232, 240, 0.84);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const NotificationRow = styled.div<{ $accent: string }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  > svg {
    color: ${({ $accent }) => $accent};
  }

  strong,
  small {
    display: block;
  }

  small {
    color: rgba(226, 232, 240, 0.58);
    margin-top: 4px;
  }
`;

const ProgressSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;

  span {
    padding: 9px;
    border-radius: 999px;
    text-align: center;
    color: #00e5ff;
    background: rgba(0, 229, 255, 0.1);
    font-size: 12px;
    font-weight: 850;
  }
`;

const CreatorLayout = styled.div`
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const CreatorSidebar = styled.aside`
  padding: 10px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.62);
  border: 1px solid rgba(148, 163, 184, 0.12);
  height: max-content;
`;

const CreatorMain = styled.div`
  min-width: 0;
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
`;

const ModeratorToolbar = styled.form`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const ChartPanel = styled.div`
  height: 260px;
  position: relative;
  margin-bottom: 22px;
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(139, 92, 246, 0.12), rgba(0, 229, 255, 0.06)),
    rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);

  span {
    position: absolute;
    left: 26px;
    right: 26px;
    bottom: 55px;
    height: 110px;
    border-radius: 50%;
    border-top: 4px solid #8b5cf6;
    filter: drop-shadow(0 0 14px rgba(139, 92, 246, 0.9));
  }
`;

const UploadZone = styled.div`
  min-height: 130px;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 5px;
  margin: 12px 0;
  border-radius: 12px;
  border: 1px dashed rgba(139, 92, 246, 0.8);
  color: #d8b4fe;
  background: rgba(88, 28, 135, 0.18);

  small {
    color: rgba(226, 232, 240, 0.58);
  }
`;

const FormCard = styled.form`
  width: min(760px, 100%);
  padding: 20px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);
`;

const ToggleLine = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  min-height: 44px;
  color: rgba(226, 232, 240, 0.82);
`;

const AlertPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  padding: 14px;
  border-radius: 12px;
  color: #fde68a;
  background: rgba(202, 138, 4, 0.12);
  border: 1px solid rgba(202, 138, 4, 0.26);

  p {
    margin: 4px 0 0;
    color: rgba(226, 232, 240, 0.7);
  }
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
`;

const SkeletonCard = styled.div`
  height: 190px;
  border-radius: 12px;
  background:
    linear-gradient(90deg, rgba(148, 163, 184, 0.08), rgba(148, 163, 184, 0.18), rgba(148, 163, 184, 0.08));
  background-size: 200% 100%;
  border: 1px solid rgba(148, 163, 184, 0.1);
  animation: shimmer 1.5s infinite linear;

  @keyframes shimmer {
    from { background-position: 0 0; }
    to { background-position: -200% 0; }
  }
`;

const StatePanel = styled.div`
  width: min(620px, 100%);
  margin: 60px auto;
  text-align: center;
  padding: 34px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.74);
  border: 1px solid rgba(148, 163, 184, 0.12);

  h1,
  h2 {
    margin: 12px 0 8px;
  }

  p {
    color: rgba(226, 232, 240, 0.68);
  }
`;

const StateIcon = styled.div`
  width: 96px;
  height: 96px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  color: #00e5ff;
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.2);

  svg {
    width: 44px;
    height: 44px;
  }

  strong {
    font-size: 36px;
  }
`;

const DialogCard = styled.div`
  width: min(480px, 100%);
  margin: 30px auto;
  text-align: center;
  padding: 24px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.14);

  p {
    color: rgba(226, 232, 240, 0.68);
  }
`;

const DangerIcon = styled.div`
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fecdd3;
  background: rgba(220, 38, 38, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.28);

  svg {
    width: 36px;
    height: 36px;
  }
`;

const ServiceRow = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.7fr 0.8fr 0.5fr 0.8fr;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  small {
    color: rgba(226, 232, 240, 0.62);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    text-align: left;
  }

  th {
    color: rgba(226, 232, 240, 0.62);
    font-size: 11px;
    text-transform: uppercase;
  }
`;

const PermissionLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
`;
