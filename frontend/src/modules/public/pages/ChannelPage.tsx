import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCompass,
  FiHeart,
  FiPlay,
  FiRefreshCw,
  FiStar,
  FiWifiOff,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets, type StreamItem } from "../../../shared/mock/rootblendMock";
import {
  getChannels as getBackendChannels,
  getLiveStreams,
  type Canal as BackendCanal,
} from "../../streams/services/streamsService";
import {
  AlertPanel,
  Avatar,
  ButtonRow,
  CardGrid,
  ChannelHero,
  FilterChip,
  GhostLink,
  PrimaryLink,
  Tabs,
} from "../../../shared/styles/legacyStyled";
import {
  backendStreamToCard,
  DemoRightPanel,
  EmptyPanel,
  getInitials,
  Section,
  StreamCard,
} from "../utils/publicLegacyHelpers";

export default function ChannelPage() {
  const { channelId } = useParams();
  const [channel, setChannel] = useState<BackendCanal | null>(null);
  const [channelStreams, setChannelStreams] = useState<StreamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadChannelPage() {
      if (!channelId || Number.isNaN(Number(channelId))) {
        setError("Canal inválido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [channelsResult, liveStreamsResult] = await Promise.all([
          getBackendChannels(),
          getLiveStreams(),
        ]);

        if (!active) return;

        const selectedChannel = channelsResult.find(
          (item) => item.id_canal === Number(channelId)
        );

        if (!selectedChannel) {
          setChannel(null);
          setChannelStreams([]);
          setError("No encontramos ese canal.");
          return;
        }

        setChannel(selectedChannel);
        setChannelStreams(
          liveStreamsResult
            .filter((stream) => stream.canal.id_canal === selectedChannel.id_canal)
            .map(backendStreamToCard)
        );
      } catch (error) {
        console.error("CHANNEL_PAGE_LOAD_ERROR", error);

        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "No pudimos cargar la información del canal. Intenta actualizar la página."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadChannelPage();

    return () => {
      active = false;
    };
  }, [channelId]);

  const isStreamer = channel?.tipo_canal?.nombre_tipo === "streamer";
  const channelInitials = getInitials(channel?.nombre_canal || "RB");
  const mainStream = channelStreams[0];

  return (
    <RootShell active="streams" rightPanel={<DemoRightPanel />}>
      <ChannelHero $image={channel?.banner_canal || brandAssets.channelView}>
        <Avatar $large>{channelInitials}</Avatar>
        <div>
          <h1>{channel?.nombre_canal || "Canal"}</h1>
          <p>
            {channel
              ? `${channel.descripcion || "Este canal aún no tiene descripción."} · ${isStreamer ? "Streamer" : "Podcaster"}`
              : "Cargando información del canal..."}
          </p>
          {channel && (
            <ButtonRow>
              {mainStream ? (
                <PrimaryLink to={`/streams/${mainStream.id}`}><FiPlay /> Ver directo</PrimaryLink>
              ) : (
                <PrimaryLink to="/streams"><FiCompass /> Explorar directos</PrimaryLink>
              )}
              <GhostLink to="/subscriptions"><FiHeart /> Suscribirse</GhostLink>
            </ButtonRow>
          )}
        </div>
      </ChannelHero>

      {loading && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando canal</strong>
            <p>Consultando la información registrada del creador.</p>
          </div>
        </AlertPanel>
      )}

      {error && (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>No se pudo cargar el canal</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      )}

      {!loading && !error && channel && (
        <>
          <Tabs>
            {["Inicio", "Acerca de", "Calendario", "Videos", "Clips", "Chat"].map((tab, index) => (
              <FilterChip key={tab} $active={index === 0}>{tab}</FilterChip>
            ))}
          </Tabs>

          <Section title="En vivo ahora">
            {channelStreams.length === 0 ? (
              <EmptyPanel
                icon={<FiWifiOff />}
                title="Sin directos activos"
                text="Este canal no tiene una transmisión en vivo en este momento."
              />
            ) : (
              <CardGrid>
                {channelStreams.map((stream) => <StreamCard key={stream.id} stream={stream} />)}
              </CardGrid>
            )}
          </Section>

          <Section title="Momentos destacados">
            <EmptyPanel
              icon={<FiStar />}
              title="Sin momentos destacados"
              text="Cuando este creador suba clips destacados, aparecerán aquí."
            />
          </Section>
        </>
      )}
    </RootShell>
  );
}
