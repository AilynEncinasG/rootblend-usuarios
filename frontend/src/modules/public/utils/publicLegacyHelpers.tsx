/* eslint-disable react-refresh/only-export-components */
import { type FormEvent, type ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiEye,
  FiMoreVertical,
  FiPlay,
  FiSend,
  FiSettings,
  FiShield,
  FiTrash2,
  FiVolume2,
  FiWifiOff,
  FiXCircle,
} from "react-icons/fi";
import {
  brandAssets,
  chatMessages,
  podcasts,
  type ChatMessage,
  type Category,
  type PodcastItem,
  type StreamItem,
} from "../../../shared/mock/rootblendMock";
import { isAuthenticated } from "../../auth/utils/authStorage";
import {
  getCreatorRole,
  getModerators,
  getUserLabel,
  saveModerators,
} from "../../../shared/utils/rootblendHelpers";
import {
  type Categoria as BackendCategory,
  type Canal as BackendCanal,
  type Stream as BackendStream,
} from "../../streams/services/streamsService";
import {
  Avatar,
  CardBody,
  CardTitle,
  ChatActionButton,
  ChatActionMenu,
  ChatBox,
  ChatBubble,
  ChatForm,
  ChatMessages,
  ChatName,
  ChatRow,
  ChatStatus,
  ContentCard,
  Divider,
  HeaderActionGroup,
  LoginNotice,
  LiveBadge,
  MetaLine,
  MetricCard,
  Muted,
  PanelHeader,
  PodcastCover,
  PodcastTile,
  PrimaryLink,
  PromoPanel,
  RoundButton,
  SectionBlock,
  SectionHeader,
  ServicePill,
  SideListItem,
  SidePanel,
  StateIcon,
  StatePanel,
  Thumb,
  VerifiedDot,
  ViewBadge,
} from "../../../shared/styles/legacyStyled";

export function getInitials(value?: string | null) {
  const clean = String(value || "").trim();

  if (!clean) {
    return "RB";
  }

  return (
    clean
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "RB"
  );
}

export function backendStreamToCard(stream: BackendStream): StreamItem {
  return {
    id: String(stream.id_stream),
    title: stream.titulo,
    channel: stream.canal.nombre_canal,
    handle: `@${stream.canal.nombre_canal.toLowerCase().replace(/\s+/g, "")}`,
    category: stream.categoria.nombre,
    viewers: `${stream.viewer_count || 0}`,
    avatar: getInitials(stream.canal.nombre_canal),
    image: brandAssets.streamView,
    tags: [
      stream.categoria.nombre,
      stream.configuracion?.resolucion || "720p",
      stream.estado === "en_vivo" ? "En vivo" : stream.estado,
    ],
    description:
      stream.descripcion ||
      "Este stream todavía no tiene descripción configurada.",
  };
}

export function backendCategoryToCard(
  category: BackendCategory,
  liveStreams: StreamItem[]
): Category {
  const activeCount = liveStreams.filter(
    (stream) => stream.category === category.nombre
  ).length;

  return {
    id: String(category.id_categoria),
    name: category.nombre,
    icon: "grid",
    viewers: String(activeCount),
    color: "#00e5ff",
    image: brandAssets.categoriesView,
  };
}

export function backendChannelToCard(channel: BackendCanal) {
  return {
    name: channel.nombre_canal,
    subtitle: channel.tipo_canal.nombre_tipo,
    viewers: "0",
    avatar: getInitials(channel.nombre_canal),
    id: String(channel.id_canal),
  };
}

export function EmptyPanel({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <StatePanel>
      <StateIcon>{icon}</StateIcon>
      <h2>{title}</h2>
      <p>{text}</p>
    </StatePanel>
  );
}

export function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <SectionBlock>
      <SectionHeader>
        <h2>{title}</h2>
        {action}
      </SectionHeader>

      {children}
    </SectionBlock>
  );
}

export function StreamCard({ stream }: { stream: StreamItem }) {
  return (
    <ContentCard to={`/streams/${stream.id}`}>
      <Thumb $image={stream.image}>
        <LiveBadge>EN VIVO</LiveBadge>
        <ViewBadge>
          <FiEye /> {stream.viewers}
        </ViewBadge>
      </Thumb>

      <CardBody>
        <CardTitle>{stream.title}</CardTitle>

        <MetaLine>
          <Avatar>{stream.avatar}</Avatar>
          <span>{stream.channel}</span>
          <VerifiedDot />
        </MetaLine>

        <Muted>{stream.category}</Muted>
      </CardBody>
    </ContentCard>
  );
}

