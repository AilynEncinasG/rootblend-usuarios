import { useEffect, useState } from "react";
import { FiActivity, FiAlertTriangle, FiPlus, FiRadio, FiRefreshCw, FiShield, FiStar } from "react-icons/fi";
import { RootShell } from "../../../../shared/layout";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import { formatDate, getInitials } from "../../../../shared/utils/rootblendHelpers";
import { getMyChannel, getMyStreams, type Canal as BackendCanal, type Stream as BackendStream } from "../../../streams/services/streamsService";
import { AlertPanel, Avatar, ChannelDataPanel, ChannelHero, CreatorLayout, CreatorMain, Eyebrow, GhostLink, MetricGrid, PrimaryLink, QuickActions } from "../../../../shared/styles/legacyStyled";
import { CreatorNav } from "../../shared/creatorLegacy";
import { StatCard } from "../../../public/utils/publicLegacyHelpers";
export default function StreamerDashboardPage() {
  const [channel, setChannel] = useState<BackendCanal | null>(null);
  const [myStreams, setMyStreams] = useState<BackendStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCreatorData() {
      try {
        setLoading(true);
        setError("");

        const [channelResult, streamsResult] = await Promise.all([
          getMyChannel(),
          getMyStreams(),
        ]);

        if (!active) return;

        setChannel(channelResult.canal);
        setMyStreams(streamsResult);
      } catch (error) {
        console.error("STREAMER_DASHBOARD_LOAD_ERROR", error);

        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "No pudimos cargar los datos de tu canal. Intenta actualizar la página."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCreatorData();

    return () => {
      active = false;
    };
  }, []);

  const totalStreams = myStreams.length;
  const liveStreams = myStreams.filter((stream) => stream.estado === "en_vivo").length;
  const scheduledStreams = myStreams.filter((stream) => stream.estado === "programado").length;
  const finishedStreams = myStreams.filter((stream) => stream.estado === "finalizado").length;
  const featuredStreams = 0;
  const latestStream = myStreams[0];
  const channelInitials = getInitials(channel?.nombre_canal || "RB");
  const roleName = channel?.tipo_canal?.nombre_tipo === "podcaster" ? "Podcaster" : "Streamer";

  return (
    <RootShell active="creator">
      <CreatorLayout>
        <CreatorNav />
        <CreatorMain>
          <ChannelHero $image={channel?.banner_canal || brandAssets.streamerPanel}>
            <Avatar $large>{channelInitials}</Avatar>
            <div>
              <Eyebrow>ROOTBLEND Creator</Eyebrow>
              <h1>{channel?.nombre_canal || "Panel del streamer"}</h1>
              <p>
                {channel?.descripcion ||
                  "Aquí verás los datos reales de tu canal y los streams creados desde la plataforma."}
              </p>
            </div>
          </ChannelHero>

          {loading && (
            <AlertPanel>
              <FiRefreshCw />
              <div>
                <strong>Cargando tu canal</strong>
                <p>Consultando la información registrada en la plataforma.</p>
              </div>
            </AlertPanel>
          )}

          {error && (
            <AlertPanel>
              <FiAlertTriangle />
              <div>
                <strong>No se pudieron cargar los datos</strong>
                <p>{error}</p>
              </div>
            </AlertPanel>
          )}

          {!loading && !error && !channel && (
            <AlertPanel>
              <FiAlertTriangle />
              <div>
                <strong>No tienes un canal activo</strong>
                <p>Activa tu canal para administrar streams, momentos y estadísticas.</p>
              </div>
              <PrimaryLink to="/creator/activate">Activar canal</PrimaryLink>
            </AlertPanel>
          )}

          {!loading && !error && channel && (
            <>
              <MetricGrid>
                <StatCard label="Tipo de canal" value={roleName} trend={channel.estado_canal === "activo" ? "Activo" : "Inactivo"} />
                <StatCard label="Streams creados" value={String(totalStreams)} trend={`${scheduledStreams} programados`} />
                <StatCard label="En vivo ahora" value={String(liveStreams)} trend={`${finishedStreams} finalizados`} />
                <StatCard label="Momentos destacados" value={String(featuredStreams)} trend="Se actualiza al subir clips" />
              </MetricGrid>

              <ChannelDataPanel>
                <strong>Información registrada del canal</strong>
                <p><b>Nombre:</b> {channel.nombre_canal}</p>
                <p><b>Descripción:</b> {channel.descripcion || "Sin descripción registrada."}</p>
                <p><b>Fecha de creación:</b> {formatDate(channel.fecha_creacion)}</p>
                <p><b>Último stream:</b> {latestStream ? `${latestStream.titulo} (${latestStream.estado})` : "Aún no creaste streams."}</p>
              </ChannelDataPanel>

              <QuickActions>
                <PrimaryLink to="/creator/streamer/control"><FiRadio /> Iniciar transmision</PrimaryLink>
                <GhostLink to="/creator/streamer/create-stream"><FiPlus /> Configurar stream</GhostLink>
                <GhostLink to="/creator/streamer/highlights"><FiStar /> Momentos</GhostLink>
                <GhostLink to="/creator/streamer/stats"><FiActivity /> Estadisticas</GhostLink>
                <GhostLink to="/moderation/moderators"><FiShield /> Moderadores</GhostLink>
              </QuickActions>
            </>
          )}
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}
