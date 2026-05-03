import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RootShell } from "../../mock/RootblendScreens";
import { FiAlertTriangle, FiCheckCircle, FiLock, FiMic, FiRadio, FiRefreshCw, FiSave } from "react-icons/fi";
import {
  activateChannel,
  getMyChannel,
  type Canal,
} from "../../streams/services/streamsService";

type CreatorRole = "streamer" | "podcaster";

function getChannelRole(channel?: Canal | null): CreatorRole | null {
  const role = channel?.tipo_canal?.nombre_tipo;
  return role === "streamer" || role === "podcaster" ? role : null;
}

function panelPath(role: CreatorRole | null) {
  if (role === "podcaster") return "/creator/podcaster";
  if (role === "streamer") return "/creator/streamer";
  return "/creator/activate";
}

function syncCreatorRole(role: CreatorRole | null) {
  if (role) {
    localStorage.setItem("creator_role", role);
  } else {
    localStorage.removeItem("creator_role");
  }

  window.dispatchEvent(new Event("creator-role-changed"));
}

export default function CreatorActivatePage() {
  const navigate = useNavigate();

  const [role, setRole] = useState<CreatorRole>("streamer");
  const [name, setName] = useState("Canal ROOTBLEND");
  const [description, setDescription] = useState("Streams de juegos, tecnologia y charlas con la comunidad.");
  const [channel, setChannel] = useState<Canal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadChannel() {
      setLoading(true);
      setError("");

      try {
        const result = await getMyChannel();

        if (!active) return;

        if (result.tiene_canal && result.canal) {
          const backendRole = getChannelRole(result.canal);
          setChannel(result.canal);
          setName(result.canal.nombre_canal);
          setDescription(result.canal.descripcion || "");

          if (backendRole) {
            setRole(backendRole);
            syncCreatorRole(backendRole);
          }
        } else {
          setChannel(null);
          syncCreatorRole(null);
        }
      } catch (error) {
        console.error("CREATOR_ACTIVATE_LOAD_ERROR", error);
        if (active) {
          setError(error instanceof Error ? error.message : "No se pudo consultar tu canal real.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadChannel();

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (channel) {
      navigate(panelPath(getChannelRole(channel)), { replace: true });
      return;
    }

    if (!name.trim()) {
      setError("Debes escribir un nombre para el canal.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await activateChannel({
        nombre_canal: name.trim(),
        tipo_canal: role,
        descripcion: description.trim(),
      });

      const backendRole = getChannelRole(result.canal);
      syncCreatorRole(backendRole);
      setChannel(result.canal);
      setSuccessMessage("Canal activado correctamente.");
      navigate(panelPath(backendRole), { replace: true });
    } catch (error) {
      console.error("ACTIVATE_CHANNEL_ERROR", error);
      setError(error instanceof Error ? error.message : "No se pudo activar el canal.");
    } finally {
      setSaving(false);
    }
  }

  const existingRole = getChannelRole(channel);

  return (
    <RootShell active="creator">
      <Page>
      <Card onSubmit={submit}>
        <Header>
          <span>ROOTBLEND Creator</span>
          <h1>Activa tu canal de creador</h1>
          <p>
            Elige si tu cuenta sera streamer o podcaster. Esta informacion se guarda en
            canales-streaming-service, ya no en modo demo.
          </p>
        </Header>

        {loading && (
          <Alert>
            <FiRefreshCw />
            <div>
              <strong>Consultando canal</strong>
              <p>Verificando si ya tienes un canal real.</p>
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

        {channel && (
          <Alert>
            <FiLock />
            <div>
              <strong>Ya tienes un canal activo como {existingRole}</strong>
              <p>
                Tu canal real es {channel.nombre_canal}. Una cuenta solo puede operar como
                streamer o podcaster, no ambos.
              </p>
            </div>
            <PrimaryLink to={panelPath(existingRole)}>Ir a mi panel</PrimaryLink>
          </Alert>
        )}

        <Steps>
          <span>Informacion</span>
          <span>Tipo de canal</span>
          <span>Listo</span>
        </Steps>

        <Label>Nombre del canal</Label>
        <Field>
          <FiRadio />
          <input
            value={name}
            disabled={Boolean(channel) || loading || saving}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>

        <Label>URL publica generada</Label>
        <Field>
          <input
            value={`rootblend/${name.toLowerCase().trim().replace(/\s+/g, "-") || "mi-canal"}`}
            disabled
            readOnly
          />
        </Field>

        <Label>Descripcion</Label>
        <TextArea
          value={description}
          disabled={Boolean(channel) || loading || saving}
          onChange={(event) => setDescription(event.target.value)}
        />

        <ChoiceGrid>
          <ChoiceButton
            type="button"
            $active={role === "streamer"}
            disabled={Boolean(channel) || loading || saving}
            onClick={() => setRole("streamer")}
          >
            <FiRadio /> Streamer
          </ChoiceButton>

          <ChoiceButton
            type="button"
            $active={role === "podcaster"}
            disabled={Boolean(channel) || loading || saving}
            onClick={() => setRole("podcaster")}
          >
            <FiMic /> Podcaster
          </ChoiceButton>
        </ChoiceGrid>

        <Actions>
          <GhostLink to="/">Cancelar</GhostLink>
          <PrimaryButton type="submit" disabled={loading || saving}>
            <FiSave /> {channel ? "Ir al panel" : saving ? "Activando..." : "Activar canal"}
          </PrimaryButton>
        </Actions>
      </Card>
      </Page>
    </RootShell>
  );
}

const Page = styled.main`
  min-height: calc(100vh - 64px);
  padding: 28px;
  color: #f8fbff;
`;

const Card = styled.form`
  width: min(760px, 100%);
  margin: 0 auto;
  padding: 22px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.14);
`;

const Header = styled.div`
  margin-bottom: 20px;

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

const Alert = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
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
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 10px;
  color: #86efac;
  background: rgba(22, 163, 74, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.24);
`;

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;

  span {
    padding: 9px;
    border-radius: 999px;
    text-align: center;
    color: #00e5ff;
    background: rgba(0, 229, 255, 0.1);
    font-size: 12px;
    font-weight: 850;
  }
`;

const Label = styled.label`
  display: block;
  margin: 12px 0 7px;
  color: rgba(226, 232, 240, 0.82);
  font-size: 12px;
  font-weight: 850;
`;

const Field = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(2, 6, 23, 0.72);
  color: #00e5ff;

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #fff;
    background: transparent;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  padding: 12px;
  color: #fff;
  background: rgba(2, 6, 23, 0.72);
  outline: 0;
`;

const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin: 14px 0;
`;

const ChoiceButton = styled.button<{ $active?: boolean }>`
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? "#8b5cf6" : "rgba(148, 163, 184, 0.16)")};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(226, 232, 240, 0.78)")};
  background: ${({ $active }) => ($active ? "rgba(124, 58, 237, 0.28)" : "rgba(2, 6, 23, 0.72)")};
  font-weight: 850;
  cursor: pointer;
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
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid rgba(0, 229, 255, 0.28);
  color: #e8fbff;
  background: rgba(15, 23, 42, 0.7);
  font-weight: 850;
`;
