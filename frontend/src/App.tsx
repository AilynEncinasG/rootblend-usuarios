// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import {
  GlobalStyle,
  MainWrapper,
  LogoContainer,
  LogoText,
  Subtitle,
  NavContainer,
  NavTab,
} from "./styles/GlobalStyles";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

const AppContent = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (!isAuthPage) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    );
  }

  return (
    <MainWrapper>
      <LogoContainer>
        <LogoText>ROOTBLEND</LogoText>
        <Subtitle>USER PORTAL</Subtitle>
      </LogoContainer>

      <NavContainer>
        <NavTab to="/login" $active={location.pathname === "/login"}>
          LOG IN
        </NavTab>
        <NavTab to="/register" $active={location.pathname === "/register"}>
          SIGN UP
        </NavTab>
      </NavContainer>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
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