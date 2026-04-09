// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { GlobalStyle, MainWrapper, LogoContainer, LogoText, Subtitle, NavContainer, NavTab } from "./styles/GlobalStyles";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const AppContent = () => {
  const location = useLocation();

  return (
    <MainWrapper>
      <LogoContainer>
        <LogoText>ROOTBLEND</LogoText>
        <Subtitle>PORTAL DEL USUARIO</Subtitle>
      </LogoContainer>

      <NavContainer>
        <NavTab to="/" $active={location.pathname === "/"}>INICIO</NavTab>
        <NavTab to="/register" $active={location.pathname === "/register"}>REGISTRARSE</NavTab>
      </NavContainer>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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