import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FiUser, FiLock, FiUserPlus, FiChevronRight } from "react-icons/fi";

// 1. Tipado
interface NavItemProps {
  $active?: boolean;
}

// 2. RESET TOTAL (Aquí eliminamos las líneas blancas de raíz)
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Forzamos a que ningún contenedor padre tenga scroll o márgenes */
  html, body, #root {
    width: 100%;
    max-width: 100vw;
    height: 100%;
    overflow-x: hidden; 
    background-color: #03040a;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #ffffff;
    /* Fondo con luces suaves */
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(0, 242, 254, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
    background-attachment: fixed;
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// 3. COMPONENTES
const MainWrapper = styled.main`
  /* Centrado absoluto */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  /* Esto asegura que si algo se sale, no empuje el borde */
  position: relative; 
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${float} 5s ease-in-out infinite;
  z-index: 10;
`;

const LogoText = styled.h1`
  /* Tamaño responsivo inteligente */
  font-size: clamp(2.2rem, 8vw, 4.5rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -2px;
  line-height: 1;
  background: linear-gradient(to bottom, #ffffff 30%, #4FACFE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 25px rgba(0, 242, 254, 0.4));
`;

const Subtitle = styled.p`
  color: #ff00ff;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 5px;
  margin-top: 10px;
  opacity: 0.8;
`;

const NavContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  padding: 5px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
`;

const NavTab = styled(Link)<NavItemProps>`
  text-decoration: none;
  padding: 10px 25px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  transition: all 0.3s ease;
  color: ${props => props.$active ? '#000' : 'rgba(255,255,255,0.5)'};
  background: ${props => props.$active ? '#00f2fe' : 'transparent'};
  box-shadow: ${props => props.$active ? '0 0 20px rgba(0, 242, 254, 0.3)' : 'none'};

  &:hover {
    color: ${props => props.$active ? '#000' : '#fff'};
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 380px;
  background: rgba(15, 15, 25, 0.6);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 40px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 16px 16px 45px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #fff;
  outline: none;
  transition: 0.3s;

  &:focus {
    border-color: #00f2fe;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Button = styled.button`
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

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
    box-shadow: 0 10px 25px rgba(0, 242, 254, 0.3);
  }
`;

// 4. LÓGICA
const AppContent = () => {
  const location = useLocation();

  return (
    <MainWrapper>
      <LogoContainer>
        <LogoText>ROOTBLEND</LogoText>
        <Subtitle>USER PORTAL</Subtitle>
      </LogoContainer>

      <NavContainer>
        <NavTab to="/" $active={location.pathname === "/"}>LOG IN</NavTab>
        <NavTab to="/register" $active={location.pathname === "/register"}>SIGN UP</NavTab>
      </NavContainer>

      <Routes>
        <Route path="/" element={
          <Card>
            <InputGroup>
              <FiUser style={{ position: 'absolute', left: 15, top: 18, color: '#00f2fe' }} />
              <Input type="text" placeholder="Email o Usuario" />
            </InputGroup>
            <InputGroup>
              <FiLock style={{ position: 'absolute', left: 15, top: 18, color: '#00f2fe' }} />
              <Input type="password" placeholder="Contraseña" />
            </InputGroup>
            <Button>ENTRAR <FiChevronRight /></Button>
          </Card>
        } />
        <Route path="/register" element={
          <Card>
            <InputGroup>
              <FiUser style={{ position: 'absolute', left: 15, top: 18, color: '#00f2fe' }} />
              <Input type="text" placeholder="Nombre completo" />
            </InputGroup>
            <InputGroup>
              <FiLock style={{ position: 'absolute', left: 15, top: 18, color: '#00f2fe' }} />
              <Input type="password" placeholder="Crear contraseña" />
            </InputGroup>
            <Button>REGISTRARSE <FiUserPlus /></Button>
          </Card>
        } />
      </Routes>
    </MainWrapper>
  );
};

export default function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContent />
    </Router>
  );
}