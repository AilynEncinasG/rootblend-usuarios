import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Link } from "react-router-dom";
import fondoImage from "../assets/Fondo.png"; // Ajusta la ruta según tu carpeta

export const GlobalStyle = createGlobalStyle`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { width: 100%; height: 100%; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; color: #ffffff; background: #000; }
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
    background-image: url(${fondoImage}); 
    background-size: cover; 
    background-position: center;
    background-attachment: fixed;
    &::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); z-index: 0; }
`;

// --- Componentes del Logo ---
export const LogoContainer = styled.div` 
    text-align: center;
    margin-bottom: 40px;
    animation: ${float} 5s ease-in-out infinite;
    z-index: 1;
    width: auto;
    max-width: 100%;`;
export const LogoText = styled.h1` font-size: clamp(2rem, 5vw, 4.5rem); 
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -2px;
    line-height: 1;
    background: linear-gradient(to bottom, #ffffff 30%, #4FACFE 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 25px rgba(0, 242, 254, 0.4));
    white-space: normal;
    overflow: visible;
    text-overflow: clip;`;
export const Subtitle = styled.p` 
    color: #04ff58; 
    font-size: 0.75rem; 
    font-weight: 800; 
    letter-spacing: 5px; 
    margin-top: 10px;
`;

// --- Navegación ---
export const NavContainer = styled.div` 
    display: flex; 
    background: rgba(255, 255, 255, 0.03); 
    padding: 5px; 
    border-radius: 16px; 
    border: 1px solid rgba(255, 255, 255, 0.08); 
    margin-bottom: 30px; 
    backdrop-filter: blur(10px); 
    z-index: 1; 
`;
export const NavTab = styled(Link)<{ $active?: boolean }>`
    text-decoration: none; 
    padding: 10px 25px; 
    border-radius: 12px; 
    font-size: 0.8rem; 
    font-weight: 700; 
    transition: 0.3s;
    color: ${props => props.$active ? '#000' : 'rgba(255,255,255,0.5)'};
    background: ${props => props.$active ? '#00f2fe' : 'transparent'};
`;

// --- UI Components (Inputs, Card, Button) ---
export const Card = styled.div`
    width: 100%; 
    max-width: 380px; 
    background: rgba(15, 15, 25, 0.6); 
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.1); 
    border-radius: 28px; 
    padding: 40px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
`;

export const InputGroup = styled.div` 
    position: relative; 
    margin-bottom: 20px; 
`;

export const Input = styled.input`
    width: 100%; 
    padding: 16px 16px 16px 45px; 
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1); 
    border-radius: 14px; 
    color: #fff; 
    outline: none; 
    transition: 0.3s;
    &:focus { border-color: #00f2fe; background: rgba(255, 255, 255, 0.08); }
`;

export const Button = styled.button`
    width: 100%; 
    padding: 16px; 
    border: none; 
    border-radius: 14px; 
    background: linear-gradient(90deg, #4FACFE, #00f2fe);
    color: #03040a; 
    font-weight: 800; 
    font-size: 0.95rem; 
    cursor: pointer;
    display: flex; 
    align-items: center;
    justify-content: center; 
    gap: 8px; 
    transition: 0.3s;
    &:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 10px 25px rgba(0, 242, 254, 0.3); }
`;

export const DashboardLayout = styled.div`
  display: grid;
  grid-template-areas: 
    "nav nav"
    "sidebar main";
  grid-template-columns: 260px 1fr;
  grid-template-rows: 70px 1fr;
  height: 100vh;
  background: #0a0a0f;
  color: white;
`;

export const StyledNavbar = styled.nav`
  grid-area: nav;
  background: #0f0f1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 10;
`;
export const LogoImage = styled.img`
  height: 40px; /* Ajusta la altura según lo necesites para que quepa bien en la Navbar */
  width: auto;  /* Mantiene la relación de aspecto de la imagen */
  display: block; /* Elimina espacio en blanco no deseado debajo de la imagen */
  cursor: pointer;
  
  /* Opcional: añade un ligero filtro o efecto si quieres que resalte */
  /* filter: drop-shadow(0 0 5px rgba(0, 242, 254, 0.5)); */
`;
export const StyledSidebar = styled.aside`
  grid-area: sidebar;
  background: #12121e;
  padding: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
`;

export const ChannelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.05); }
`;

export const Avatar = styled.div<{ $online?: boolean }>`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #2a2a40;
  position: relative;
  border: 2px solid ${props => props.$online ? '#04ff58' : 'transparent'};
`;

export const StreamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

export const SearchBar = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 400px;
  input {
    background: transparent; border: none; color: white; outline: none; width: 100%;
  }
`;

export const Thumbnail = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(45deg, #1a1a2e, #00f2fe33);
  border-radius: 12px;
  margin-bottom: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: 0.3s ease;

  &:hover {
    border-color: #00f2fe;
    transform: scale(1.02);
  }

  &::after {
    content: 'LIVE';
    position: absolute;
    top: 10px;
    left: 10px;
    background: #ff4b4b;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 900;
  }
`;