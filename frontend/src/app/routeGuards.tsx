import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../modules/auth/utils/authStorage";

type GuardProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: GuardProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <>{children}</>;
}

export function AuthOnlyRoute({ children }: GuardProps) {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}