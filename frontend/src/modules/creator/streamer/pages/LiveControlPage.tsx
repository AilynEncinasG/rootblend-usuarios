import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiAlertTriangle, FiCheckCircle, FiLock, FiPlus, FiRadio, FiRefreshCw } from "react-icons/fi";
import {
  finishStream,
  getAllStreams,
  getMyChannel,
  startStream,
  type Canal,
  type Stream,
} from "../../../streams/services/streamsService";

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

export default function LiveControlPage() {
  const [channel, setChannel] = useState<Canal | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreamId, setSelectedStreamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadControlData() {
    setLoading(true);
    setError("");

    try {
      const [channelResult, streamsResult] = await Promise.all([
        getMyChannel(),
        getAllStreams(),
      ]);

      const currentChannel = channelResult.canal;
      setChannel(currentChannel);

      if (!channelResult.tiene_canal || !currentChannel) {
        setStreams([]);
        setSelectedStreamId(null);
        syncCreatorRole(null);
        return;
      }

      syncCreatorRole(getChannelRole(currentChannel));

      const ownedStreams = streamsResult.filter(
        (stream) => stream.canal.id_canal === currentChannel.id_canal
      );

      setStreams(ownedStreams);

      const selected =
        ownedStreams.find((stream) => stream.estado === "en_vivo") ||
        ownedStreams.find((stream) => stream.estado === "programado") ||
        ownedStreams[0] ||
        null;

      setSelectedStreamId(selected?.id_stream || null);
    } catch (error) {
      console.error("LIVE_CONTROL_LOAD_ERROR", error);
      setError(error instanceof Error ? error.message : "No se pudo cargar el control de transmision.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadControlData();
  }, []);

  const selectedStream = streams.find((stream) => stream.id_stream === selectedStreamId) || null;
  const isLive = selectedStream?.estado === "en_vivo";
  const isProgrammed = selectedStream?.estado === "programado";

  async function handleStart() {
    if (!selectedStream) {
      setError("Primero debes crear o seleccionar un stream programado.");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await startStream(selectedStream.id_stream);
      setSuccessMessage("Transmision iniciada correctamente. Ya debe aparecer en Home y /streams.");
      await loadControlData();
    } catch (error) {
      console.error("START_STREAM_ERROR", error);
      setError(error instanceof Error ? error.message : "No se pudo iniciar la transmision.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleFinish() {
    if (!selectedStream) {
      setError("No hay stream seleccionado.");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await finishStream(selectedStream.id_stream);
      setSuccessMessage("Stream finalizado correctamente. Ya no debe aparecer como en vivo.");
      await loadControlData();
    } catch (error) {
      console.error("FINISH_STREAM_ERROR", error);
      setError(error instanceof Error ? error.message : "No se pudo finalizar el stream.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <Page>
      <Header>
        <span>Streamer</span>
        <h1>Control de transmision</h1>
        <p>
          Inicia o finaliza tus streams reales. Cuando inicies uno, aparecera en Home y en /streams.
        </p>
      </Header>

      {loading && (
        <Alert>
          <FiRefreshCw />
          <div>
            <strong>Cargando control</strong>
            <p>Consultando tu canal y tus streams reales.</p>
          </div>
        </Alert>
      )}

      {error && (
        <Alert $danger>
          <FiAlertTriangle />
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </Alert>
      )}

      {successMessage && (
        <Success>
          <FiCheckCircle /> {successMessage}
        </Success>
      )}

      {!channel && !loading && (
        <Alert>
          <FiLock />
          <div>
            <strong>No tienes canal activo</strong>
            <p>Activa primero tu canal de creador para iniciar transmisiones.</p>
          </div>
          <PrimaryLink to="/creator/activate">Activar canal</PrimaryLink>
        </Alert>
      )}

      {channel && streams.length === 0 && !loading && (
        <Alert>
          <FiRadio />
          <div>
            <strong>No tienes streams creados</strong>
            <p>Crea un stream programado antes de iniciar transmision.</p>
          </div>
          <PrimaryLink to="/creator/streamer/create-stream">Crear stream</PrimaryLink>
        </Alert>
      )}

      {streams.length > 0 && (
        <Card>
          <Label>Stream seleccionado</Label>
          <Select
            value={selectedStreamId || ""}
            disabled={actionLoading}
            onChange={(event) => setSelectedStreamId(Number(event.target.value))}
          >
            {streams.map((stream) => (
              <option key={stream.id_stream} value={stream.id_stream}>
                #{stream.id_stream} - {stream.titulo} ({stream.estado})
              </option>
            ))}
          </Select>

          <Status $live={Boolean(isLive)}>
            {isLive ? <FiCheckCircle /> : <FiAlertTriangle />}
            <div>
              <strong>{isLive ? "Estas en vivo" : "Estas offline"}</strong>
              <p>
                {isLive
                  ? "El stream esta activo y debe aparecer en Home y /streams."
                  : isProgrammed
                    ? "Este stream esta programado. Puedes iniciarlo cuando quieras."
                    : "Selecciona o crea un stream programado."}
              </p>
            </div>
          </Status>

          <MetricGrid>
            <MetricCard>
              <span>Estado</span>
              <strong>{selectedStream?.estado || "sin stream"}</strong>
              <small>Backend real</small>
            </MetricCard>
            <MetricCard>
              <span>Canal</span>
              <strong>{channel?.nombre_canal || "sin canal"}</strong>
              <small>Propietario</small>
            </MetricCard>
            <MetricCard>
              <span>Streams</span>
              <strong>{streams.length}</strong>
              <small>Creados</small>
            </MetricCard>
          </MetricGrid>

          {selectedStream && (
            <InfoPanel>
              <PanelHeader>
                <strong>Datos del stream</strong>
                <Link to={`/streams/${selectedStream.id_stream}`}>Ver publico</Link>
              </PanelHeader>

              <TwoCol>
                <span>Titulo</span>
                <strong>{selectedStream.titulo}</strong>

                <span>Categoria</span>
                <strong>{selectedStream.categoria.nombre}</strong>

                <span>Estado</span>
                <strong>{selectedStream.estado}</strong>

                <span>Inicio</span>
                <strong>{selectedStream.fecha_inicio || "No iniciado"}</strong>

                <span>Fin</span>
                <strong>{selectedStream.fecha_fin || "Sin finalizar"}</strong>
              </TwoCol>
            </InfoPanel>
          )}

          <Actions>
            <PrimaryButton type="button" onClick={handleStart} disabled={!selectedStream || isLive || actionLoading || loading}>
              {actionLoading ? "Procesando..." : "Iniciar transmision"}
            </PrimaryButton>
            <DangerButton type="button" onClick={handleFinish} disabled={!selectedStream || !isLive || actionLoading || loading}>
              Finalizar stream
            </DangerButton>
            <GhostLink to="/creator/streamer/create-stream">
              <FiPlus /> Crear otro stream
            </GhostLink>
          </Actions>
        </Card>
      )}
    </Page>
  );
}

const Page = styled.main`
  min-height: calc(100vh - 64px);
  padding: 28px;
  color: #f8fbff;
  background: linear-gradient(180deg, #020617, #030712);
`;

const Header = styled.div`
  width: min(900px, 100%);
  margin: 0 auto 22px;

  span {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 950;
    text-transform: uppercase;
  }

  h1 {
    margin: 8px 0;
    font-size: clamp(30px, 4vw, 46px);
  }

  p {
    margin: 0;
    color: rgba(226, 232, 240, 0.7);
    line-height: 1.6;
  }
`;

const Card = styled.section`
  width: min(900px, 100%);
  margin: 0 auto;
  padding: 22px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.14);
`;

const Alert = styled.div<{ $danger?: boolean }>`
  width: min(900px, 100%);
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 12px;
  color: ${({ $danger }) => ($danger ? "#fecdd3" : "#fde68a")};
  background: ${({ $danger }) => ($danger ? "rgba(127, 29, 29, 0.2)" : "rgba(202, 138, 4, 0.12)")};
  border: 1px solid ${({ $danger }) => ($danger ? "rgba(248, 113, 113, 0.28)" : "rgba(202, 138, 4, 0.26)")};

  p {
    margin: 4px 0 0;
    color: rgba(226, 232, 240, 0.72);
  }
`;

const Success = styled.div`
  width: min(900px, 100%);
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  color: #86efac;
  background: rgba(22, 163, 74, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.24);
`;

const Label = styled.label`
  display: block;
  margin: 12px 0 7px;
  color: rgba(226, 232, 240, 0.82);
  font-size: 12px;
  font-weight: 850;
`;

const Select = styled.select`
  width: 100%;
  min-height: 44px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  color: #fff;
  background: rgba(2, 6, 23, 0.92);
  padding: 0 12px;
`;

const Status = styled.div<{ $live: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 16px 0;
  padding: 14px;
  border-radius: 12px;
  color: ${({ $live }) => ($live ? "#86efac" : "#fde68a")};
  background: ${({ $live }) => ($live ? "rgba(22, 163, 74, 0.12)" : "rgba(202, 138, 4, 0.12)")};
  border: 1px solid ${({ $live }) => ($live ? "rgba(34, 197, 94, 0.24)" : "rgba(202, 138, 4, 0.26)")};

  p {
    margin: 4px 0 0;
    color: rgba(226, 232, 240, 0.72);
  }
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
`;

const MetricCard = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: rgba(2, 6, 23, 0.62);
  border: 1px solid rgba(148, 163, 184, 0.12);

  span,
  small {
    color: rgba(226, 232, 240, 0.64);
    font-size: 12px;
  }

  strong {
    display: block;
    margin: 6px 0 3px;
    font-size: 22px;
  }

  small {
    color: #22c55e;
    font-weight: 850;
  }
`;

const InfoPanel = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(2, 6, 23, 0.52);
  border: 1px solid rgba(148, 163, 184, 0.12);
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  a {
    color: #00e5ff;
    font-size: 12px;
    font-weight: 850;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px 16px;

  span {
    color: rgba(226, 232, 240, 0.6);
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 18px;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  color: #03111c;
  background: linear-gradient(135deg, #00e5ff, #22c55e);
  font-weight: 950;
  cursor: pointer;
`;

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fecdd3;
  background: rgba(127, 29, 29, 0.24);
  font-weight: 850;
  cursor: pointer;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  color: #03111c;
  background: linear-gradient(135deg, #00e5ff, #22c55e);
  font-weight: 950;
`;

const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid rgba(0, 229, 255, 0.28);
  color: #e8fbff;
  background: rgba(15, 23, 42, 0.7);
  font-weight: 850;
`;
