//frontend/src/components/layout/Navbar.tsx
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import styled from "styled-components";
import { FiSearch, FiBell, FiRadio, FiMic, FiCreditCard } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { StyledNavbar, LogoImage } from "../../styles/GlobalStyles";
import Logo from "../../assets/Logo.png";
import UserMenu from "./UserMenu";
import { isAuthenticated } from "../../modules/auth/utils/authStorage";

const SearchForm = styled.form`
  background: var(--rb-input-bg);
  border: 1px solid var(--rb-input-border);
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 400px;
  color: var(--rb-muted-soft);

  svg {
    color: var(--rb-muted-soft);
    flex-shrink: 0;
  }

  input {
    background: transparent;
    border: none;
    color: var(--rb-text);
    outline: none;
    width: 100%;

    &::placeholder {
      color: var(--rb-muted-soft);
    }
  }

  &:focus-within {
    border-color: var(--rb-border-strong);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }

  @media (max-width: 900px) {
    width: 260px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const RightActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const AuthLink = styled(Link)<{ $variant?: "primary" | "ghost" }>`
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
  border-radius: 999px;
  padding: 9px 14px;
  transition: 0.18s ease;

  ${({ $variant }) =>
    $variant === "primary"
      ? `
        background: linear-gradient(135deg, var(--rb-accent), var(--rb-success));
        color: var(--rb-text-inverse);

        &:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
      `
      : `
        background: var(--rb-panel);
        color: var(--rb-text);
        border: 1px solid var(--rb-border);

        &:hover {
          background: var(--rb-panel-hover);
          border-color: var(--rb-border-strong);
        }
      `}
`;

const BellWrapper = styled.div`
  position: relative;
`;

const BellButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid var(--rb-border);
  background: var(--rb-panel);
  color: var(--rb-muted);
  display: grid;
  place-items: center;
  cursor: pointer;
  position: relative;
  transition: 0.18s ease;

  &:hover {
    background: var(--rb-panel-hover);
    border-color: var(--rb-border-strong);
    color: var(--rb-text);
  }
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--rb-success);
  box-shadow: 0 0 10px color-mix(in srgb, var(--rb-success) 72%, transparent);
`;

const NotificationPanel = styled.div`
  position: absolute;
  top: 48px;
  right: 0;
  width: 340px;
  background: var(--rb-panel);
  border: 1px solid var(--rb-border);
  border-radius: 16px;
  padding: 14px;
  z-index: 1200;
  box-shadow: 0 24px 70px var(--rb-shadow);
  color: var(--rb-text);
  backdrop-filter: blur(18px);

  @media (max-width: 480px) {
    width: min(340px, calc(100vw - 24px));
    right: -12px;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  strong {
    color: var(--rb-text-strong);
    font-size: 14px;
  }

  a {
    color: var(--rb-accent);
    font-size: 12px;
    text-decoration: none;
    font-weight: 800;

    &:hover {
      color: var(--rb-text-strong);
    }
  }
`;

const NotificationItem = styled(Link)`
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  color: var(--rb-text);
  text-decoration: none;
  transition: 0.18s ease;

  &:hover {
    background: var(--rb-panel-hover);
  }

  .icon {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--rb-accent) 13%, transparent);
    color: var(--rb-accent);
  }

  span {
    display: block;
    font-size: 13px;
    font-weight: 800;
    color: var(--rb-text-strong);
  }

  small {
    display: block;
    margin-top: 3px;
    font-size: 12px;
    color: var(--rb-muted-soft);
  }
`;

const demoNotifications = [
  {
    title: "PixelNate inició directo",
    description: "Cyberpunk 2077 en vivo ahora",
    to: "/streams/cyberpunk-2077",
    type: "stream",
  },
  {
    title: "LunaVibes publicó episodio",
    description: "Nuevo episodio disponible",
    to: "/podcasts/podcast-raices-sonoras",
    type: "podcast",
  },
  {
    title: "Suscripción renovada",
    description: "Tu plan de comunidad sigue activo",
    to: "/subscriptions",
    type: "subscription",
  },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    function handleAuthChanged() {
      setLoggedIn(isAuthenticated());
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    handleAuthChanged();

    window.addEventListener("auth-changed", handleAuthChanged);
    window.addEventListener("storage", handleAuthChanged);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChanged);
      window.removeEventListener("storage", handleAuthChanged);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate("/search");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <StyledNavbar>
      <Link
        to="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LogoImage src={Logo} alt="RootBlend Logo" />
      </Link>

      <SearchForm onSubmit={handleSearch}>
        <FiSearch />
        <input
          type="text"
          placeholder="Buscar streams, canales, podcasts..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </SearchForm>

      <RightActions>
        {!loggedIn ? (
          <>
            <AuthLink to="/login" $variant="ghost">
              Iniciar sesión
            </AuthLink>

            <AuthLink to="/register" $variant="primary">
              Registrarse
            </AuthLink>
          </>
        ) : (
          <>
            <BellWrapper ref={notificationRef}>
              <BellButton
                type="button"
                onClick={() => setNotificationsOpen((value) => !value)}
                aria-label="Abrir notificaciones"
              >
                <FiBell size={20} />
                <NotificationDot />
              </BellButton>

              {notificationsOpen && (
                <NotificationPanel>
                  <NotificationHeader>
                    <strong>Notificaciones</strong>
                    <Link
                      to="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      Ver todas
                    </Link>
                  </NotificationHeader>

                  {demoNotifications.map((item) => (
                    <NotificationItem
                      key={item.title}
                      to={item.to}
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <div className="icon">
                        {item.type === "stream" && <FiRadio />}
                        {item.type === "podcast" && <FiMic />}
                        {item.type === "subscription" && <FiCreditCard />}
                      </div>

                      <div>
                        <span>{item.title}</span>
                        <small>{item.description}</small>
                      </div>
                    </NotificationItem>
                  ))}
                </NotificationPanel>
              )}
            </BellWrapper>

            <UserMenu />
          </>
        )}
      </RightActions>
    </StyledNavbar>
  );
};
