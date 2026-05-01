import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiLock,
  FiHome,
  FiRadio,
  FiGrid,
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

const MenuWrapper = styled.div`
  position: relative;
`;

const AvatarButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #00e5ff, #00ff99);
  color: #071016;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  width: 310px;
  background: #2c2c38;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  z-index: 1000;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
`;

const UserHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 6px 6px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 8px;
`;

const HeaderAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffd166;
  color: #171720;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
`;

const UserInfo = styled.div`
  min-width: 0;

  strong {
    display: block;
    color: #ffffff;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    color: rgba(255, 255, 255, 0.55);
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
  background: rgba(0, 229, 255, 0.08);
  border: 1px solid rgba(0, 229, 255, 0.14);
  color: rgba(255, 255, 255, 0.82);
  font-size: 12px;
  line-height: 1.45;

  strong {
    color: #00e5ff;
  }
`;

const MenuSectionTitle = styled.div`
  padding: 10px 8px 5px;
  color: rgba(255, 255, 255, 0.42);
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
  color: #ffffff;
  text-decoration: none;
  padding: 10px 8px;
  border-radius: 8px;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }

  svg {
    color: rgba(255, 255, 255, 0.75);
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ff7b85;
  background: transparent;
  border: none;
  padding: 10px 8px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: rgba(255, 79, 94, 0.1);
  }

  svg {
    color: #ff7b85;
  }
`;

function getCreatorRole() {
  return localStorage.getItem("creator_role");
}

function getCreatorPanelPath() {
  const role = getCreatorRole();

  if (role === "podcaster") {
    return "/creator/podcaster";
  }

  if (role === "streamer") {
    return "/creator/streamer";
  }

  return "/creator/activate";
}

function getCreatorLabel() {
  const role = getCreatorRole();

  if (role === "podcaster") {
    return "Panel podcaster";
  }

  if (role === "streamer") {
    return "Panel streamer";
  }

  return "Activar canal";
}

export default function UserMenu() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [creatorRole, setCreatorRole] = useState(getCreatorRole());

  const user = loggedIn ? getStoredUser() : null;

  const displayName =
    user?.nombre_visible ||
    user?.nombre ||
    user?.username ||
    user?.correo ||
    "Usuario";

  const email = user?.correo || user?.email || "Cuenta ROOTBLEND";
  const initial = String(displayName).charAt(0).toUpperCase();

  function refreshAuthState() {
    const sessionState = isAuthenticated();
    setLoggedIn(sessionState);
    setCreatorRole(getCreatorRole());

    if (!sessionState) {
      setOpen(false);
    }
  }

  function closeMenu() {
    setOpen(false);
  }

  function handleLogout() {
    clearAuthStorage();
    localStorage.removeItem("creator_role");
    setLoggedIn(false);
    setOpen(false);

    navigate("/", { replace: true });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleStorageChange() {
      refreshAuthState();
    }

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
  }, []);

  if (!loggedIn) {
    return null;
  }

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
                ? "Streamer"
                : creatorRole === "podcaster"
                  ? "Podcaster"
                  : "Sin canal"}
            </strong>
            <br />
            Una cuenta solo puede operar como streamer o podcaster, no ambos.
          </RoleNotice>

          <MenuList>
            <MenuSectionTitle>Principal</MenuSectionTitle>

            <MenuLink to="/" onClick={closeMenu}>
              <FiHome />
              Inicio
            </MenuLink>

            <MenuLink to="/profile" onClick={closeMenu}>
              <FiUser />
              Ver mi perfil
            </MenuLink>

            <MenuLink to="/notifications" onClick={closeMenu}>
              <FiBell />
              Notificaciones
            </MenuLink>

            <MenuLink to="/following" onClick={closeMenu}>
              <FiHeart />
              Seguidos
            </MenuLink>

            <MenuLink to="/subscriptions" onClick={closeMenu}>
              <FiCreditCard />
              Suscripciones
            </MenuLink>

            <MenuSectionTitle>Creador</MenuSectionTitle>

            <MenuLink to={getCreatorPanelPath()} onClick={closeMenu}>
              {creatorRole === "podcaster" ? <FiMic /> : <FiRadio />}
              {getCreatorLabel()}
            </MenuLink>

            <MenuLink to="/stats" onClick={closeMenu}>
              <FiActivity />
              Estadísticas
            </MenuLink>

            {creatorRole === "streamer" && (
              <MenuLink to="/moderation/moderators" onClick={closeMenu}>
                <FiShield />
                Moderadores de mi chat
              </MenuLink>
            )}

            {!creatorRole && (
              <MenuLink to="/creator/activate" onClick={closeMenu}>
                <FiGrid />
                Activar canal de creador
              </MenuLink>
            )}

            <MenuSectionTitle>Cuenta</MenuSectionTitle>

            <MenuLink to="/settings" onClick={closeMenu}>
              <FiSettings />
              Configuración
            </MenuLink>

            <MenuLink to="/change-password" onClick={closeMenu}>
              <FiLock />
              Cambiar contraseña
            </MenuLink>

            <LogoutButton type="button" onClick={handleLogout}>
              <FiLogOut />
              Cerrar sesión
            </LogoutButton>
          </MenuList>
        </Dropdown>
      )}
    </MenuWrapper>
  );
}