export function PodcastCard({ podcast }: { podcast: PodcastItem }) {
  return (
    <PodcastTile to={`/podcasts/${podcast.id}`}>
      <PodcastCover $image={podcast.image}>
        <FiPlay />
      </PodcastCover>

      <div>
        <CardTitle>{podcast.title}</CardTitle>
        <Muted>{podcast.creator}</Muted>
        <Muted>Ultimo episodio: {podcast.duration}</Muted>
      </div>

      <RoundButton type="button" title="Reproducir">
        <FiPlay />
      </RoundButton>
    </PodcastTile>
  );
}

export function ChatPanel({ allowInput = true }: { allowInput?: boolean }) {
  const [items, setItems] = useState<ChatMessage[]>(chatMessages);
  const [message, setMessage] = useState("");
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [moderators, setModerators] = useState<string[]>(() => getModerators());
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [actionFeedback, setActionFeedback] = useState("Moderacion por canal: PixelNate / Cyberpunk 2077.");
  const loggedIn = isAuthenticated();
  const ownerMode = getCreatorRole() === "streamer";
  const canModerate = ownerMode || moderators.includes(getUserLabel());

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentUser = getUserLabel();
    if (!message.trim() || !loggedIn || !allowInput) return;
    if (mutedUsers.includes(currentUser) || blockedUsers.includes(currentUser)) {
      setActionFeedback("No puedes escribir porque tienes una sancion activa en este canal.");
      return;
    }
    setItems((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        user: currentUser,
        badge: "TU",
        text: message.trim(),
        time: "Ahora",
        color: "#00e5ff",
      },
    ]);
    setMessage("");
  }

  function assignModerator(user: string) {
    if (!ownerMode) {
      setActionFeedback("Solo el duenio del canal puede asignar moderadores.");
      return;
    }

    const next = Array.from(new Set([...moderators, user]));
    setModerators(next);
    saveModerators(next);
    setItems((current) =>
      current.map((item) =>
        item.user === user
          ? {
              ...item,
              badge: "MOD",
            }
          : item
      )
    );
    setActionFeedback(`${user} ahora es moderador solo de este canal.`);
    setActiveMessageId(null);
  }

  function deleteMessage(id: string, user: string) {
    if (!canModerate) {
      setActionFeedback("Necesitas ser moderador de este canal para eliminar mensajes.");
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              text: "Mensaje eliminado por moderacion.",
              color: "#94a3b8",
            }
          : item
      )
    );
    setActionFeedback(`Mensaje de ${user} eliminado para todos.`);
    setActiveMessageId(null);
  }

  function silenceUser(user: string) {
    if (!canModerate) {
      setActionFeedback("Necesitas ser moderador de este canal para silenciar usuarios.");
      return;
    }

    setMutedUsers((current) => Array.from(new Set([...current, user])));
    setActionFeedback(`${user} fue silenciado 10 minutos en este canal.`);
    setActiveMessageId(null);
  }

  function blockUser(user: string) {
    if (!canModerate) {
      setActionFeedback("Necesitas ser moderador de este canal para bloquear usuarios.");
      return;
    }

    setBlockedUsers((current) => Array.from(new Set([...current, user])));
    setItems((current) => current.filter((item) => item.user !== user));
    setActionFeedback(`${user} fue bloqueado del chat de este canal.`);
    setActiveMessageId(null);
  }

  function viewProfile(user: string) {
    setActionFeedback(`Perfil de ${user}.`);
    setActiveMessageId(null);
  }

  return (
    <ChatBox>
      <PanelHeader>
        <strong>Chat en vivo</strong>
        <HeaderActionGroup>
          <ServicePill $status={canModerate ? "Operativo" : "Degradado"}>
            {canModerate ? "MOD activo" : "Viewer"}
          </ServicePill>
          <Link to="/moderation"><FiSettings /></Link>
        </HeaderActionGroup>
      </PanelHeader>
      <ChatStatus>{actionFeedback}</ChatStatus>
      <ChatMessages>
        {items.map((item) => (
          <ChatRow key={item.id}>
            <Avatar $small>{item.user.slice(0, 2).toUpperCase()}</Avatar>
            <ChatBubble>
              <ChatName $color={item.color}>
                {item.user} {item.badge && <span>{item.badge}</span>}
                <time>{item.time}</time>
              </ChatName>
              <p>{item.text}</p>
            </ChatBubble>
            <ChatActionButton
              type="button"
              title="Acciones de chat"
              onClick={() =>
                setActiveMessageId((current) => current === item.id ? null : item.id)
              }
            >
              <FiMoreVertical />
            </ChatActionButton>
            {activeMessageId === item.id && (
              <ChatActionMenu>
                <button type="button" onClick={() => viewProfile(item.user)}>
                  <FiEye /> Ver perfil
                </button>
                <button type="button" onClick={() => assignModerator(item.user)}>
                  <FiShield /> Hacer moderador
                </button>
                <button type="button" onClick={() => deleteMessage(item.id, item.user)}>
                  <FiTrash2 /> Eliminar mensaje
                </button>
                <button type="button" onClick={() => silenceUser(item.user)}>
                  <FiVolume2 /> Silenciar usuario
                </button>
                <button type="button" onClick={() => blockUser(item.user)}>
                  <FiXCircle /> Bloquear usuario
                </button>
              </ChatActionMenu>
            )}
          </ChatRow>
        ))}
      </ChatMessages>
      {loggedIn && allowInput ? (
        <ChatForm onSubmit={sendMessage}>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Enviar un mensaje..."
          />
          <button type="submit">
            <FiSend />
          </button>
        </ChatForm>
      ) : (
        <LoginNotice>
          Inicia sesion para escribir en el chat.
          <PrimaryLink to="/login">Iniciar sesion</PrimaryLink>
        </LoginNotice>
      )}
    </ChatBox>
  );
}

