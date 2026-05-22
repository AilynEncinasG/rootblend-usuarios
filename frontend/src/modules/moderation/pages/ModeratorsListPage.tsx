import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiLock,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

import {
  AlertPanel,
  Avatar,
  ButtonRow,
  DangerButton,
  DialogCard,
  GhostButton,
  GhostLink,
  NotificationRow,
  Panel,
  PrimaryLink,
  ServicePill,
} from "../../../shared/styles/legacyStyled";

import { EmptyPanel } from "../../public/utils/publicLegacyHelpers";
import { ModerationScreen } from "../../system/pages/systemLegacy";
import { isAuthenticated } from "../../auth/utils/authStorage";
import { getMyChannel } from "../../streams/services/streamsService";

import {
  removeChatModerator,
  subscribeToChannelModerators,
  type ChatModeratorRecord,
} from "../../../services/chatService";

function formatAssignedAt(value?: number) {
  if (!value) {
    return "Fecha no disponible";
  }

  return new Date(value).toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ModeratorsListPage() {
  const [loadingChannel, setLoadingChannel] = useState(true);
  const [loadingModerators, setLoadingModerators] = useState(false);
  const [feedback, setFeedback] = useState(
    "Cargando información del canal..."
  );

  const [ownerMode, setOwnerMode] = useState(false);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [channelName, setChannelName] = useState("Canal no identificado");

  const [moderators, setModerators] = useState<ChatModeratorRecord[]>([]);
  const [pendingRemove, setPendingRemove] =
    useState<ChatModeratorRecord | null>(null);

  const loggedIn = isAuthenticated();

  useEffect(() => {
    let active = true;

    async function loadMyChannel() {
      setLoadingChannel(true);
      setFeedback("Cargando canal del streamer...");

      if (!loggedIn) {
        setOwnerMode(false);
        setChannelId(null);
        setFeedback("Debes iniciar sesión para gestionar moderadores.");
        setLoadingChannel(false);
        return;
      }

      try {
        const result = await getMyChannel();

        if (!active) return;

        const canal = result.canal;
        const role = canal?.tipo_canal?.nombre_tipo;

        if (!canal) {
          setOwnerMode(false);
          setChannelId(null);
          setFeedback("Tu usuario todavía no tiene un canal creado.");
          return;
        }

        setChannelId(String(canal.id_canal));
        setChannelName(canal.nombre_canal);
        setOwnerMode(role === "streamer");

        if (role === "streamer") {
          setFeedback(
            `Moderadores cargados para el canal ${canal.nombre_canal}.`
          );
        } else {
          setFeedback(
            "Tu canal no es de tipo streamer; la moderación aplica al chat de streams."
          );
        }
      } catch (error) {
        console.error("MODERATORS_CHANNEL_LOAD_ERROR", error);

        if (active) {
          setOwnerMode(false);
          setChannelId(null);
          setFeedback("No se pudo cargar tu canal desde canales-service.");
        }
      } finally {
        if (active) {
          setLoadingChannel(false);
        }
      }
    }

    loadMyChannel();

    return () => {
      active = false;
    };
  }, [loggedIn]);

  useEffect(() => {
    if (!channelId) {
      setModerators([]);
      return;
    }

    setLoadingModerators(true);

    const unsubscribe = subscribeToChannelModerators(
      channelId,
      (incomingModerators) => {
        setModerators(incomingModerators);
        setLoadingModerators(false);
      }
    );

    return () => unsubscribe();
  }, [channelId]);

  async function confirmRemoveModerator() {
    if (!pendingRemove || !channelId) {
      return;
    }

    if (!ownerMode) {
      setFeedback("Solo el dueño streamer puede quitar moderadores.");
      setPendingRemove(null);
      return;
    }

    try {
      await removeChatModerator(channelId, pendingRemove.data.usuarioId);

      setFeedback(
        `${pendingRemove.data.nombre} ya no es moderador de ${channelName}.`
      );
      setPendingRemove(null);
    } catch (error) {
      console.error("MODERATOR_REMOVE_ERROR", error);
      setFeedback("No se pudo quitar el moderador en Firebase.");
    }
  }

  return (
    <ModerationScreen
      title="Lista de moderadores"
      subtitle="Gestiona los moderadores reales del canal usando Firebase Realtime Database."
    >
      <Panel>
        <AlertPanel>
          <FiShield />

          <div>
            <strong>Moderación por canal</strong>
            <p>
              Esta lista lee los moderadores reales desde Firebase en la ruta{" "}
              <b>channel_moderators/{channelId || "id_canal"}</b>.
            </p>
          </div>

          <ServicePill $status={channelId ? "Operativo" : "Degradado"}>
            {channelId ? "Conectado" : "Sin canal"}
          </ServicePill>
        </AlertPanel>

        <AlertPanel>
          {loadingChannel || loadingModerators ? <FiRefreshCw /> : <FiUsers />}

          <div>
            <strong>{channelName}</strong>
            <p>{feedback}</p>
          </div>

          <GhostLink to="/streams/1">
            <FiArrowLeft /> Volver al stream
          </GhostLink>
        </AlertPanel>

        {!loggedIn && (
          <AlertPanel>
            <FiLock />

            <div>
              <strong>Acceso restringido</strong>
              <p>Debes iniciar sesión como streamer para administrar moderadores.</p>
            </div>

            <PrimaryLink to="/login">Iniciar sesión</PrimaryLink>
          </AlertPanel>
        )}

        {loggedIn && !ownerMode && (
          <AlertPanel>
            <FiLock />

            <div>
              <strong>Solo el streamer propietario puede editar</strong>
              <p>
                Puedes revisar el estado, pero para quitar moderadores debes ser
                el dueño del canal streamer.
              </p>
            </div>

            <GhostLink to="/moderation/permissions">Ver permisos</GhostLink>
          </AlertPanel>
        )}

        {loadingModerators ? (
          <EmptyPanel
            icon={<FiRefreshCw />}
            title="Cargando moderadores"
            text="Leyendo moderadores activos desde Firebase."
          />
        ) : moderators.length === 0 ? (
          <EmptyPanel
            icon={<FiShield />}
            title="Sin moderadores activos"
            text="Cuando asignes un moderador desde el chat, aparecerá en esta lista."
          />
        ) : (
          moderators.map((moderator) => (
            <NotificationRow key={moderator.id} $accent="#00e5ff">
              <Avatar>{moderator.data.nombre.slice(0, 2).toUpperCase()}</Avatar>

              <div>
                <strong>{moderator.data.nombre}</strong>
                <small>
                  Activo en {channelName} · Asignado:{" "}
                  {formatAssignedAt(moderator.data.assignedAt)}
                </small>
              </div>

              {ownerMode ? (
                <DangerButton
                  type="button"
                  onClick={() => setPendingRemove(moderator)}
                >
                  <FiTrash2 /> Quitar rol
                </DangerButton>
              ) : (
                <ServicePill $status="Operativo">Activo</ServicePill>
              )}
            </NotificationRow>
          ))
        )}

        <ButtonRow>
          <GhostLink to="/moderation/permissions">
            <FiUserCheck /> Ver permisos del moderador
          </GhostLink>

          <GhostLink to="/moderation">
            Panel de moderación
          </GhostLink>
        </ButtonRow>
      </Panel>

      {pendingRemove && (
        <DialogCard>
          <FiAlertTriangle size={34} />

          <h2>Quitar moderador</h2>

          <p>
            {pendingRemove.data.nombre} perderá los permisos de moderación en el
            canal {channelName}. Esta acción se aplicará en Firebase y el cambio
            se verá en tiempo real.
          </p>

          <ButtonRow>
            <GhostButton type="button" onClick={() => setPendingRemove(null)}>
              Cancelar
            </GhostButton>

            <DangerButton type="button" onClick={confirmRemoveModerator}>
              Quitar rol
            </DangerButton>
          </ButtonRow>
        </DialogCard>
      )}
    </ModerationScreen>
  );
}