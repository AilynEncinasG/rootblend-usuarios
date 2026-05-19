import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiBell,
  FiCompass,
  FiEye,
  FiGrid,
  FiHeadphones,
  FiHome,
  FiLock,
  FiLogOut,
  FiRadio,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiShield,
  FiStar,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { brandAssets, notifications } from "../mock/rootblendMock";
import {
  clearAuthStorage,
  getStoredUser,
  isAuthenticated,
} from "../../modules/auth/utils/authStorage";
import { getMe } from "../../services/userService";
import {
  getActiveChannels as getBackendActiveChannels,
  getMyChannel,
  type Canal as BackendCanal,
} from "../../modules/streams/services/streamsService";
import {
  AppFrame,
  Avatar,
  BrandLink,
  ChannelMini,
  DropdownHeader,
  DropdownItem,
  DropdownMenuLink,
  DropdownMenuLoading,
  DropdownPanel,
  GhostLink,
  IconRound,
  MainArea,
  MiniText,
  NotificationMark,
  PrimaryLink,
  ProfileHeader,
  PromoPanel,
  SearchForm,
  ShellGrid,
  Sidebar,
  SidebarEmptyText,
  SidebarLink,
  SidebarSection,
  SidebarTitle,
  TopActions,
  Topbar,
  TopPopoverWrap,
  UnreadDot,
  UserPill,
  ViewerDot,
  RightRail,
} from "../styles/legacyStyled";

type ShellProps = {
  active?: string;
  children: ReactNode;
  rightPanel?: ReactNode;
};

type CreatorRole = "streamer" | "podcaster";

type ChannelCard = {
  id: string;
  name: string;
  subtitle: string;
  viewers: string;
  avatar: string;
  photo?: string | null;
};

type UserSnapshot = {
  label: string;
  photo: string;
};

const CREATOR_ROLE_KEY = "creator_role";

const pageLinks = [
  { label: "Inicio", to: "/", icon: FiHome, key: "home" },
  { label: "Explorar", to: "/streams", icon: FiCompass, key: "streams" },
  { label: "Categorias", to: "/categories", icon: FiGrid, key: "categories" },
  { label: "Podcasts", to: "/podcasts", icon: FiHeadphones, key: "podcasts" },
  { label: "Creador", to: "/creator/activate", icon: FiRadio, key: "creator" },
  { label: "Moderacion", to: "/moderation", icon: FiShield, key: "moderation" },
];

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

  const cleanValue = value.trim();

  return (
    cleanValue.startsWith("http://") ||
    cleanValue.startsWith("https://") ||
    cleanValue.startsWith("data:image/")
  );
}

function backendChannelToCard(channel: BackendCanal): ChannelCard {
  return {
    id: String(channel.id_canal),
    name: channel.nombre_canal,
    subtitle: channel.tipo_canal.nombre_tipo,
    viewers: "0",
    avatar: getInitials(channel.nombre_canal),
    photo: channel.foto_canal ?? null,
  };
}

function ChannelAvatarImage({ channel }: { channel: ChannelCard }) {
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

function getCreatorRole(): CreatorRole | null {
  const role = localStorage.getItem(CREATOR_ROLE_KEY);

  if (role === "streamer" || role === "podcaster") {
    return role;
  }

  return null;
}

function readStoredUserSnapshot(): UserSnapshot {
  const stored = getStoredUser() as {
    nombre_visible?: string;
    correo?: string;
    nombre?: string;
    username?: string;
    email?: string;
    foto_perfil?: string | null;
    fotoPerfil?: string | null;
    profile_image?: string | null;
    avatar?: string | null;
  } | null;

  const label =
    stored?.nombre_visible ||
    stored?.nombre ||
    stored?.username ||
    stored?.correo ||
    stored?.email ||
    "usuario_123";

  const photo =
    stored?.foto_perfil ||
    stored?.fotoPerfil ||
    stored?.profile_image ||
    stored?.avatar ||
    "";

  return {
    label,
    photo,
  };
}

function updateStoredUserProfileSilently(data: {
  id_usuario?: number;
  correo?: string;
  estado?: string;
  nombre_visible?: string;
  foto_perfil?: string | null;
}) {
  const targetKeys = ["auth_user", "rootblend_user"];
  const optionalKeys = ["user"];

  let baseUser: Record<string, unknown> = {};

  for (const key of [...targetKeys, ...optionalKeys]) {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);

    if (!raw) continue;

    try {
      baseUser = {
        ...baseUser,
        ...(JSON.parse(raw) as Record<string, unknown>),
      };
    } catch {
      // Ignoramos valores corruptos.
    }
  }

  const nextUser = {
    ...baseUser,
    ...data,
  };

  const serializedUser = JSON.stringify(nextUser);

  for (const key of targetKeys) {
    localStorage.setItem(key, serializedUser);
  }

  for (const key of optionalKeys) {
    if (localStorage.getItem(key)) {
      localStorage.setItem(key, serializedUser);
    }

    if (sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, serializedUser);
    }
  }
}

