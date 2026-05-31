//frontend/src/styles/GlobalStyles.ts
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Link } from "react-router-dom";
import fondoImage from "../assets/Fondo.png"; 

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    min-height: 100%;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at top left, color-mix(in srgb, var(--rb-accent) 9%, transparent), transparent 22%),
      radial-gradient(circle at top right, color-mix(in srgb, var(--rb-accent-2) 10%, transparent), transparent 18%),
      linear-gradient(180deg, var(--rb-app-overlay-start) 0%, var(--rb-app-overlay-end) 100%);
    color: var(--rb-text);
  }

  body {
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, select, textarea {
    font: inherit;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--rb-bg-deep);
  }

  ::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--rb-accent) 28%, transparent);
    border-radius: 999px;
  }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

export const MainWrapper = styled.main`
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  min-height: 100vh; 
  width: 100%; 
  padding: 20px; 
  position: relative;
  color: var(--rb-text);
  background-image: url(${fondoImage}); 
  background-size: cover; 
  background-position: center;
  background-attachment: fixed;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--rb-app-overlay-start) 72%, transparent),
        color-mix(in srgb, var(--rb-app-overlay-end) 84%, transparent)
      );
    z-index: 0;
  }
`;

// --- Componentes del Logo ---
export const LogoContainer = styled.div` 
  text-align: center;
  margin-bottom: 40px;
  animation: ${float} 5s ease-in-out infinite;
  z-index: 1;
  width: auto;
  max-width: 100%;
`;

export const LogoText = styled.h1`
  font-size: clamp(2rem, 5vw, 4.5rem); 
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -2px;
  line-height: 1;
  background: linear-gradient(
    to bottom,
    var(--rb-text-strong) 30%,
    var(--rb-accent) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 25px color-mix(in srgb, var(--rb-accent) 38%, transparent));
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
`;

export const Subtitle = styled.p` 
  color: var(--rb-success); 
  font-size: 0.75rem; 
  font-weight: 800; 
  letter-spacing: 5px; 
  margin-top: 10px;
`;

// --- Navegación ---
export const NavContainer = styled.div` 
  display: flex; 
  background: color-mix(in srgb, var(--rb-panel) 88%, transparent); 
  padding: 5px; 
  border-radius: 16px; 
  border: 1px solid var(--rb-border); 
  margin-bottom: 30px; 
  backdrop-filter: blur(10px); 
  z-index: 1; 
  box-shadow: 0 12px 28px color-mix(in srgb, var(--rb-shadow) 55%, transparent);
`;

export const NavTab = styled(Link)<{ $active?: boolean }>`
  text-decoration: none; 
  padding: 10px 25px; 
  border-radius: 12px; 
  font-size: 0.8rem; 
  font-weight: 700; 
  transition: 0.3s;
  color: ${({ $active }) => ($active ? "var(--rb-text-inverse)" : "var(--rb-muted)")};
  background: ${({ $active }) => ($active ? "var(--rb-accent)" : "transparent")};

  &:hover {
    color: ${({ $active }) => ($active ? "var(--rb-text-inverse)" : "var(--rb-text)")};
    background: ${({ $active }) =>
      $active ? "var(--rb-accent)" : "color-mix(in srgb, var(--rb-accent) 10%, transparent)"};
  }
`;

// --- UI Components (Inputs, Card, Button) ---
export const Card = styled.div`
  width: 100%; 
  max-width: 380px; 
  background: var(--rb-card-bg); 
  backdrop-filter: blur(25px);
  border: 1px solid var(--rb-border); 
  border-radius: 28px; 
  padding: 40px;
  box-shadow: 0 30px 60px var(--rb-shadow);
  color: var(--rb-text);
`;

export const InputGroup = styled.div` 
  position: relative; 
  margin-bottom: 20px; 
`;

export const Input = styled.input`
  width: 100%; 
  padding: 16px 16px 16px 45px; 
  background: var(--rb-input-bg);
  border: 1px solid var(--rb-input-border); 
  border-radius: 14px; 
  color: var(--rb-text); 
  outline: none; 
  transition: 0.3s;

  &::placeholder {
    color: var(--rb-muted-soft);
  }

  &:focus {
    border-color: var(--rb-border-strong);
    background: var(--rb-input-bg);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rb-accent) 14%, transparent);
  }
`;

export const Button = styled.button`
  width: 100%; 
  padding: 16px; 
  border: none; 
  border-radius: 14px; 
  background: linear-gradient(90deg, var(--rb-accent-2), var(--rb-accent));
  color: var(--rb-text-inverse); 
  font-weight: 800; 
  font-size: 0.95rem; 
  cursor: pointer;
  display: flex; 
  align-items: center;
  justify-content: center; 
  gap: 8px; 
  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
    box-shadow: 0 10px 25px color-mix(in srgb, var(--rb-accent) 26%, transparent);
  }
`;

export const DashboardLayout = styled.div`
  display: grid;
  grid-template-areas: 
    "nav nav"
    "sidebar main";
  grid-template-columns: 260px 1fr;
  grid-template-rows: 70px 1fr;
  height: 100vh;
  background:
    linear-gradient(180deg, var(--rb-app-overlay-start), var(--rb-app-overlay-end));
  color: var(--rb-text);
`;

export const StyledNavbar = styled.nav`
  grid-area: nav;
  background: var(--rb-panel);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--rb-border);
  z-index: 10;
  height: 64px;
  color: var(--rb-text);
  box-shadow: 0 10px 26px color-mix(in srgb, var(--rb-shadow) 35%, transparent);

  & > a:first-child {
    flex: 1; 
    display: flex;
    justify-content: flex-start;
  }

  & > :last-child {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
`;

export const LogoImage = styled.img`
  height: 40px; 
  width: auto; 
  display: block;
  cursor: pointer;
  filter: drop-shadow(0 0 5px color-mix(in srgb, var(--rb-accent) 45%, transparent));
`;

export const StyledSidebar = styled.aside`
  grid-area: sidebar;
  background: var(--rb-panel-strong);
  padding: 20px;
  border-right: 1px solid var(--rb-border);
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  color: var(--rb-text);
`;

export const ChannelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  color: var(--rb-text);

  &:hover {
    background: var(--rb-panel-hover);
  }
`;

export const Avatar = styled.div<{ $online?: boolean }>`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--rb-accent-2) 18%, var(--rb-panel));
  position: relative;
  border: 2px solid ${({ $online }) => ($online ? "var(--rb-success)" : "transparent")};
`;

export const StreamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

export const SearchBar = styled.div`
  background: var(--rb-input-bg);
  border: 1px solid var(--rb-input-border);
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 400px;
  color: var(--rb-muted);

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
`;

export const Thumbnail = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background:
    linear-gradient(
      45deg,
      color-mix(in srgb, var(--rb-panel-strong) 92%, transparent),
      color-mix(in srgb, var(--rb-accent) 20%, transparent)
    );
  border-radius: 12px;
  margin-bottom: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--rb-border);
  transition: 0.3s ease;

  &:hover {
    border-color: var(--rb-border-strong);
    transform: scale(1.02);
  }

  &::after {
    content: 'LIVE';
    position: absolute;
    top: 10px;
    left: 10px;
    background: #ff4b4b;
    color: var(--rb-text-inverse);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 900;
  }
`;
