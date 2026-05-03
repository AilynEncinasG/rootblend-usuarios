import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { FiRefreshCw } from "react-icons/fi";
import { getMyChannel, type Canal } from "../../streams/services/streamsService";

type CreatorRole = "streamer" | "podcaster";

function getChannelRole(channel?: Canal | null): CreatorRole | null {
  const role = channel?.tipo_canal?.nombre_tipo;
  return role === "streamer" || role === "podcaster" ? role : null;
}

function syncCreatorRole(role: CreatorRole | null) {
  if (role) {
    localStorage.setItem("creator_role", role);
  } else {
    localStorage.removeItem("creator_role");
  }

  window.dispatchEvent(new Event("creator-role-changed"));
}

function panelPath(role: CreatorRole | null) {
  if (role === "podcaster") return "/creator/podcaster";
  if (role === "streamer") return "/creator/streamer";
  return "/creator/activate";
}

export default function CreatorDashboardRedirectPage() {
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState("/creator/activate");

  useEffect(() => {
    let active = true;

    async function resolveDashboard() {
      setLoading(true);

      try {
        const result = await getMyChannel();

        if (!active) return;

        const role = getChannelRole(result.canal);
        syncCreatorRole(role);
        setTarget(panelPath(role));
      } catch (error) {
        console.error("CREATOR_DASHBOARD_REDIRECT_ERROR", error);
        if (active) {
          syncCreatorRole(null);
          setTarget("/creator/activate");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    resolveDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Page>
        <Card>
          <FiRefreshCw />
          <div>
            <strong>Resolviendo panel de creador</strong>
            <p>Consultando tu canal real en canales-streaming-service.</p>
          </div>
        </Card>
      </Page>
    );
  }

  return <Navigate to={target} replace />;
}

const Page = styled.main`
  min-height: calc(100vh - 64px);
  display: grid;
  place-items: center;
  padding: 28px;
  color: #f8fbff;
  background: linear-gradient(180deg, #020617, #030712);
`;

const Card = styled.div`
  width: min(520px, 100%);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 14px;
  color: #fde68a;
  background: rgba(202, 138, 4, 0.12);
  border: 1px solid rgba(202, 138, 4, 0.26);

  p {
    margin: 4px 0 0;
    color: rgba(226, 232, 240, 0.72);
  }
`;