function UserProfileAvatar({
  label,
  photo,
  large = false,
}: {
  label: string;
  photo: string;
  large?: boolean;
}) {
  return (
    <Avatar $large={large}>
      {isImageUrl(photo) ? (
        <img
          src={photo}
          alt={label}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        getInitials(label)
      )}
    </Avatar>
  );
}

export function RootShell({
  active = "home",
  children,
  rightPanel,
}: ShellProps) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [role, setRole] = useState<CreatorRole | null>(() => getCreatorRole());
  const [creatorReady, setCreatorReady] = useState(() => !isAuthenticated());
  const [, setMyChannel] = useState<BackendCanal | null>(null);
  const [realChannels, setRealChannels] = useState<ChannelCard[]>([]);
  const [userSnapshot, setUserSnapshot] = useState<UserSnapshot>(() =>
    readStoredUserSnapshot()
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const creatorTarget =
    role === "streamer"
      ? "/creator/streamer/create-stream"
      : role === "podcaster"
        ? "/creator/podcaster/dashboard"
        : "/creator/activate";

  const creatorLabel =
    role === "streamer"
      ? "Configurar stream"
      : role === "podcaster"
        ? "Panel podcaster"
        : "Activar canal";

  const myChannelTarget =
    role === "streamer"
      ? "/creator/streamer/dashboard"
      : role === "podcaster"
        ? "/creator/podcaster/dashboard"
        : "/creator/activate";

  useEffect(() => {
    let activeRequest = true;

    async function syncProfileFromBackend() {
      try {
        const result = await getMe();

        if (!activeRequest) return;

        if (!result.success || !result.data) return;

        const nextName =
          result.data.perfil.nombre_visible ||
          result.data.usuario.correo.split("@")[0] ||
          result.data.usuario.correo;

        const nextPhoto = result.data.perfil.foto_perfil || "";

        updateStoredUserProfileSilently({
          id_usuario: result.data.usuario.id_usuario,
          correo: result.data.usuario.correo,
          estado: result.data.usuario.estado,
          nombre_visible: nextName,
          foto_perfil: nextPhoto || null,
        });

        setUserSnapshot(readStoredUserSnapshot());
      } catch (error) {
        console.error("SHELL_PROFILE_SYNC_ERROR", error);

        if (activeRequest) {
          setUserSnapshot(readStoredUserSnapshot());
        }
      }
    }

    async function loadShellData() {
      const currentlyLoggedIn = isAuthenticated();

      setLoggedIn(currentlyLoggedIn);
      setUserSnapshot(readStoredUserSnapshot());

      try {
        const channels = await getBackendActiveChannels();

        if (activeRequest) {
          const mappedChannels = channels.map(backendChannelToCard);
          setRealChannels(mappedChannels);
        }
      } catch (error) {
        console.error("SHELL_CHANNELS_LOAD_ERROR", error);

        if (activeRequest) {
          setRealChannels([]);
        }
      }

      if (!currentlyLoggedIn) {
        setCreatorReady(true);
        setRole(null);
        setMyChannel(null);
        setUserSnapshot(readStoredUserSnapshot());
        return;
      }

      await syncProfileFromBackend();

      setCreatorReady(false);

      try {
        const result = await getMyChannel();

        if (!activeRequest) {
          return;
        }

        const backendRole = result.canal?.tipo_canal?.nombre_tipo;
        const normalizedRole =
          backendRole === "streamer" || backendRole === "podcaster"
            ? backendRole
            : null;

        if (normalizedRole) {
          localStorage.setItem(CREATOR_ROLE_KEY, normalizedRole);
        } else {
          localStorage.removeItem(CREATOR_ROLE_KEY);
        }

        setRole(normalizedRole);
        setMyChannel(result.canal);
      } catch (error) {
        console.error("SHELL_MY_CHANNEL_LOAD_ERROR", error);

        if (activeRequest) {
          setRole(getCreatorRole());
          setMyChannel(null);
        }
      } finally {
        if (activeRequest) {
          setCreatorReady(true);
        }
      }
    }

    function refreshSession() {
      setLoggedIn(isAuthenticated());
      setRole(getCreatorRole());
      setUserSnapshot(readStoredUserSnapshot());
      loadShellData();
    }

    loadShellData();

    window.addEventListener("storage", refreshSession);
    window.addEventListener("creator-role-changed", refreshSession);
    window.addEventListener("auth-changed", refreshSession);
    window.addEventListener("auth-session-changed", refreshSession);

    return () => {
      activeRequest = false;
      window.removeEventListener("storage", refreshSession);
      window.removeEventListener("creator-role-changed", refreshSession);
      window.removeEventListener("auth-changed", refreshSession);
      window.removeEventListener("auth-session-changed", refreshSession);
    };
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();

    navigate(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  function logout() {
    clearAuthStorage();

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("rootblend_user");
    localStorage.removeItem("user");
    localStorage.removeItem(CREATOR_ROLE_KEY);

    setRole(null);
    setCreatorReady(true);
    setMyChannel(null);
    setMenuOpen(false);
    setNotificationsOpen(false);
    setLoggedIn(false);
    setUserSnapshot(readStoredUserSnapshot());

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth-session-changed"));
    window.dispatchEvent(new Event("creator-role-changed"));

    navigate("/");
  }

  return (
    <AppFrame>
      <Topbar>
        <BrandLink
          to={window.innerWidth > 768 && window.innerHeight > 500 ? "/" : "#"}
          onClick={(event) => {
            const isMobileSize = window.innerWidth <= 768;
            const isLandscapeMobile = window.innerHeight <= 500;

            if (isMobileSize || isLandscapeMobile) {
              event.preventDefault();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }
          }}
        >
          <img src={brandAssets.logo} alt="ROOTBLEND" />
          <strong translate="no">
            ROOT<span>BLEND</span>
          </strong>
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

                {notificationsOpen ? (
                  <DropdownPanel $wide>
                    <DropdownHeader>
                      <strong>Notificaciones</strong>
                      <Link
                        to="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        Ver todas
                      </Link>
                    </DropdownHeader>

                    {notifications.map((item, index) => (
                      <DropdownItem
                        key={item.title}
                        to={
                          index === 1
                            ? "/podcasts/rootcast"
                            : "/streams/cyberpunk-2077"
                        }
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
                ) : null}
              </TopPopoverWrap>

              <TopPopoverWrap>
                <UserPill
                  type="button"
                  onClick={() => {
                    setMenuOpen((value) => !value);
                    setNotificationsOpen(false);
                  }}
                >
                  <UserProfileAvatar
                    label={userSnapshot.label}
                    photo={userSnapshot.photo}
                  />
                  <span>{userSnapshot.label}</span>
                </UserPill>

                {menuOpen ? (
                  <DropdownPanel>
                    <ProfileHeader>
                      <UserProfileAvatar
                        label={userSnapshot.label}
                        photo={userSnapshot.photo}
                        large
                      />
                      <div>
                        <h2>{userSnapshot.label}</h2>
                        <p>
                          {role
                            ? `Creador ${
                                role === "streamer" ? "streamer" : "podcaster"
                              }`
                            : "Viewer ROOTBLEND"}
                        </p>
                      </div>
                    </ProfileHeader>

                    <DropdownMenuLink
                      to="/"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiHome /> Inicio
                    </DropdownMenuLink>

                    <DropdownMenuLink
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiUser /> Perfil
                    </DropdownMenuLink>

                    {creatorReady ? (
                      <>
                        <DropdownMenuLink
                          to={myChannelTarget}
                          onClick={() => setMenuOpen(false)}
                        >
                          <FiEye /> Mi canal
                        </DropdownMenuLink>

                        {!role ? (
                          <DropdownMenuLink
                            to="/creator/activate"
                            onClick={() => setMenuOpen(false)}
                          >
                            <FiRadio /> Activar canal
                          </DropdownMenuLink>
                        ) : null}

                        <DropdownMenuLink
                          to={creatorTarget}
                          onClick={() => setMenuOpen(false)}
                        >
                          <FiGrid /> {creatorLabel}
                        </DropdownMenuLink>
                      </>
                    ) : (
                      <DropdownMenuLoading>
                        <FiRefreshCw /> Verificando canal...
                      </DropdownMenuLoading>
                    )}

                    <DropdownMenuLink
                      to="/creator/stats"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiActivity /> Estadisticas
                    </DropdownMenuLink>

                    <DropdownMenuLink
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiSettings /> Configuracion
                    </DropdownMenuLink>

                    <DropdownMenuLink
                      to="/notifications"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiBell /> Notificaciones
                    </DropdownMenuLink>

                    <DropdownMenuLink
                      to="/following"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiUsers /> Seguidos
                    </DropdownMenuLink>

                    <DropdownMenuLink
                      to="/subscriptions"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiStar /> Suscripciones
                    </DropdownMenuLink>

                    <DropdownMenuLink
                      to="/change-password"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiLock /> Cambiar contrasena
                    </DropdownMenuLink>

                    <DropdownMenuLink
                      to="/"
                      onClick={(event) => {
                        event.preventDefault();
                        logout();
                      }}
                    >
                      <FiLogOut /> Cerrar sesión
                    </DropdownMenuLink>
                  </DropdownPanel>
                ) : null}
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
        {isMobileMenuOpen ? (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.6)",
              zIndex: 9998,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ) : null}

        <Sidebar $isOpen={isMobileMenuOpen}>
          <SidebarSection>
            <SidebarTitle>Recomendados</SidebarTitle>

            {realChannels.length === 0 ? (
              <SidebarEmptyText>Aún no hay canales activos.</SidebarEmptyText>
            ) : (
              realChannels.slice(0, 6).map((channel) => (
                <ChannelMini key={channel.id} to={`/channels/${channel.id}`}>
                  <ChannelAvatarImage channel={channel} />

                  <MiniText>
                    <strong>{channel.name}</strong>
                    <small>
                      {channel.subtitle === "streamer"
                        ? "Streamer"
                        : channel.subtitle === "podcaster"
                          ? "Podcaster"
                          : channel.subtitle}
                    </small>
                  </MiniText>

                  <ViewerDot>{channel.viewers}</ViewerDot>
                </ChannelMini>
              ))
            )}
          </SidebarSection>

          <SidebarSection>
            <SidebarTitle>Explorar</SidebarTitle>

            {pageLinks.map((item) => {
              if (
                !loggedIn &&
                (item.key === "creator" || item.key === "moderation")
              ) {
                return null;
              }

              const Icon = item.icon;
              const target = item.key === "creator" ? creatorTarget : item.to;
              const label = item.key === "creator" ? creatorLabel : item.label;

              return (
                <SidebarLink
                  key={item.key}
                  to={target}
                  $active={active === item.key}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarLink>
              );
            })}
          </SidebarSection>

          {!loggedIn ? (
            <PromoPanel>
              <strong>Suscribete a ROOTBLEND</strong>
              <p>Apoya a tus creadores favoritos y desbloquea beneficios.</p>
              <PrimaryLink to="/subscriptions">Descubre mas</PrimaryLink>
            </PromoPanel>
          ) : null}
        </Sidebar>

        <MainArea>{children}</MainArea>

        {rightPanel ? <RightRail>{rightPanel}</RightRail> : null}
      </ShellGrid>
    </AppFrame>
  );
}