import { useEffect, useState } from "react";
import { FiActivity, FiRefreshCw } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  CardGrid,
  ChartPanel,
  GhostButton,
  MetricGrid,
} from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import {
  Section,
  StatCard,
  StreamCard,
} from "../../../public/utils/publicLegacyHelpers";
import { backendStreamToCard } from "../../../../shared/utils/rootblendHelpers";
import { getMyStreams, type Stream } from "../../../streams/services/streamsService";
import { getStreamStats, type StreamStats } from "../../../streams/services/streamStatsService";

function formatDuration(seconds: number) {
  if (!seconds) return "0 min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }

  return `${minutes} min`;
}

export default function StreamStatsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStats, setSelectedStats] = useState<StreamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStats() {
    setLoading(true);
    setError("");

    try {
      const myStreams = await getMyStreams();
      setStreams(myStreams);

      const selected =
        myStreams.find((item) => item.estado === "en_vivo") || myStreams[0];

      if (selected) {
        const stats = await getStreamStats(selected.id_stream);
        setSelectedStats(stats);
      } else {
        setSelectedStats(null);
      }
    } catch (requestError) {
      console.error("STREAM_STATS_LOAD_ERROR", requestError);
      setError("No se pudieron cargar las estadísticas reales del stream.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const metricItems = [
    {
      label: "Vistas totales",
      value: String(selectedStats?.total_vistas || 0),
      trend: "Registradas por entradas al directo",
    },
    {
      label: "Pico de espectadores",
      value: String(selectedStats?.espectadores_pico || 0),
      trend: "Máximo simultáneo detectado",
    },
    {
      label: "Duración",
      value: formatDuration(selectedStats?.duracion_segundos || 0),
      trend: "Calculada al finalizar el stream",
    },
    {
      label: "Mensajes de chat",
      value: String(selectedStats?.chat.total_mensajes || 0),
      trend: `${selectedStats?.chat.mensajes_eliminados || 0} eliminados`,
    },
  ];

  return (
    <CreatorScreen
      title="Estadísticas de stream"
      subtitle="Vistas, duración y actividad del chat desde estadisticas-service."
      image={brandAssets.streamerPanel}
    >
      {loading && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando estadísticas</strong>
            <p>Consultando rootblend_estadisticas.</p>
          </div>
        </AlertPanel>
      )}

      {error && (
        <AlertPanel>
          <FiActivity />
          <div>
            <strong>Estadísticas no disponibles</strong>
            <p>{error}</p>
          </div>
          <GhostButton type="button" onClick={loadStats}>
            Reintentar
          </GhostButton>
        </AlertPanel>
      )}

      <MetricGrid>
        {metricItems.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </MetricGrid>

      <ChartPanel>
        <span />
      </ChartPanel>

      <Section title="Streams recientes">
        <CardGrid>
          {streams.slice(0, 3).map((stream) => (
            <StreamCard key={stream.id_stream} stream={backendStreamToCard(stream)} />
          ))}
        </CardGrid>
      </Section>
    </CreatorScreen>
  );
}