export function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <MetricCard>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </MetricCard>
  );
}

export function PodcastRightPanel() {
  return (
    <SidePanel>
      <PanelHeader><strong>Tendencias</strong><Link to="/podcasts">Ver todo</Link></PanelHeader>
      {podcasts.map((podcast) => (
        <SideListItem key={podcast.id} to={`/podcasts/${podcast.id}`}>
          <Avatar>{podcast.title.slice(0, 2).toUpperCase()}</Avatar>
          <span>{podcast.title}</span>
          <small>{podcast.duration}</small>
        </SideListItem>
      ))}
      <Divider />
      <PromoPanel>
        <strong>¿Tienes un podcast?</strong>
        <p>Publica episodios y conecta con tu audiencia.</p>
        <PrimaryLink to="/creator/activate">Hazlo crecer</PrimaryLink>
      </PromoPanel>
    </SidePanel>
  );
}

export function DemoRightPanel({
  liveStreams = [],
}: {
  liveStreams?: StreamItem[];
}) {
  return (
    <SidePanel>
      <PanelHeader>
        <strong>Ahora en vivo</strong>
        <Link to="/streams">Ver todos</Link>
      </PanelHeader>

      {liveStreams.length === 0 ? (
        <EmptyPanel
          icon={<FiWifiOff />}
          title="Sin directos"
          text="Cuando un streamer inicie transmisión, aparecerá aquí."
        />
      ) : (
        liveStreams.slice(0, 4).map((stream) => (
          <SideListItem key={stream.id} to={`/streams/${stream.id}`}>
            <Avatar>{stream.avatar}</Avatar>
            <span>{stream.channel}</span>
            <small>{stream.viewers}</small>
          </SideListItem>
        ))
      )}

      <PanelHeader>
        <strong>Podcasts</strong>
        <Link to="/podcasts">Ver todos</Link>
      </PanelHeader>

      {podcasts.slice(0, 3).map((podcast) => (
        <SideListItem key={podcast.id} to={`/podcasts/${podcast.id}`}>
          <Avatar>{getInitials(podcast.title)}</Avatar>
          <span>{podcast.title}</span>
          <small>{podcast.duration}</small>
        </SideListItem>
      ))}
    </SidePanel>
  );
}
