import { Navigate } from "react-router-dom";

import { getCreatorRole } from "../services/creatorRoleService";

export default function StatsRedirectPage() {
  const role = getCreatorRole();

  if (role === "podcaster") {
    return <Navigate to="/creator/podcaster/stats" replace />;
  }

  if (role === "streamer") {
    return <Navigate to="/creator/streamer/stats" replace />;
  }

  return <Navigate to="/creator/activate" replace />;
}