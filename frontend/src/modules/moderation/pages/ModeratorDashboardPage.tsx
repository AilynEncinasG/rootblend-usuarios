//frontend/src/modules/moderation/pages/ModeratorDashboardPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiLock,
  FiMessageCircle,
  FiRefreshCw,
  FiShield,
  FiSlash,
  FiTrash2,
  FiUsers,
  FiVolume2,
  FiXCircle,
} from "react-icons/fi";

import {
  AlertPanel,
  Avatar,
  ButtonRow,
  ChatBox,
  ChatBubble,
  ChatMessages,
  ChatName,
  ChatRow,
  ChatStatus,
  GhostLink,
  MetricCard,
  MetricGrid,
  Panel,
  PanelHeader,
  PrimaryLink,
  QuickActions,
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
  subscribeToChannelModerators,
  subscribeToChat,
  subscribeToStreamSanctions,
  type ChatMessageRecord,
  type ChatModeratorRecord,
  type ChatSanctionRecord,
} from "../../../services/chatService";

function formatTime(timestamp?: number) {
  if (!timestamp) {
    return "--:--";
  }

  return new Date(timestamp).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });
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

function pickMainStream(streams: Stream[]) {
  return (
    streams.find((stream) => stream.estado === "en_vivo") ||
    streams[0] ||
    null
  );
}

