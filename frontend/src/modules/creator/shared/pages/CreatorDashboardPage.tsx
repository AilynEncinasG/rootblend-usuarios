import { Navigate } from "react-router-dom";
import {
  getCreatorDashboardPath,
  getCreatorRole,
} from "../services/creatorRoleService";

export default function CreatorDashboardPage() {
  const role = getCreatorRole();

  if (!role) {
    return <Navigate to="/creator/activate" replace />;
  }

  return <Navigate to={getCreatorDashboardPath(role)} replace />;
}