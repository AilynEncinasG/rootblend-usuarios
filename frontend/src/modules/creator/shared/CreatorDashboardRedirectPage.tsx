import { Navigate } from "react-router-dom";
import { getCreatorRole } from "../../../shared/utils/rootblendHelpers";
export default function CreatorDashboardPage() {
  const role = getCreatorRole() || "streamer";
  return <Navigate to={role === "podcaster" ? "/creator/podcaster" : "/creator/streamer"} replace />;
}
