import { useEffect, useState } from "react";
import { FiArrowRight, FiRefreshCw, FiUsers, FiWifiOff } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import {
  getChannels as getBackendChannels,
  type Canal as BackendCanal,
} from "../../streams/services/streamsService";
import {
  AlertPanel,
  Avatar,
  CardTitle,
  Muted,
  PageHeading,
  PodcastGrid,
  PodcastTile,
  SectionBlock,
  SectionHeader,
  StateIcon,
  StatePanel,
} from "../../../shared/styles/legacyStyled";

type CreatorItem = {
  id: string;
  name: string;
  subtitle: string;
  avatar: string;
  photo?: string | null;
};

function getInitials(value?: string | null) {
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

function isImageUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("http://") || value.startsWith("https://");
}

function backendChannelToCreator(channel: BackendCanal): CreatorItem {
  return {
    id: String(channel.id_canal),
    name: channel.nombre_canal,
    subtitle: channel.tipo_canal?.nombre_tipo || "Canal de creador",
    avatar: getInitials(channel.nombre_canal),
    photo: channel.foto_canal,
  };
}

function CreatorAvatar({ creator }: { creator: CreatorItem }) {
  if (isImageUrl(creator.photo)) {
    return (
      <Avatar>
        <img
          src={creator.photo || ""}
          alt={creator.name}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Avatar>
    );
  }

  return <Avatar>{creator.avatar}</Avatar>;
}

function EmptyPanel({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
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

export default function CreatorsPage() {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCreators() {
      setLoading(true);
      setError("");

      try {
        const channelsResult = await getBackendChannels();

        if (!active) return;

        setCreators(channelsResult.map(backendChannelToCreator));
      } catch (error) {
        console.error("CREATORS_LOAD_ERROR", error);

        if (active) {
          setError(
            "No pudimos cargar las cuentas registradas en este momento."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCreators();

    return () => {
      active = false;
    };
  }, []);

  return (
    <RootShell active="home">
        <SectionBlock>
            <SectionHeader>
                <PageHeading>
                    <h1>Cuentas registradas</h1>
                </PageHeading>
            </SectionHeader>

            {error ? (
            <AlertPanel>
                <FiWifiOff />
                <div>
                    <strong>No se pudo cargar la información</strong>
                    <p>{error}</p>
                </div>
            </AlertPanel>
            ) : null}

            {loading ? (
            <AlertPanel>
                <FiRefreshCw />
                <div>
                <strong>Cargando cuentas</strong>
                <p>Consultando los canales registrados.</p>
                </div>
            </AlertPanel>
            ) : null}

            {!loading && creators.length === 0 ? (
            <EmptyPanel
                icon={<FiUsers />}
                title="No hay cuentas registradas"
                text="Cuando los usuarios activen su canal de creador, aparecerán aquí."
            />
            ) : (
            <PodcastGrid>
                {creators.map((creator) => (
                    <PodcastTile key={creator.id} to={`/channels/${creator.id}`}>
                        <CreatorAvatar creator={creator} />
                            <div>
                                <CardTitle>{creator.name}</CardTitle>
                                <Muted>{creator.subtitle}</Muted>
                            </div>
                        <FiArrowRight />
                    </PodcastTile>
                ))}
            </PodcastGrid>
            )}
        </SectionBlock>
    </RootShell>
  );
}