import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";
import { RootShell } from "../../../../shared/layout";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import { formatDate, getInitials } from "../../../../shared/utils/rootblendHelpers";
import {
  AlertPanel,
  Avatar,
  ChannelDataPanel,
  ChannelHero,
  Eyebrow,
  MetricGrid,
  PrimaryLink,
} from "../../../../shared/styles/legacyStyled";
import { CreatorNav } from "../../shared/creatorLegacy";
import {
  getMyChannel,
  getMyStreams,
  type Canal as BackendCanal,
  type Stream as BackendStream,
} from "../../../streams/services/streamsService";
import { StatCard } from "../../../public/utils/publicLegacyHelpers";

function isImageUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("http://") || value.startsWith("https://");
}

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

        if (!active) {
          return;
        }

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
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCreatorData();

    return () => {
      active = false;
    };
  }, []);

  const sortedStreams = useMemo(() => {
    return [...myStreams].sort((a, b) => {
      const aDate = a.fecha_inicio || a.fecha_fin || "";
      const bDate = b.fecha_inicio || b.fecha_fin || "";

      return String(bDate).localeCompare(String(aDate));
    });
  }, [myStreams]);

  const totalStreams = myStreams.length;

  const liveStreams = myStreams.filter(
    (stream) => stream.estado === "en_vivo"
  ).length;

  const scheduledStreams = myStreams.filter(
    (stream) => stream.estado === "programado"
  ).length;

  const finishedStreams = myStreams.filter(
    (stream) => stream.estado === "finalizado"
  ).length;

  const featuredStreams = myStreams.filter(
    (stream) => stream.destacado
  ).length;

  const latestStream = sortedStreams[0] || myStreams[0];

  const channelInitials = getInitials(channel?.nombre_canal || "RB");

  const roleName =
    channel?.tipo_canal?.nombre_tipo === "podcaster" ? "Podcaster" : "Streamer";

  const channelBanner = channel?.banner_canal || "";
  const channelPhoto = channel?.foto_canal || "";

  return (
    <RootShell active="creator">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "235px minmax(0, 1fr)",
          gap: 24,
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <CreatorNav />

        <main
          style={{
            minWidth: 0,
            display: "grid",
            gap: 20,
          }}
        >
          <ChannelHero
            $image={
              isImageUrl(channelBanner)
                ? channelBanner
                : brandAssets.streamerPanel
            }
            style={{
              minHeight: 230,
            }}
          >
            <Avatar $large>
              {isImageUrl(channelPhoto) ? (
                <img
                  src={channelPhoto}
                  alt={channel?.nombre_canal || "Canal"}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                channelInitials
              )}
            </Avatar>

            <div>
              <Eyebrow>ROOTBLEND Creator</Eyebrow>
              <h1>{channel?.nombre_canal || "Panel del streamer"}</h1>
              <p>
                {channel?.descripcion ||
                  "Aquí verás los datos reales de tu canal y los streams creados desde la plataforma."}
              </p>
            </div>
          </ChannelHero>

          {loading ? (
            <AlertPanel>
              <FiRefreshCw />
              <div>
                <strong>Cargando tu canal</strong>
                <p>Consultando la información registrada en la plataforma.</p>
              </div>
            </AlertPanel>
          ) : null}

          {error ? (
            <AlertPanel>
              <FiAlertTriangle />
              <div>
                <strong>No se pudieron cargar los datos</strong>
                <p>{error}</p>
              </div>
            </AlertPanel>
          ) : null}

          {!loading && !error && !channel ? (
            <AlertPanel>
              <FiAlertTriangle />
              <div>
                <strong>No tienes un canal activo</strong>
                <p>
                  Activa tu canal para administrar streams, momentos y
                  estadísticas.
                </p>
              </div>

              <PrimaryLink to="/creator/activate">Activar canal</PrimaryLink>
            </AlertPanel>
          ) : null}

          {!loading && !error && channel ? (
            <>
              <MetricGrid>
                <StatCard
                  label="Tipo de canal"
                  value={roleName}
                  trend={
                    channel.estado_canal === "activo" ? "Activo" : "Inactivo"
                  }
                />

                <StatCard
                  label="Streams creados"
                  value={String(totalStreams)}
                  trend={`${scheduledStreams} programados`}
                />

                <StatCard
                  label="En vivo ahora"
                  value={String(liveStreams)}
                  trend={`${finishedStreams} finalizados`}
                />

                <StatCard
                  label="Momentos destacados"
                  value={String(featuredStreams)}
                  trend="Streams marcados como destacados"
                />
              </MetricGrid>

              <ChannelDataPanel>
                <strong>Información registrada del canal</strong>

                <p>
                  <b>Nombre:</b> {channel.nombre_canal}
                </p>

                <p>
                  <b>Descripción:</b>{" "}
                  {channel.descripcion || "Sin descripción registrada."}
                </p>

                <p>
                  <b>Foto de canal:</b>{" "}
                  {channel.foto_canal ? "Configurada" : "Pendiente"}
                </p>

                <p>
                  <b>Banner de canal:</b>{" "}
                  {channel.banner_canal ? "Configurado" : "Pendiente"}
                </p>

                <p>
                  <b>Fecha de creación:</b> {formatDate(channel.fecha_creacion)}
                </p>

                <p>
                  <b>Último stream:</b>{" "}
                  {latestStream
                    ? `${latestStream.titulo} (${latestStream.estado})`
                    : "Aún no creaste streams."}
                </p>
              </ChannelDataPanel>
            </>
          ) : null}
        </main>
      </div>
    </RootShell>
  );
}