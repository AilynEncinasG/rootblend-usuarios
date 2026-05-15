import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiCopy,
  FiEye,
  FiPlay,
  FiRefreshCw,
  FiRotateCw,
  FiSquare,
  FiWifi,
  FiWifiOff,
} from "react-icons/fi";
import styled from "styled-components";

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
  getStreamObsConfig,
  rotateStreamKey,
  startStream,
  type Stream,
  type StreamObsConfig,
} from "../../../streams/services/streamsService";

type StreamExtras = {
  categoria?: {
    nombre?: string;
  };
  canal?: {
    nombre_canal?: string;
  };
  calidad_actual?: string | null;
  fecha_fin?: string | null;
  signal_status?: string | null;
  rtmp_url?: string | null;
  stream_key?: string | null;
  playback_url?: string | null;
};

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
    (stream) => stream.estado === "programado",
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
    "0",
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function getStatusText(stream: Stream | null) {
  if (!stream) return "sin stream";
  if (stream.estado === "en_vivo") return "en vivo";
  if (stream.estado === "finalizado") return "finalizado";
  return "programado";
}

function getSignalText(stream: Stream | null) {
  if (!stream) return "sin_señal";

  const extras = stream as Stream & StreamExtras;

  if (stream.estado === "en_vivo") {
    return extras.signal_status || "conectado";
  }

  return extras.signal_status || "sin_señal";
}

