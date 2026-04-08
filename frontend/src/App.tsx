import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FiUser, FiLock, FiUserPlus, FiChevronRight } from "react-icons/fi";
import fondoImage from "./assets/Fondo.png"; 
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

  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #ffffff;
    /* Quitamos el fondo negro fijo para que no tape nada */
    background: #000; 
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// 3. COMPONENTES
const MainWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  position: relative;

  /* AGREGAMOS LA IMAGEN AQUÍ */
  background-image: url(${fondoImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;

  /* Opcional: una capa oscura para que el texto resalte más */
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4); 
    z-index: 0;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${float} 5s ease-in-out infinite;
  z-index: 1;
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
  color: #04ff58;
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