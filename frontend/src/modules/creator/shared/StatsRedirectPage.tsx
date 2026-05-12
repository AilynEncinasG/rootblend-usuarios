import { Navigate } from "react-router-dom";
import { getCreatorRole } from "../../../shared/utils/rootblendHelpers";
export default function StatsRedirectPage() {
  const role = getCreatorRole() || "streamer";
  return <Navigate to={role === "podcaster" ? "/creator/podcaster/stats" : "/creator/streamer/stats"} replace />;
}
