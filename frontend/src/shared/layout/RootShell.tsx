//frontend/src/shared/layout/RootShell.tsx
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
import {
  getActiveChannels as getBackendActiveChannels,
  getMyChannel,
  type Canal as BackendCanal,
} from "../../modules/streams/services/streamsService";
import { getMe } from "../../services/userService";
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
  ButtonGroup,
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
};

type ShellStoredUser = {
  id_usuario?: number;
  id?: number;
  nombre_visible?: string;
  correo?: string;
  nombre?: string;
  username?: string;
  email?: string;
  foto_perfil?: string | null;
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

function getInitials(value?: string) {
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

function backendChannelToCard(channel: BackendCanal): ChannelCard {
  return {
    name: channel.nombre_canal,
    subtitle: channel.tipo_canal.nombre_tipo,
    viewers: "0",
    avatar: getInitials(channel.nombre_canal),
    id: String(channel.id_canal),
  };
}

function getCreatorRole(): CreatorRole | null {
  const role = localStorage.getItem(CREATOR_ROLE_KEY);

  if (role === "streamer" || role === "podcaster") {
    return role;
  }

  return null;
}

function getUserLabel(user?: ShellStoredUser | null) {
  return (
    user?.nombre_visible ||
    user?.nombre ||
    user?.username ||
    user?.correo ||
    user?.email ||
    "usuario_123"
  );
}

function getUserPhoto(user?: ShellStoredUser | null) {
  return user?.foto_perfil || null;
}

function isImageUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/")
  );
}

function renderUserAvatar(photoUrl: string | null, label: string) {
  if (isImageUrl(photoUrl)) {
    return (
      <img
        src={photoUrl || ""}
        alt={label}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }

  return getInitials(label);
}

function readStoredMenuUser() {
  return getStoredUser() as ShellStoredUser | null;
}

function saveMenuUserFromBackend(data: {
  usuario: {
    id_usuario: number;
    correo: string;
    estado: string;
  };
  perfil: {
    nombre_visible: string | null;
    foto_perfil: string | null;
  };
}) {
  const nextUser: ShellStoredUser = {
    id_usuario: data.usuario.id_usuario,
    correo: data.usuario.correo,
    email: data.usuario.correo,
    nombre_visible:
      data.perfil.nombre_visible || data.usuario.correo.split("@")[0],
    foto_perfil: data.perfil.foto_perfil || null,
  };

  const keys = ["auth_user", "rootblend_user"];

  for (const key of keys) {
    const raw = localStorage.getItem(key);

    if (!raw) {
      localStorage.setItem(key, JSON.stringify(nextUser));
      continue;
    }

    try {
      const parsed = JSON.parse(raw);

      localStorage.setItem(
        key,
        JSON.stringify({
          ...parsed,
          ...nextUser,
        })
      );
    } catch {
      localStorage.setItem(key, JSON.stringify(nextUser));
    }
  }

  return nextUser;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [menuUser, setMenuUser] = useState<ShellStoredUser | null>(() =>
    isAuthenticated() ? readStoredMenuUser() : null
  );
  const [role, setRole] = useState<CreatorRole | null>(() => getCreatorRole());
  const [creatorReady, setCreatorReady] = useState(() => !isAuthenticated());
  const [, setMyChannel] = useState<BackendCanal | null>(null);
  const [realChannels, setRealChannels] = useState<ChannelCard[]>([]);

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

  const userLabel = getUserLabel(menuUser);
  const userPhoto = getUserPhoto(menuUser);

  useEffect(() => {
    let activeRequest = true;

    async function loadShellData() {
      const currentlyLoggedIn = isAuthenticated();

      setLoggedIn(currentlyLoggedIn);
      setMenuUser(currentlyLoggedIn ? readStoredMenuUser() : null);

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
        setMenuUser(null);
        return;
      }

      setCreatorReady(false);

      try {
        const meResult = await getMe();

        if (activeRequest && meResult.success && meResult.data) {
          const backendUser = saveMenuUserFromBackend(meResult.data);
          setMenuUser(backendUser);
        }
      } catch (error) {
        console.error("SHELL_USER_PROFILE_LOAD_ERROR", error);

        if (activeRequest) {
          setMenuUser(readStoredMenuUser());
        }
      }

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
          setMenuUser(readStoredMenuUser());
        }
      }
    }

    function refreshSession() {
      const currentlyLoggedIn = isAuthenticated();

      setLoggedIn(currentlyLoggedIn);
      setMenuUser(currentlyLoggedIn ? readStoredMenuUser() : null);
      setRole(getCreatorRole());

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
    setMenuUser(null);
    setCreatorReady(true);
    setMyChannel(null);
    setMenuOpen(false);
    setNotificationsOpen(false);
    setLoggedIn(false);

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth-session-changed"));
    window.dispatchEvent(new Event("auth-changed"));
    window.dispatchEvent(new Event("creator-role-changed"));

    navigate("/");
  }

  return (
    <AppFrame>
      <Topbar>
        <BrandLink
          to={
            window.innerWidth > 768 && window.innerHeight > 500 ? "/" : "#"
          }
          onClick={(event) => {
            const isMobileSize = window.innerWidth <= 768;
            const isLandscapeMobile = window.innerHeight <= 500;

            if (isMobileSize || isLandscapeMobile) {
              event.preventDefault();
              setIsMobileMenuOpen((value) => !value);
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
                    const latestUser = readStoredMenuUser();

                    if (latestUser) {
                      setMenuUser(latestUser);
                    }

                    setMenuOpen((value) => !value);
                    setNotificationsOpen(false);
                  }}
                >
                  <Avatar>{renderUserAvatar(userPhoto, userLabel)}</Avatar>
                  <span>{userLabel}</span>
                </UserPill>

                {menuOpen ? (
                  <DropdownPanel>
                    <ProfileHeader>
                      <Avatar $large>
                        {renderUserAvatar(userPhoto, userLabel)}
                      </Avatar>

                      <div>
                        <h2>{userLabel}</h2>
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
                        {role ? (
                          <DropdownMenuLink
                            to={myChannelTarget}
                              onClick={() => setMenuOpen(false)}
                            >
                              <FiEye /> Mi canal
                            </DropdownMenuLink>
                          ) : null}

                          <DropdownMenuLink
                            to={creatorTarget}
                            onClick={() => setMenuOpen(false)}
                          >
                            {role ? <FiGrid /> : <FiRadio />} {creatorLabel}
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
              <ButtonGroup>
                <GhostLink to="/login">Iniciar sesión</GhostLink>
                <PrimaryLink to="/register">Registrarse</PrimaryLink>
              </ButtonGroup>
            </>
          )}
        </TopActions>
      </Topbar>

      <ShellGrid $hasRightPanel={Boolean(rightPanel)}>
        {isMobileMenuOpen ? (
          <div
            style={{
              position: "fixed",
              inset: 0,
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
                <ChannelMini
                  key={channel.id}
                  to={`/channels/${channel.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Avatar>{channel.avatar}</Avatar>

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
              if (role === "podcaster" && item.key === "moderation") {
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
                  onClick={() => setIsMobileMenuOpen(false)}
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