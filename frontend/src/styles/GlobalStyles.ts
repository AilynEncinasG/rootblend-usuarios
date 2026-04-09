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