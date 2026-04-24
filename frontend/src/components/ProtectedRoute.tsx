import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken, hasSession, refreshAccessToken } from "../services/authService";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      if (!hasSession()) {
        setAllowed(false);
        setChecking(false);
        return;
      }

      const accessToken = getAccessToken();

      if (accessToken) {
        setAllowed(true);
        setChecking(false);
        return;
      }

      const refreshed = await refreshAccessToken();
      setAllowed(refreshed);
      setChecking(false);
    };

    validateSession();
  }, []);

  if (checking) {
    return <p style={{ color: "white", padding: "20px" }}>Validando sesión...</p>;
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;