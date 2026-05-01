import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiSearch, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import { StyledNavbar, LogoImage } from "../../styles/GlobalStyles";
import Logo from "../../assets/Logo.png";
import UserMenu from "./UserMenu";
import { isAuthenticated } from "../../modules/auth/utils/authStorage";

const SearchBar = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 400px;

  input {
    background: transparent;
    border: none;
    color: white;
    outline: none;
    width: 100%;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
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
        background: linear-gradient(135deg, #00e5ff, #00ff99);
        color: #071016;

        &:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
      `
      : `
        background: rgba(255, 255, 255, 0.06);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.08);

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}
`;

export const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    function handleAuthChanged() {
      setLoggedIn(isAuthenticated());
    }

    handleAuthChanged();

    window.addEventListener("auth-changed", handleAuthChanged);
    window.addEventListener("storage", handleAuthChanged);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChanged);
      window.removeEventListener("storage", handleAuthChanged);
    };
  }, []);

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

      <SearchBar>
        <FiSearch color="rgba(255,255,255,0.5)" />
        <input type="text" placeholder="Buscar transmisiones..." />
      </SearchBar>

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
            <FiBell
              size={20}
              style={{
                cursor: "pointer",
                color: "rgba(255,255,255,0.7)",
              }}
            />
            <UserMenu />
          </>
        )}
      </RightActions>
    </StyledNavbar>
  );
};