function formatDate(value?: string | null) {
  if (!value) return "No iniciado";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function copyText(value: string) {
  navigator.clipboard?.writeText(value).catch(() => {
    // No rompemos la pantalla si el navegador bloquea clipboard.
  });
}

export default function LiveControlPage() {
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [totalStreams, setTotalStreams] = useState(0);
  const [obsConfig, setObsConfig] = useState<StreamObsConfig | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const live = currentStream?.estado === "en_vivo";
  const finished = currentStream?.estado === "finalizado";
  const programmed = currentStream?.estado === "programado";

  const extras = currentStream as (Stream & StreamExtras) | null;

  const durationLabel = useMemo(
    () => getDurationLabel(currentStream),
    [currentStream],
  );

  const obsServer =
    obsConfig?.server || extras?.rtmp_url || "rtmp://localhost:1935/live";

  const streamKey =
    obsConfig?.stream_key || extras?.stream_key || "Cargando clave real...";

  const playbackUrl =
    obsConfig?.playback_url || extras?.playback_url || "No disponible";

  async function loadObsConfigForStream(stream: Stream | null) {
    if (!stream || stream.estado === "finalizado") {
      setObsConfig(null);
      return;
    }

    try {
      const config = await getStreamObsConfig(stream.id_stream);
      setObsConfig(config);
    } catch (requestError) {
      console.error("LIVE_CONTROL_OBS_CONFIG_ERROR", requestError);
      setObsConfig(null);
    }
  }

  async function loadStreams() {
    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const myStreams = await getMyStreams();
      const selectedStream = getCurrentStream(myStreams);

      setTotalStreams(myStreams.length);
      setCurrentStream(selectedStream);

      await loadObsConfigForStream(selectedStream);

      if (!selectedStream) {
        setError(
          "No tienes streams creados. Primero guarda una configuración de stream.",
        );
      }
    } catch (requestError) {
      console.error("LIVE_CONTROL_LOAD_STREAMS_ERROR", requestError);
      setError(
        "No se pudieron cargar tus streams. Revisa tu sesión y que el backend esté activo.",
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
        "Este stream ya fue finalizado. Crea otro stream antes de iniciar una nueva transmisión.",
      );
      return;
    }

    setActionLoading(true);
    setError("");
    setFeedback("");

    try {
      const updatedStream = await startStream(currentStream.id_stream);
      const config = await getStreamObsConfig(updatedStream.id_stream);

      localStorage.setItem(
        "rootblend_last_stream_id",
        String(updatedStream.id_stream),
      );

      setCurrentStream(updatedStream);
      setObsConfig(config);

      setFeedback(
        "Transmisión iniciada correctamente. Copia la clave real en OBS y presiona Iniciar transmisión en OBS.",
      );
    } catch (requestError) {
      console.error("LIVE_CONTROL_START_ERROR", requestError);
      setError(
        "No se pudo iniciar la transmisión. Revisa que el stream esté programado y que tu sesión siga activa.",
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
      setObsConfig(null);
      setFeedback("Transmisión finalizada correctamente.");
    } catch (requestError) {
      console.error("LIVE_CONTROL_FINISH_ERROR", requestError);
      setError(
        "No se pudo finalizar la transmisión. Revisa tu sesión y la conexión con el backend.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRotateKey() {
    if (!currentStream) {
      setError("No hay stream seleccionado para regenerar la clave.");
      return;
    }

    if (currentStream.estado === "en_vivo") {
      setError(
        "No puedes regenerar la clave mientras el stream está en vivo. Finaliza o crea otro stream.",
      );
      return;
    }

    if (currentStream.estado === "finalizado") {
      setError("No puedes regenerar la clave de un stream finalizado.");
      return;
    }

    setActionLoading(true);
    setError("");
    setFeedback("");

    try {
      const config = await rotateStreamKey(currentStream.id_stream);

      setObsConfig(config);
      setShowKey(true);
      setFeedback(
        "Clave OBS regenerada correctamente. Copia la nueva clave en OBS antes de transmitir.",
      );
    } catch (requestError) {
      console.error("LIVE_CONTROL_ROTATE_KEY_ERROR", requestError);
      setError(
        "No se pudo regenerar la clave. Revisa tu sesión o intenta nuevamente.",
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
      <PreviewPanel $live={live}>
        <PreviewIcon>{live ? <FiWifi /> : <FiWifiOff />}</PreviewIcon>
        <strong>
          {live
            ? "Transmisión en vivo"
            : finished
              ? "Stream finalizado"
              : programmed
                ? "Stream programado"
                : "Stream offline"}
        </strong>
        <span>
          {live
            ? "El directo está activo y visible para los viewers."
            : finished
              ? "Este directo ya terminó."
              : currentStream
                ? "El directo aún no fue iniciado."
                : "No hay stream seleccionado."}
        </span>

        <FakePlayerBar>
          <span>▶</span>
          <small>0:00</small>
          <span>🔇</span>
          <span>⛶</span>
          <span>⋮</span>
        </FakePlayerBar>
      </PreviewPanel>

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
          label="Estado"
          value={getStatusText(currentStream)}
          trend={live ? "Visible en plataforma" : "Backend real"}
        />
        <StatCard
          label="Señal OBS"
          value={getSignalText(currentStream)}
          trend={live ? "Conectado" : "Esperando"}
        />
        <StatCard
          label="Canal"
          value={extras?.canal?.nombre_canal || "ROOTBLEND"}
          trend="Propietario"
        />
        <StatCard
          label="Streams"
          value={String(totalStreams)}
          trend="Creados"
        />
      </MetricGrid>

      <InfoPanel>
        <PanelHeader>
          <strong>Configuracion OBS</strong>
          <SmallButton
            type="button"
            onClick={() => setShowKey((value) => !value)}
          >
            {showKey ? "Ocultar clave" : "Mostrar clave"}
          </SmallButton>
        </PanelHeader>

        <DataRow>
          <span>Servidor RTMP</span>
          <strong>{obsServer}</strong>
          <SmallButton type="button" onClick={() => copyText(obsServer)}>
            <FiCopy /> Copiar
          </SmallButton>
        </DataRow>

        <DataRow>
          <span>Clave</span>
          <strong>{showKey ? streamKey : "****************"}</strong>
          <SmallButton type="button" onClick={() => copyText(streamKey)}>
            <FiCopy /> Copiar
          </SmallButton>
        </DataRow>

        <DataRow>
          <span>Playback HLS</span>
          <strong>{playbackUrl}</strong>
          <SmallButton type="button" onClick={() => copyText(playbackUrl)}>
            <FiCopy /> Copiar
          </SmallButton>
        </DataRow>
      </InfoPanel>

      <InfoPanel>
        <PanelHeader>
          <strong>Datos del stream</strong>

          {currentStream ? (
            <SmallLink href={`/streams/${currentStream.id_stream}`}>
              <FiEye /> Ver publico
            </SmallLink>
          ) : null}
        </PanelHeader>

        <DataRowSimple>
          <span>Titulo</span>
          <strong>{currentStream?.titulo || "Sin stream"}</strong>
        </DataRowSimple>

        <DataRowSimple>
          <span>Categoria</span>
          <strong>{extras?.categoria?.nombre || "Sin categoria"}</strong>
        </DataRowSimple>

        <DataRowSimple>
          <span>Estado</span>
          <strong>{getStatusText(currentStream)}</strong>
        </DataRowSimple>

        <DataRowSimple>
          <span>Calidad</span>
          <strong>{extras?.calidad_actual || "720p"}</strong>
        </DataRowSimple>

        <DataRowSimple>
          <span>Inicio</span>
          <strong>{formatDate(currentStream?.fecha_inicio)}</strong>
        </DataRowSimple>

        <DataRowSimple>
          <span>Fin</span>
          <strong>{formatDate(extras?.fecha_fin)}</strong>
        </DataRowSimple>

        <DataRowSimple>
          <span>Duracion</span>
          <strong>{durationLabel}</strong>
        </DataRowSimple>
      </InfoPanel>

      <ButtonRow>
        {finished ? (
          <PrimaryButton
            type="button"
            onClick={() => {
              window.location.href = "/creator/streamer/create-stream";
            }}
          >
            <FiPlay />
            Crear otro stream
          </PrimaryButton>
        ) : (
          <PrimaryButton
            type="button"
            onClick={handleStart}
            disabled={loading || actionLoading || !currentStream || live}
          >
            <FiPlay />
            {actionLoading ? "Procesando..." : "Iniciar transmision"}
          </PrimaryButton>
        )}

        <DangerButton
          type="button"
          onClick={handleFinish}
          disabled={loading || actionLoading || !currentStream || !live}
        >
          <FiSquare />
          Finalizar stream
        </DangerButton>

        <SmallButton type="button" onClick={loadStreams} disabled={loading}>
          <FiRefreshCw />
          Actualizar
        </SmallButton>

        <SmallButton
          type="button"
          onClick={handleRotateKey}
          disabled={!currentStream || live || finished || actionLoading}
        >
          <FiRotateCw />
          Regenerar clave
        </SmallButton>
      </ButtonRow>
    </CreatorScreen>
  );
}

const PreviewPanel = styled.div<{ $live: boolean }>`
  min-height: 260px;
  border-radius: 18px;
  border: 1px solid rgba(0, 229, 255, 0.18);
  background:
    linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.78),
      rgba(2, 6, 23, 0.95)
    ),
    radial-gradient(
      circle at top,
      rgba(0, 229, 255, ${({ $live }) => ($live ? "0.16" : "0.05")}),
      transparent 40%
    );
  display: grid;
  place-items: center;
  text-align: center;
  position: relative;
  padding: 32px;
  margin-bottom: 14px;

  strong {
    color: #f8fafc;
    font-size: 1.2rem;
  }

  span {
    color: #94a3b8;
    margin-top: 6px;
  }
`;

const PreviewIcon = styled.div`
  color: #00e5ff;
  font-size: 30px;
  margin-bottom: 8px;
`;

const FakePlayerBar = styled.div`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.16);
  padding-top: 9px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;

  small {
    margin-right: auto;
  }
`;

const InfoPanel = styled.section`
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.72);
  padding: 16px;
  margin-top: 14px;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  strong {
    color: #f8fafc;
  }
`;

const DataRow = styled.div`
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 7px 0;

  span {
    color: #94a3b8;
  }

  strong {
    color: #f8fafc;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const DataRowSimple = styled.div`
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 7px 0;

  span {
    color: #94a3b8;
  }

  strong {
    color: #f8fafc;
  }
`;

const SmallButton = styled.button`
  border: 1px solid rgba(0, 229, 255, 0.35);
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.42);
  color: #f8fafc;
  padding: 8px 10px;
  font: inherit;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const SmallLink = styled.a`
  border: 1px solid rgba(0, 229, 255, 0.35);
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.42);
  color: #00e5ff;
  padding: 8px 10px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
`;