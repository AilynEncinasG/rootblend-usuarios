import { useEffect, useState } from "react";
import { FiAlertTriangle, FiClock, FiRefreshCw } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  NotificationRow,
  Panel,
  PanelHeader,
  ServicePill,
  StateIcon,
  StatePanel,
} from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import {
  getPodcasterHistory,
  type PodcastHistoryItem,
} from "../services/podcasterCreatorService";

export default function PodcastHistoryPage() {
  const [history, setHistory] = useState<PodcastHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      setLoading(true);
      setError("");

      try {
        const items = await getPodcasterHistory();

        if (active) {
          setHistory(items);
        }
      } catch (loadError) {
        console.error("PODCAST_HISTORY_ERROR", loadError);

        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el historial.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  return (
    <CreatorScreen
      title="Historial del podcast"
      subtitle="Actividad real: creación, edición, episodios y reproducciones."
      image={brandAssets.podcastStats}
    >
      {loading ? (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando historial</strong>
            <p>Consultando podcasts-service...</p>
          </div>
        </AlertPanel>
      ) : null}

      {error ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      ) : null}

      <Panel>
        <PanelHeader>
          <strong>Actividad reciente</strong>
          <ServicePill $status="Operativo">{history.length} eventos</ServicePill>
        </PanelHeader>

        {history.length > 0 ? (
          history.map((item) => (
            <NotificationRow key={item.id} $accent="#00e5ff">
              <FiClock />
              <div>
                <strong>{item.accion || item.action}</strong>
                <small>
                  {item.detalle || item.detail || "Sin detalle"} · {item.createdAt || item.fecha_registro || "Sin fecha"}
                </small>
              </div>
            </NotificationRow>
          ))
        ) : (
          <StatePanel>
            <StateIcon>
              <FiClock />
            </StateIcon>
            <h2>No hay historial todavía</h2>
            <p>Crea o edita podcasts y episodios para generar historial.</p>
          </StatePanel>
        )}
      </Panel>
    </CreatorScreen>
  );
}
