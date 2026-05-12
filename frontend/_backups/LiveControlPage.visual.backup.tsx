import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  ButtonRow,
  DangerButton,
  MetricGrid,
  PrimaryButton,
} from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import { StatCard } from "../../../public/utils/publicLegacyHelpers";
import {
  finishStream,
  getMyStreams,
  startStream,
  type Stream,
} from "../../../streams/services/streamsService";

function getCurrentStream(streams: Stream[]) {
  const savedId = Number(localStorage.getItem("rootblend_last_stream_id"));

  if (Number.isFinite(savedId) && savedId > 0) {
    const savedStream = streams.find((stream) => stream.id_stream === savedId);

    if (savedStream) {
      return savedStream;
    }
  }

  const liveStream = streams.find((stream) => stream.estado === "en_vivo");

  if (liveStream) {
    return liveStream;
  }

  const programmedStream = streams.find(
    (stream) => stream.estado === "programado"
  );

  if (programmedStream) {
    return programmedStream;
  }

  return streams[0] || null;
}

function getDurationLabel(stream: Stream | null) {
  if (!stream || stream.estado !== "en_vivo" || !stream.fecha_inicio) {
    return "00:00:00";
  }

  const start = new Date(stream.fecha_inicio).getTime();

  if (!Number.isFinite(start)) {
    return "00:00:00";
  }

  const diff = Math.max(0, Date.now() - start);
  const totalSeconds = Math.floor(diff / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export default function LiveControlPage() {
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const live = currentStream?.estado === "en_vivo";
  const finished = currentStream?.estado === "finalizado";

  const durationLabel = useMemo(
    () => getDurationLabel(currentStream),
    [currentStream]
  );

  async function loadStreams() {
    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const myStreams = await getMyStreams();
      const selectedStream = getCurrentStream(myStreams);

      setCurrentStream(selectedStream);

      if (!selectedStream) {
        setError(
          "No tienes streams creados. Primero guarda una configuración de stream."
        );
      }
    } catch (requestError) {
      console.error("LIVE_CONTROL_LOAD_STREAMS_ERROR", requestError);
      setError(
        "No se pudieron cargar tus streams. Revisa tu sesión y que el backend esté activo."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStreams();
  }, []);

  async function handleStart() {
    if (!currentStream) {
      setError("No hay un stream configurado para iniciar.");
      return;
    }

    if (currentStream.estado === "en_vivo") {
      setFeedback("Este stream ya está en vivo.");
      return;
    }

    if (currentStream.estado === "finalizado") {
      setError(
        "Este stream ya fue finalizado. Crea otro stream antes de iniciar una nueva transmisión."
      );
      return;
    }

    setActionLoading(true);
    setError("");
    setFeedback("");

    try {
      const updatedStream = await startStream(currentStream.id_stream);

      localStorage.setItem(
        "rootblend_last_stream_id",
        String(updatedStream.id_stream)
      );

      setCurrentStream(updatedStream);

      setFeedback(
        "Transmisión iniciada correctamente. El stream ahora debería aparecer en Inicio y Explorar."
      );
    } catch (requestError) {
      console.error("LIVE_CONTROL_START_ERROR", requestError);
      setError(
        "No se pudo iniciar la transmisión. Revisa que el stream esté programado y que tu sesión siga activa."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleFinish() {
    if (!currentStream) {
      setError("No hay un stream para finalizar.");
      return;
    }

    if (currentStream.estado !== "en_vivo") {
      setError("Solo puedes finalizar un stream que esté en vivo.");
      return;
    }

    setActionLoading(true);
    setError("");
    setFeedback("");

    try {
      const updatedStream = await finishStream(currentStream.id_stream);

      setCurrentStream(updatedStream);

      setFeedback("Transmisión finalizada correctamente.");
    } catch (requestError) {
      console.error("LIVE_CONTROL_FINISH_ERROR", requestError);
      setError(
        "No se pudo finalizar la transmisión. Revisa tu sesión y la conexión con el backend."
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <CreatorScreen
      title="Control de transmision"
      subtitle={
        live
          ? "El stream esta al aire."
          : "Configura tu stream y presiona iniciar."
      }
      image={brandAssets.streamControl}
    >
      {loading ? (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando streams</strong>
            <p>Buscando el ultimo stream configurado...</p>
          </div>
        </AlertPanel>
      ) : null}

      {error ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Atencion</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      ) : null}

      {feedback ? (
        <AlertPanel>
          <FiCheckCircle />
          <div>
            <strong>Actualizacion</strong>
            <p>{feedback}</p>
          </div>
        </AlertPanel>
      ) : null}

      <AlertPanel>
        {live ? <FiCheckCircle /> : <FiAlertTriangle />}
        <div>
          <strong>
            {live
              ? "Estas en vivo"
              : finished
                ? "Stream finalizado"
                : "Estas offline"}
          </strong>
          <p>
            {live
              ? "El chat y las estadisticas estan activos."
              : finished
                ? "Este stream ya termino. Crea otro para volver a transmitir."
                : currentStream
                  ? `Stream listo: ${currentStream.titulo}`
                  : "Configura el stream antes de iniciar."}
          </p>
        </div>
      </AlertPanel>

      <MetricGrid>
        <StatCard
          label="Espectadores"
          value={live ? String(currentStream?.viewer_count || 0) : "0"}
          trend="Ahora"
        />
        <StatCard label="Duracion" value={durationLabel} trend="Directo" />
        <StatCard
          label="Estado"
          value={currentStream?.estado || "sin stream"}
          trend={currentStream?.titulo || "Sin configuracion"}
        />
      </MetricGrid>

      <ButtonRow>
        <PrimaryButton
          type="button"
          onClick={handleStart}
          disabled={loading || actionLoading || !currentStream || live || finished}
        >
          {actionLoading ? "Procesando..." : "Iniciar transmision"}
        </PrimaryButton>

        <DangerButton
          type="button"
          onClick={handleFinish}
          disabled={loading || actionLoading || !currentStream || !live}
        >
          Finalizar stream
        </DangerButton>
      </ButtonRow>
    </CreatorScreen>
  );
}