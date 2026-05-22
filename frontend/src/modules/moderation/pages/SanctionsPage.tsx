import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiLock,
  FiRefreshCw,
  FiShield,
  FiSlash,
  FiUnlock,
  FiUsers,
  FiVolumeX,
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
import {
  getMyChannel,
  getMyStreams,
  type Stream,
} from "../../streams/services/streamsService";

import {
  clearChatSanction,
  subscribeToStreamSanctions,
  type ChatSanctionRecord,
} from "../../../services/chatService";

type SanctionWithStream = {
  streamId: string;
  streamTitle: string;
  record: ChatSanctionRecord;
};

function formatDate(value?: number | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Date(value).toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatExpires(value?: number | null) {
  if (!value) {
    return "Indefinido";
  }

  const remainingMs = value - Date.now();

  if (remainingMs <= 0) {
    return "Expirado";
  }

  const minutes = Math.ceil(remainingMs / 60000);

  if (minutes < 60) {
    return `${minutes} min restantes`;
  }

  const hours = Math.ceil(minutes / 60);

  if (hours < 24) {
    return `${hours} h restantes`;
  }

  const days = Math.ceil(hours / 24);
  return `${days} día(s) restantes`;
}

function getInitials(value: string) {
  return (
    value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "US"
  );
}

export default function SanctionsPage() {
  const loggedIn = isAuthenticated();

  const [loadingChannel, setLoadingChannel] = useState(true);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [feedback, setFeedback] = useState("Cargando sanciones del chat...");

  const [ownerMode, setOwnerMode] = useState(false);
  const [channelName, setChannelName] = useState("Canal no identificado");
  const [streams, setStreams] = useState<Stream[]>([]);
  const [sanctionsByStream, setSanctionsByStream] = useState<
    Record<string, ChatSanctionRecord[]>
  >({});

  const [pendingClear, setPendingClear] =
    useState<SanctionWithStream | null>(null);

  useEffect(() => {
    let active = true;

    async function loadChannelAndStreams() {
      setLoadingChannel(true);
      setLoadingStreams(true);
      setFeedback("Cargando canal y streams del streamer...");

      if (!loggedIn) {
        setOwnerMode(false);
        setFeedback("Debes iniciar sesión para revisar sanciones del chat.");
        setLoadingChannel(false);
        setLoadingStreams(false);
        return;
      }

      try {
        const [channelResult, streamsResult] = await Promise.all([
          getMyChannel(),
          getMyStreams(),
        ]);

        if (!active) return;

        const canal = channelResult.canal;
        const role = canal?.tipo_canal?.nombre_tipo;

        if (!canal) {
          setOwnerMode(false);
          setStreams([]);
          setChannelName("Sin canal");
          setFeedback("Tu usuario todavía no tiene un canal creado.");
          return;
        }

        setChannelName(canal.nombre_canal);
        setOwnerMode(role === "streamer");
        setStreams(streamsResult);

        if (streamsResult.length === 0) {
          setFeedback(
            "Tu canal aún no tiene streams creados. Las sanciones aparecerán cuando exista un chat de stream."
          );
        } else {
          setFeedback(
            `Leyendo sanciones reales de Firebase para ${streamsResult.length} stream(s).`
          );
        }
      } catch (error) {
        console.error("SANCTIONS_LOAD_ERROR", error);

        if (active) {
          setOwnerMode(false);
          setStreams([]);
          setFeedback("No se pudo cargar el canal o los streams del usuario.");
        }
      } finally {
        if (active) {
          setLoadingChannel(false);
          setLoadingStreams(false);
        }
      }
    }

    loadChannelAndStreams();

    return () => {
      active = false;
    };
  }, [loggedIn]);

  useEffect(() => {
    if (streams.length === 0) {
      setSanctionsByStream({});
      return;
    }

    const unsubscribers = streams.map((stream) =>
      subscribeToStreamSanctions(stream.id_stream, (incomingSanctions) => {
        setSanctionsByStream((current) => ({
          ...current,
          [String(stream.id_stream)]: incomingSanctions,
        }));
      })
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [streams]);

  const sanctions = useMemo<SanctionWithStream[]>(() => {
    return streams.flatMap((stream) => {
      const streamSanctions = sanctionsByStream[String(stream.id_stream)] || [];

      return streamSanctions.map((record) => ({
        streamId: String(stream.id_stream),
        streamTitle: stream.titulo,
        record,
      }));
    });
  }, [streams, sanctionsByStream]);

  const mainStreamId =
    streams.find((stream) => stream.estado === "en_vivo")?.id_stream ||
    streams[0]?.id_stream ||
    1;

  async function confirmClearSanction() {
    if (!pendingClear) {
      return;
    }

    if (!ownerMode) {
      setFeedback("Solo el dueño streamer puede levantar sanciones.");
      setPendingClear(null);
      return;
    }

    try {
      await clearChatSanction(
        pendingClear.streamId,
        pendingClear.record.data.usuarioId
      );

      setFeedback(
        `Sanción levantada para ${pendingClear.record.data.nombre}.`
      );
      setPendingClear(null);
    } catch (error) {
      console.error("SANCTION_CLEAR_ERROR", error);
      setFeedback("No se pudo levantar la sanción en Firebase.");
    }
  }

  return (
    <ModerationScreen
      title="Usuarios sancionados"
      subtitle="Consulta usuarios silenciados o bloqueados reales del chat en vivo."
    >
      <Panel>
        <AlertPanel>
          <FiShield />

          <div>
            <strong>Sanciones por stream</strong>
            <p>
              Esta vista lee Firebase en la ruta{" "}
              <b>stream_chats/&lt;id_stream&gt;/sanctions</b>. Muestra sanciones
              activas de los streams de tu canal.
            </p>
          </div>

          <ServicePill $status={streams.length > 0 ? "Operativo" : "Degradado"}>
            {streams.length > 0 ? "Conectado" : "Sin streams"}
          </ServicePill>
        </AlertPanel>

        <AlertPanel>
          {loadingChannel || loadingStreams ? <FiRefreshCw /> : <FiUsers />}

          <div>
            <strong>{channelName}</strong>
            <p>{feedback}</p>
          </div>

          <GhostLink to={`/streams/${mainStreamId}`}>
            <FiArrowLeft /> Volver al stream
          </GhostLink>
        </AlertPanel>

        {!loggedIn && (
          <AlertPanel>
            <FiLock />

            <div>
              <strong>Acceso restringido</strong>
              <p>Debes iniciar sesión como streamer para revisar sanciones.</p>
            </div>

            <PrimaryLink to="/login">Iniciar sesión</PrimaryLink>
          </AlertPanel>
        )}

        {loggedIn && !ownerMode && (
          <AlertPanel>
            <FiLock />

            <div>
              <strong>Solo streamer propietario</strong>
              <p>
                Puedes revisar permisos, pero para levantar sanciones debes ser
                el dueño del canal streamer.
              </p>
            </div>

            <GhostLink to="/moderation/permissions">Ver permisos</GhostLink>
          </AlertPanel>
        )}

        {loadingChannel || loadingStreams ? (
          <EmptyPanel
            icon={<FiRefreshCw />}
            title="Cargando sanciones"
            text="Leyendo streams del canal y sanciones activas desde Firebase."
          />
        ) : sanctions.length === 0 ? (
          <EmptyPanel
            icon={<FiSlash />}
            title="Sin usuarios sancionados"
            text="Cuando silencies o bloquees usuarios desde el chat, aparecerán en esta lista."
          />
        ) : (
          sanctions.map((item) => {
            const sanction = item.record.data;
            const isBlocked = sanction.tipo === "bloqueado";

            return (
              <NotificationRow
                key={`${item.streamId}-${item.record.id}`}
                $accent={isBlocked ? "#ef4444" : "#f59e0b"}
              >
                <Avatar>{getInitials(sanction.nombre)}</Avatar>

                <div>
                  <strong>{sanction.nombre}</strong>
                  <small>
                    {isBlocked ? "Bloqueado" : "Silenciado"} · Stream #
                    {item.streamId}: {item.streamTitle}
                  </small>
                  <small>
                    Motivo: {sanction.motivo || "Sin motivo"} · Creado:{" "}
                    {formatDate(sanction.createdAt)} · Expira:{" "}
                    {formatExpires(sanction.expiresAt)}
                  </small>
                </div>

                <ServicePill $status={isBlocked ? "Degradado" : "Operativo"}>
                  {isBlocked ? "Bloqueado" : "Silenciado"}
                </ServicePill>

                {ownerMode && (
                  <DangerButton
                    type="button"
                    onClick={() => setPendingClear(item)}
                  >
                    <FiUnlock /> Levantar
                  </DangerButton>
                )}
              </NotificationRow>
            );
          })
        )}

        <ButtonRow>
          <GhostLink to="/moderation/moderators">
            <FiShield /> Lista de moderadores
          </GhostLink>

          <GhostLink to="/moderation">
            Panel de moderación
          </GhostLink>
        </ButtonRow>
      </Panel>

      {pendingClear && (
        <DialogCard>
          {pendingClear.record.data.tipo === "bloqueado" ? (
            <FiSlash size={34} />
          ) : (
            <FiVolumeX size={34} />
          )}

          <h2>Levantar sanción</h2>

          <p>
            Se quitará la sanción de{" "}
            <strong>{pendingClear.record.data.nombre}</strong> en el stream #
            {pendingClear.streamId}. El usuario podrá volver a escribir si no
            tiene otra sanción activa.
          </p>

          <ButtonRow>
            <GhostButton type="button" onClick={() => setPendingClear(null)}>
              Cancelar
            </GhostButton>

            <DangerButton type="button" onClick={confirmClearSanction}>
              Levantar sanción
            </DangerButton>
          </ButtonRow>
        </DialogCard>
      )}
    </ModerationScreen>
  );
}