import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
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
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import CreatorActivatePage from "./pages/CreatorActivatePage";
import CreatorDashboardPage from "./pages/CreatorDashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";
import FirebaseChatTest from "./components/FirebaseChatTest";
import { isAuthenticated } from "./utils/authStorage";

function AuthOnlyRoute({ children }: { children: React.ReactNode }) {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AuthLayout() {
  const location = useLocation();

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
        <Route
          path="/login"
          element={
            <AuthOnlyRoute>
              <LoginPage />
            </AuthOnlyRoute>
          }
        />

        <Route
          path="/register"
          element={
            <AuthOnlyRoute>
              <RegisterPage />
            </AuthOnlyRoute>
          }
        />
      </Routes>
    </MainWrapper>
  );
}

function AppRoutes() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return <AuthLayout />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/chat-test" element={<FirebaseChatTest />} />

      <Route
        path="/creator/activate"
        element={
          <ProtectedRoute>
            <CreatorActivatePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/creator/dashboard"
        element={
          <ProtectedRoute>
            <CreatorDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppRoutes />
    </Router>
  );
}