export default function ModeratorDashboardPage() {
  const loggedIn = isAuthenticated();

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("Cargando moderación real...");

  const [ownerMode, setOwnerMode] = useState(false);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [channelName, setChannelName] = useState("Canal no identificado");
  const [streams, setStreams] = useState<Stream[]>([]);

  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [moderators, setModerators] = useState<ChatModeratorRecord[]>([]);
  const [sanctions, setSanctions] = useState<ChatSanctionRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadModerationContext() {
      setLoading(true);
      setFeedback("Cargando canal y streams desde canales-service...");

      if (!loggedIn) {
        setOwnerMode(false);
        setChannelId(null);
        setStreams([]);
        setFeedback("Debes iniciar sesión para ver el panel de moderación.");
        setLoading(false);
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
          setChannelId(null);
          setStreams([]);
          setChannelName("Sin canal");
          setFeedback("Tu usuario todavía no tiene un canal creado.");
          return;
        }

        setChannelId(String(canal.id_canal));
        setChannelName(canal.nombre_canal);
        setOwnerMode(role === "streamer");
        setStreams(streamsResult);

        if (streamsResult.length === 0) {
          setFeedback(
            `Canal ${canal.nombre_canal} cargado, pero todavía no tiene streams.`
          );
        } else {
          const selectedStream = pickMainStream(streamsResult);

          setFeedback(
            `Panel conectado a datos reales del canal ${canal.nombre_canal}, stream #${selectedStream?.id_stream}.`
          );
        }
      } catch (error) {
        console.error("MODERATION_DASHBOARD_LOAD_ERROR", error);

        if (active) {
          setOwnerMode(false);
          setChannelId(null);
          setStreams([]);
          setFeedback("No se pudo cargar la moderación real del canal.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadModerationContext();

    return () => {
      active = false;
    };
  }, [loggedIn]);

  const mainStream = useMemo(() => pickMainStream(streams), [streams]);
  const mainStreamId = mainStream?.id_stream ? String(mainStream.id_stream) : "";

  useEffect(() => {
    if (!channelId) {
      setModerators([]);
      return;
    }

    const unsubscribe = subscribeToChannelModerators(
      channelId,
      setModerators
    );

    return () => unsubscribe();
  }, [channelId]);

  useEffect(() => {
    if (!mainStreamId) {
      setMessages([]);
      setSanctions([]);
      return;
    }

    const unsubscribeMessages = subscribeToChat(mainStreamId, setMessages);
    const unsubscribeSanctions = subscribeToStreamSanctions(
      mainStreamId,
      setSanctions
    );

    return () => {
      unsubscribeMessages();
      unsubscribeSanctions();
    };
  }, [mainStreamId]);

  const deletedMessages = messages.filter((message) => message.data.deleted);
  const visibleMessages = messages.slice(-12);

  const silencedUsers = sanctions.filter(
    (sanction) => sanction.data.tipo === "silenciado"
  );

  const blockedUsers = sanctions.filter(
    (sanction) => sanction.data.tipo === "bloqueado"
  );

  const canUseModeration = loggedIn && ownerMode && Boolean(mainStream);

  return (
    <ModerationScreen
      title="Panel del moderador"
      subtitle="Panel conectado a Firebase y canales-service. Ya no usa datos falsos."
    >
      <QuickActions>
        {mainStream ? (
          <PrimaryLink to={`/streams/${mainStream.id_stream}`}>
            <FiMessageCircle /> Abrir chat real
          </PrimaryLink>
        ) : (
          <GhostLink to="/creator/stream/configure">
            <FiMessageCircle /> Crear stream
          </GhostLink>
        )}

        <GhostLink to="/moderation/moderators">
          <FiUsers /> Moderadores
        </GhostLink>

        <GhostLink to="/moderation/sanctions">
          <FiShield /> Sanciones
        </GhostLink>

        <GhostLink to="/moderation/permissions">
          <FiLock /> Permisos
        </GhostLink>

        {mainStream && (
          <GhostLink to={`/streams/${mainStream.id_stream}`}>
            <FiTrash2 /> Eliminar / silenciar / bloquear
          </GhostLink>
        )}
      </QuickActions>

      <Panel>
        <AlertPanel>
          {loading ? <FiRefreshCw /> : <FiShield />}

          <div>
            <strong>{channelName}</strong>
            <p>{feedback}</p>
          </div>

          <ServicePill
            $status={canUseModeration ? "Operativo" : "Degradado"}
          >
            {canUseModeration ? "Datos reales" : "Pendiente"}
          </ServicePill>
        </AlertPanel>

        {!loggedIn && (
          <AlertPanel>
            <FiLock />

            <div>
              <strong>Acceso restringido</strong>
              <p>Debes iniciar sesión para ver la moderación del canal.</p>
            </div>

            <PrimaryLink to="/login">Iniciar sesión</PrimaryLink>
          </AlertPanel>
        )}

        {loggedIn && !ownerMode && (
          <AlertPanel>
            <FiAlertTriangle />

            <div>
              <strong>No eres streamer propietario</strong>
              <p>
                Este panel muestra datos reales solo para el dueño del canal
                streamer.
              </p>
            </div>

            <GhostLink to="/creator/activate">Activar canal</GhostLink>
          </AlertPanel>
        )}

        {loggedIn && ownerMode && !mainStream && (
          <AlertPanel>
            <FiAlertTriangle />

            <div>
              <strong>No hay stream seleccionado</strong>
              <p>
                Crea o inicia un stream para que Firebase tenga un chat que
                moderar.
              </p>
            </div>

            <GhostLink to="/creator/stream/configure">Configurar stream</GhostLink>
          </AlertPanel>
        )}
      </Panel>

      <MetricGrid>
        <MetricCard>
          <FiMessageCircle />
          <span>Mensajes reales</span>
          <strong>{messages.length}</strong>
          <small>stream #{mainStreamId || "sin stream"}</small>
        </MetricCard>

        <MetricCard>
          <FiTrash2 />
          <span>Mensajes eliminados</span>
          <strong>{deletedMessages.length}</strong>
          <small>Firebase</small>
        </MetricCard>

        <MetricCard>
          <FiVolume2 />
          <span>Usuarios silenciados</span>
          <strong>{silencedUsers.length}</strong>
          <small>activos</small>
        </MetricCard>

        <MetricCard>
          <FiXCircle />
          <span>Usuarios bloqueados</span>
          <strong>{blockedUsers.length}</strong>
          <small>activos</small>
        </MetricCard>

        <MetricCard>
          <FiUsers />
          <span>Moderadores activos</span>
          <strong>{moderators.length}</strong>
          <small>canal #{channelId || "-"}</small>
        </MetricCard>
      </MetricGrid>

      <Panel>
        <PanelHeader>
          <strong>Chat real del stream</strong>

          {mainStream ? (
            <GhostLink to={`/streams/${mainStream.id_stream}`}>
              Ir al stream <FiArrowRight />
            </GhostLink>
          ) : (
            <ServicePill $status="Degradado">Sin stream</ServicePill>
          )}
        </PanelHeader>

        <ChatBox>
          <ChatStatus>
            {mainStream ? (
              <>
                Moderación por canal: <b>{channelName}</b> · Stream #
                {mainStream.id_stream}: <b>{mainStream.titulo}</b>
              </>
            ) : (
              "No hay stream disponible para leer mensajes reales."
            )}
          </ChatStatus>

          <ChatMessages>
            {loading && (
              <EmptyPanel
                icon={<FiRefreshCw />}
                title="Cargando panel"
                text="Consultando canal, streams y Firebase."
              />
            )}

            {!loading && !mainStream && (
              <EmptyPanel
                icon={<FiMessageCircle />}
                title="Sin chat real"
                text="Cuando exista un stream, aquí aparecerán sus mensajes reales desde Firebase."
              />
            )}

            {!loading && mainStream && visibleMessages.length === 0 && (
              <EmptyPanel
                icon={<FiMessageCircle />}
                title="Sin mensajes"
                text="El chat real está conectado, pero aún no tiene mensajes."
              />
            )}

            {!loading &&
              mainStream &&
              visibleMessages.map((message) => {
                const isDeleted = Boolean(message.data.deleted);
                const isModerator = moderators.some(
                  (moderator) =>
                    moderator.data.active &&
                    (moderator.data.usuarioId === message.data.usuarioId ||
                      moderator.data.nombre === message.data.nombre)
                );

                return (
                  <ChatRow key={message.id}>
                    <Avatar>{getInitials(message.data.nombre)}</Avatar>

                    <ChatBubble>
                      <ChatName $color={isDeleted ? "#f87171" : "#00e5ff"}>
                        {message.data.nombre}

                        {(message.data.badge || isModerator) && (
                          <span>{message.data.badge || "MOD"}</span>
                        )}

                        <time>{formatTime(message.data.timestamp)}</time>
                      </ChatName>

                      <p
                        style={{
                          color: isDeleted
                            ? "var(--rb-danger)"
                            : undefined,
                          fontStyle: isDeleted ? "italic" : undefined,
                        }}
                      >
                        {message.data.mensaje}
                      </p>
                    </ChatBubble>

                    {mainStream && (
                      <GhostLink to={`/streams/${mainStream.id_stream}`}>
                        <FiArrowRight />
                      </GhostLink>
                    )}
                  </ChatRow>
                );
              })}
          </ChatMessages>
        </ChatBox>
      </Panel>

      <Panel>
        <PanelHeader>
          <strong>Resumen de sanciones reales</strong>
          <GhostLink to="/moderation/sanctions">
            Ver sanciones <FiArrowRight />
          </GhostLink>
        </PanelHeader>

        {sanctions.length === 0 ? (
          <EmptyPanel
            icon={<FiSlash />}
            title="Sin sanciones activas"
            text="Cuando silencies o bloquees usuarios desde el chat, aparecerán aquí y en la pantalla de sanciones."
          />
        ) : (
          <ButtonRow>
            <ServicePill $status="Operativo">
              {silencedUsers.length} silenciado(s)
            </ServicePill>

            <ServicePill $status="Degradado">
              {blockedUsers.length} bloqueado(s)
            </ServicePill>

            <ServicePill $status="Operativo">
              {moderators.length} moderador(es)
            </ServicePill>
          </ButtonRow>
        )}
      </Panel>
    </ModerationScreen>
  );
}