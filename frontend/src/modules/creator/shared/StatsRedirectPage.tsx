import { Navigate } from "react-router-dom";

export default function StatsRedirectPage() {
  const role = localStorage.getItem("creator_role");

  if (role === "podcaster") {
    return <Navigate to="/creator/podcaster/stats" replace />;
  }

  if (role === "streamer") {
    return <Navigate to="/creator/streamer/stats" replace />;
  }

  return <Navigate to="/creator/activate" replace />;
}