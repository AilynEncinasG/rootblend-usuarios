import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiMic,
  FiRadio,
} from "react-icons/fi";

import { RootShell } from "../../../../shared/layout";
import {
  AlertPanel,
  ChoiceButton,
  ChoiceGrid,
  Field,
  GhostButton,
  Label,
  PrimaryLink,
  ProgressSteps,
  TextArea,
} from "../../../../shared/styles/legacyStyled";
import { FormPanel } from "../creatorLegacy";
import {
  clearCreatorRole,
  getCreatorRole,
  setCreatorRole,
  type CreatorRole,
} from "../services/creatorRoleService";
import {
  activateChannel,
  getMyChannel,
  type Canal,
} from "../../../streams/services/streamsService";

type FormStatus = "idle" | "loading" | "success" | "error";

function getChannelRole(channel?: Canal | null): CreatorRole | null {
  const role = channel?.tipo_canal?.nombre_tipo;

  if (role === "streamer" || role === "podcaster") {
    return role;
  }

  return null;
}

function getDashboardPath(role: CreatorRole) {
  return role === "podcaster"
    ? "/creator/podcaster/dashboard"
    : "/creator/streamer/dashboard";
}

function normalizeChannelName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function buildSlug(value: string) {
  const clean = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return clean || "tu-canal";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No se pudo activar el canal. Intenta nuevamente.";
}

export default function CreatorActivatePage() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [existingRole, setExistingRole] = useState<CreatorRole | null>(null);
  const [role, setRole] = useState<CreatorRole>(
    getCreatorRole() || "streamer",
  );

  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const slug = useMemo(() => buildSlug(channelName), [channelName]);
  const isBusy = checking || status === "loading";
  const currentRole = existingRole || getCreatorRole();

  useEffect(() => {
    let active = true;

    async function loadCurrentChannel() {
      setChecking(true);
      setMessage("");

      try {
        const result = await getMyChannel();

        if (!active) return;

        const backendRole = getChannelRole(result.canal);

        if (backendRole) {
          setCreatorRole(backendRole);
          setExistingRole(backendRole);
          setRole(backendRole);

          if (result.canal?.nombre_canal) {
            setChannelName(result.canal.nombre_canal);
          }

          if (result.canal?.descripcion) {
            setDescription(result.canal.descripcion);
          }
        } else {
          clearCreatorRole();
          window.dispatchEvent(new Event("creator-role-changed"));
          setExistingRole(null);
        }
      } catch (error) {
        console.error("LOAD_CREATOR_CHANNEL_ERROR", error);

        if (!active) return;

        const cachedRole = getCreatorRole();

        if (cachedRole) {
          setRole(cachedRole);
        }

        setMessage(
          "No se pudo verificar si ya tienes canal. Puedes intentar activar el canal igualmente.",
        );
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    loadCurrentChannel();

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (existingRole) {
      navigate(getDashboardPath(existingRole));
      return;
    }

    const cleanName = normalizeChannelName(channelName);

    if (!cleanName) {
      setStatus("error");
      setMessage("El nombre del canal es obligatorio.");
      return;
    }

    if (cleanName.length < 3) {
      setStatus("error");
      setMessage("El nombre del canal debe tener al menos 3 caracteres.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const result = await activateChannel({
        nombre_canal: cleanName,
        tipo_canal: role,
        descripcion: description.trim(),
      });

      const backendRole = getChannelRole(result.canal) || role;

      setCreatorRole(backendRole);
      setExistingRole(backendRole);
      setStatus("success");
      setMessage("Canal activado correctamente.");

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("creator-role-changed"));

      navigate(getDashboardPath(backendRole), { replace: true });
    } catch (error) {
      console.error("ACTIVATE_CREATOR_CHANNEL_ERROR", error);

      setStatus("error");
      setMessage(getErrorMessage(error));
    }
  }

  function resetRole() {
    clearCreatorRole();

    window.dispatchEvent(new Event("creator-role-changed"));

    setExistingRole(null);
    setRole("streamer");
    setChannelName("");
    setDescription("");
    setStatus("idle");
    setMessage("");

    navigate("/creator/activate");
  }

  return (
    <RootShell active="creator">
      {checking && (
        <AlertPanel>
          <FiRadio />
          <div>
            <strong>Verificando canal</strong>
            <p>Estamos revisando si esta cuenta ya tiene un canal activo.</p>
          </div>
        </AlertPanel>
      )}

      {!checking && existingRole && (
        <AlertPanel>
          <FiLock />
          <div>
            <strong>
              Ya tienes un canal activo como{" "}
              {existingRole === "streamer" ? "streamer" : "podcaster"}
            </strong>
            <p>
              Una cuenta solo puede ser streamer o podcaster. El panel contrario
              se redirige al rol activo.
            </p>
          </div>

          <PrimaryLink to={getDashboardPath(existingRole)}>
            Ir a mi panel
          </PrimaryLink>

          <GhostButton type="button" onClick={resetRole}>
            Reiniciar rol local
          </GhostButton>
        </AlertPanel>
      )}

      {!checking && message && (
        <AlertPanel>
          {status === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
          <div>
            <strong>
              {status === "success"
                ? "Operacion completada"
                : "Aviso de activacion"}
            </strong>
            <p>{message}</p>
          </div>
        </AlertPanel>
      )}

      <FormPanel
        title="Activa tu canal de creador"
        subtitle="Escoge un solo tipo de canal: streamer o podcaster."
        button={
          isBusy
            ? "Procesando..."
            : existingRole
              ? "Ir al panel activo"
              : "Continuar"
        }
        onSubmit={submit}
      >
        <ProgressSteps>
          <span>Informacion</span>
          <span>Tipo de canal</span>
          <span>Listo</span>
        </ProgressSteps>

        <Label>Nombre del canal</Label>
        <Field>
          <FiRadio />
          <input
            value={channelName}
            placeholder="Ej. NeoPlayer, Canal RootBlend o StreamZone"
            disabled={Boolean(existingRole) || isBusy}
            onChange={(event) => setChannelName(event.target.value)}
          />
        </Field>

        <Label>URL personalizada</Label>
        <Field>
          <FiArrowRight />
          <input
            value={channelName.trim() ? `rootblend/${slug}` : ""}
            placeholder="rootblend/tu-canal"
            disabled
          />
        </Field>

        <Label>Descripcion del canal</Label>
        <TextArea
          value={description}
          placeholder="Describe brevemente el contenido de tu canal."
          disabled={Boolean(existingRole) || isBusy}
          onChange={(event) => setDescription(event.target.value)}
        />

        <ChoiceGrid>
          <ChoiceButton
            type="button"
            $active={role === "streamer"}
            disabled={Boolean(existingRole) || isBusy}
            onClick={() => setRole("streamer")}
          >
            <FiRadio /> Streamer
          </ChoiceButton>

          <ChoiceButton
            type="button"
            $active={role === "podcaster"}
            disabled={Boolean(existingRole) || isBusy}
            onClick={() => setRole("podcaster")}
          >
            <FiMic /> Podcaster
          </ChoiceButton>
        </ChoiceGrid>

        {currentRole && !existingRole && (
          <AlertPanel>
            <FiAlertTriangle />
            <div>
              <strong>Rol local detectado</strong>
              <p>
                Hay un rol guardado en el navegador, pero todavia falta crear el
                canal real para esta cuenta. Presiona Continuar para registrarlo.
              </p>
            </div>
          </AlertPanel>
        )}
      </FormPanel>
    </RootShell>
  );
}