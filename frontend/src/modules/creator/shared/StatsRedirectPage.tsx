import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMyChannel } from "../../streams/services/streamsService";

type CreatorRole = "streamer" | "podcaster";

function getCachedRole(): CreatorRole | null {
  const role = localStorage.getItem("creator_role");

  if (role === "streamer" || role === "podcaster") {
    return role;
  }

  return null;
}

function getRoleFromChannel(canal: unknown): CreatorRole | null {
  if (!canal || typeof canal !== "object") {
    return null;
  }

  const raw = canal as {
    tipo_canal?: string | {
      nombre_tipo?: string;
    };
  };

  if (typeof raw.tipo_canal === "string") {
    if (raw.tipo_canal === "streamer" || raw.tipo_canal === "podcaster") {
      return raw.tipo_canal;
    }

    return null;
  }

  const role = raw.tipo_canal?.nombre_tipo;

  if (role === "streamer" || role === "podcaster") {
    return role;
  }

  return null;
}

function syncCreatorRole(role: CreatorRole | null) {
  if (role) {
    localStorage.setItem("creator_role", role);
  } else {
    localStorage.removeItem("creator_role");
  }

  window.dispatchEvent(new Event("creator-role-changed"));
}

export default function StatsRedirectPage() {
  const cachedRole = getCachedRole();

  const [role, setRole] = useState<CreatorRole | null>(cachedRole);
  const [resolved, setResolved] = useState(Boolean(cachedRole));

  useEffect(() => {
    let active = true;

    async function loadChannel() {
      try {
        const result = await getMyChannel();

        if (!active) return;

        const backendRole = getRoleFromChannel(result.canal);

        syncCreatorRole(backendRole);
        setRole(backendRole);
      } catch (error) {
        console.error("STATS_REDIRECT_ERROR", error);

        if (!active) return;

        const fallbackRole = getCachedRole();

        setRole(fallbackRole);
      } finally {
        if (active) {
          setResolved(true);
        }
      }
    }

    if (!cachedRole) {
      loadChannel();
    }

    return () => {
      active = false;
    };
  }, [cachedRole]);

  if (!resolved) {
    return null;
  }

  if (!role) {
    return <Navigate to="/creator/activate" replace />;
  }

  return (
    <Navigate
      to={role === "streamer" ? "/creator/streamer/stats" : "/creator/podcaster/stats"}
      replace
    />
  );
}