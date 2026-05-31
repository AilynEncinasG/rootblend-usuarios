//frontend/src/components/layout/UserMenu.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiLock,
  FiHome,
  FiRadio,
  FiBell,
  FiHeart,
  FiCreditCard,
  FiActivity,
  FiShield,
  FiMic,
} from "react-icons/fi";
import {
  clearAuthStorage,
  getStoredUser,
  isAuthenticated,
} from "../../modules/auth/utils/authStorage";
import { getMyChannel, type Canal } from "../../modules/streams/services/streamsService";
import { logoutUser } from "../../modules/auth/services/authService";

type CreatorRole = "streamer" | "podcaster";

const MenuWrapper = styled.div`
  position: relative;
`;

const AvatarButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--rb-accent), var(--rb-success));
  color: var(--rb-text-inverse);
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--rb-accent) 22%, transparent);
  transition: 0.18s ease;

  &:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  width: 310px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  border-radius: 14px;
  padding: 12px;
  z-index: 1000;
  box-shadow: 0 18px 45px var(--rb-shadow);
  color: var(--rb-text);
  backdrop-filter: blur(18px);
`;

const UserHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 6px 6px 12px;
  border-bottom: 1px solid var(--rb-border);
  margin-bottom: 8px;
`;

const HeaderAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--rb-warning) 72%, var(--rb-panel));
  color: var(--rb-text-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  border: 1px solid color-mix(in srgb, var(--rb-warning) 35%, transparent);
`;

const UserInfo = styled.div`
  min-width: 0;

  strong {
    display: block;
    color: var(--rb-text-strong);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    color: var(--rb-muted-soft);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const RoleNotice = styled.div`
  margin: 8px 0;
  padding: 10px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--rb-accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--rb-accent) 18%, transparent);
  color: var(--rb-muted);
  font-size: 12px;
  line-height: 1.45;

  strong {
    color: var(--rb-accent);
  }
`;

const MenuSectionTitle = styled.div`
  padding: 10px 8px 5px;
  color: var(--rb-muted-soft);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--rb-text);
  text-decoration: none;
  padding: 10px 8px;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.18s ease;

  &:hover {
    background: var(--rb-panel-hover);
    color: var(--rb-text-strong);
  }

  svg {
    color: var(--rb-muted);
    transition: 0.18s ease;
  }

  &:hover svg {
    color: var(--rb-accent);
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--rb-danger);
  background: transparent;
  border: none;
  padding: 10px 8px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: 0.18s ease;

  &:hover {
    background: color-mix(in srgb, var(--rb-danger) 10%, transparent);
  }

  svg {
    color: var(--rb-danger);
  }
`;

function getChannelRole(channel?: Canal | null): CreatorRole | null {
  const role = channel?.tipo_canal?.nombre_tipo;
  return role === "streamer" || role === "podcaster" ? role : null;
}

function syncCreatorRole(role: CreatorRole | null) {
  if (role) {
    localStorage.setItem("creator_role", role);
  } else {
    localStorage.removeItem("creator_role");
  }

  window.dispatchEvent(new Event("creator-role-changed"));
}

function getCreatorPanelPath(role: CreatorRole | null) {
  if (role === "podcaster") return "/creator/podcaster";
  if (role === "streamer") return "/creator/streamer/create-stream";
  return "/creator/activate";
}

function getCreatorLabel(role: CreatorRole | null) {
  if (role === "podcaster") return "Panel podcaster";
  if (role === "streamer") return "Configurar stream";
  return "Activar canal";
}

export default function UserMenu() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [creatorRole, setCreatorRole] = useState<CreatorRole | null>(null);
  const [channelName, setChannelName] = useState("");

  const user = loggedIn ? getStoredUser() : null;

  const displayName =
    user?.nombre_visible ||
    user?.nombre ||
    user?.username ||
    user?.correo ||
    "Usuario";

  const email = user?.correo || user?.email || "Cuenta ROOTBLEND";
  const initial = String(displayName).charAt(0).toUpperCase();

  const loadCreatorState = useCallback(async () => {
    if (!isAuthenticated()) {
      setCreatorRole(null);
      setChannelName("");
      return;
    }

    try {
      const result = await getMyChannel();
      const role = getChannelRole(result.canal);
      syncCreatorRole(role);
      setCreatorRole(role);
      setChannelName(result.canal?.nombre_canal || "");
    } catch (error) {
      console.error("USER_MENU_CHANNEL_ERROR", error);
      syncCreatorRole(null);
      setCreatorRole(null);
      setChannelName("");
    }
  }, []);

  const refreshAuthState = useCallback(() => {
    const sessionState = isAuthenticated();
    setLoggedIn(sessionState);

    if (!sessionState) {
      setOpen(false);
      setCreatorRole(null);
      setChannelName("");
      return;
    }

    void loadCreatorState();
  }, [loadCreatorState]);

  function closeMenu() {
    setOpen(false);
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (error) {
      console.error("LOGOUT_ERROR", error);
      clearAuthStorage();
    }

    localStorage.removeItem("creator_role");
    setLoggedIn(false);
    setOpen(false);
    setCreatorRole(null);
    setChannelName("");
    navigate("/", { replace: true });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleStorageChange() {
      refreshAuthState();
    }

    queueMicrotask(refreshAuthState);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-changed", handleStorageChange);
    window.addEventListener("creator-role-changed", handleStorageChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-changed", handleStorageChange);
      window.removeEventListener("creator-role-changed", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refreshAuthState]);

  if (!loggedIn) return null;

  return (
    <MenuWrapper ref={wrapperRef}>
      <AvatarButton
        type="button"
        onClick={() => {
          refreshAuthState();
          setOpen((value) => !value);
        }}
      >
        {initial}
      </AvatarButton>

      {open && (
        <Dropdown>
          <UserHeader>
            <HeaderAvatar>{initial}</HeaderAvatar>
            <UserInfo>
              <strong>{displayName}</strong>
              <span>{email}</span>
            </UserInfo>
          </UserHeader>

          <RoleNotice>
            Canal activo:{" "}
            <strong>
              {creatorRole === "streamer"
                ? `Streamer${channelName ? ` - ${channelName}` : ""}`
                : creatorRole === "podcaster"
                  ? `Podcaster${channelName ? ` - ${channelName}` : ""}`
                  : "Sin canal"}
            </strong>
            <br />
            Una cuenta solo puede operar como streamer o podcaster, no ambos.
          </RoleNotice>

          <MenuList>
            <MenuSectionTitle>Principal</MenuSectionTitle>

            <MenuLink to="/" onClick={closeMenu}><FiHome />Inicio</MenuLink>
            <MenuLink to="/profile" onClick={closeMenu}><FiUser />Ver mi perfil</MenuLink>
            <MenuLink to="/notifications" onClick={closeMenu}><FiBell />Notificaciones</MenuLink>
            <MenuLink to="/following" onClick={closeMenu}><FiHeart />Seguidos</MenuLink>
            <MenuLink to="/subscriptions" onClick={closeMenu}><FiCreditCard />Suscripciones</MenuLink>

            <MenuSectionTitle>Creador</MenuSectionTitle>

            <MenuLink to={getCreatorPanelPath(creatorRole)} onClick={closeMenu}>
              {creatorRole === "podcaster" ? <FiMic /> : <FiRadio />}
              {getCreatorLabel(creatorRole)}
            </MenuLink>

            <MenuLink to="/stats" onClick={closeMenu}><FiActivity />Estadisticas</MenuLink>

            {creatorRole === "streamer" && (
              <MenuLink to="/moderation/moderators" onClick={closeMenu}>
                <FiShield />Moderadores de mi chat
              </MenuLink>
            )}

            <MenuSectionTitle>Cuenta</MenuSectionTitle>
            <MenuLink to="/settings" onClick={closeMenu}><FiSettings />Configuracion</MenuLink>
            <MenuLink to="/change-password" onClick={closeMenu}><FiLock />Cambiar contrasena</MenuLink>

            <LogoutButton type="button" onClick={handleLogout}><FiLogOut />Cerrar sesion</LogoutButton>
          </MenuList>
        </Dropdown>
      )}
    </MenuWrapper>
  );
}
