import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheckCircle,
  FiHeadphones,
  FiList,
  FiPause,
  FiPlay,
  FiRefreshCw,
  FiServer,
  FiVolumeX,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  ButtonRow,
  ChannelHero,
  Eyebrow,
  GhostLink,
  InfoGrid,
  MetricCard,
  Muted,
  Panel,
  PanelHeader,
  PodcastCover,
  ServicePill,
  StateIcon,
  StatePanel,
} from "../../../shared/styles/legacyStyled";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

type PodcastsHealthState = "loading" | "online" | "offline";

export default function PodcastDetailPage() {
  const { podcastId } = useParams();
  const [healthState, setHealthState] =
    useState<PodcastsHealthState>("loading");
  const [healthMessage, setHealthMessage] = useState(
    "Verificando podcasts-service..."
  );

  useEffect(() => {
    let active = true;

    async function checkPodcastsService() {
      setHealthState("loading");
      setHealthMessage("Verificando podcasts-service...");

      try {
        const response = await fetch(`${API_BASE_URL}/api/podcasts-health/`);
        const result = await response.json().catch(() => null);

        if (!active) return;

        if (response.ok && result?.status === "ok") {
          setHealthState("online");
          setHealthMessage(
            "podcasts-service está activo, pero todavía no existen podcasts ni archivos de audio reales."
          );
        } else {
          setHealthState("offline");
          setHealthMessage(
            "podcasts-service respondió, pero no devolvió el formato esperado."
          );
        }
      } catch (error) {
        console.error("PODCAST_DETAIL_HEALTH_ERROR", error);

        if (active) {
          setHealthState("offline");
          setHealthMessage(
            "No se pudo conectar con podcasts-service mediante el gateway."
          );
        }
      }
    }

    checkPodcastsService();

    return () => {
      active = false;
    };
  }, []);

  return (
    <RootShell active="podcasts">
      <ChannelHero $image={brandAssets.podcastsCategoria}>
        <PodcastCover $image={brandAssets.podcastsCategoria}>
          <FiHeadphones />
        </PodcastCover>

        <div>
          <Eyebrow>Detalle de podcast</Eyebrow>
          <h1>Podcast {podcastId || "sin seleccionar"}</h1>
          <p>
            Esta vista ya no muestra episodios ni reproducciones inventadas.
            Cuando exista el backend real, aquí se cargará el audio del episodio.
          </p>

          <ButtonRow>
            <GhostLink to="/podcasts">
              <FiArrowLeft /> Volver a podcasts
            </GhostLink>
          </ButtonRow>
        </div>
      </ChannelHero>

      {healthState === "loading" && (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Verificando servicio</strong>
            <p>{healthMessage}</p>
          </div>
        </AlertPanel>
      )}

      {healthState === "offline" && (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Podcasts no disponible</strong>
            <p>{healthMessage}</p>
          </div>
        </AlertPanel>
      )}

      {healthState === "online" && (
        <AlertPanel>
          <FiCheckCircle />
          <div>
            <strong>Servicio disponible</strong>
            <p>{healthMessage}</p>
          </div>
        </AlertPanel>
      )}

      <InfoGrid>
        <Panel>
          <PanelHeader>
            <strong>Podcast solicitado</strong>
            <ServicePill
              $status={healthState === "online" ? "Operativo" : "Degradado"}
            >
              {healthState === "online" ? "Servicio activo" : "Pendiente"}
            </ServicePill>
          </PanelHeader>

          <MetricCard>
            <FiServer />
            <div>
              <strong>ID solicitado</strong>
              <Muted>{podcastId || "No especificado"}</Muted>
            </div>
          </MetricCard>

          <MetricCard>
            <FiHeadphones />
            <div>
              <strong>Catálogo real</strong>
              <Muted>
                Pendiente de crear endpoints reales de podcasts, episodios y
                archivos de audio en podcasts-service.
              </Muted>
            </div>
          </MetricCard>
        </Panel>

        <Panel>
          <PanelHeader>
            <strong>Episodios</strong>
          </PanelHeader>

          <StatePanel>
            <StateIcon>
              <FiList />
            </StateIcon>

            <h2>No hay episodios reales para mostrar</h2>

            <p>
              Esta página ya está limpia de mocks. Cuando implementemos crear
              podcast, subir episodio y listar episodios, aquí aparecerán título,
              duración y fecha de cada episodio real.
            </p>
          </StatePanel>
        </Panel>

        <Panel>
          <PanelHeader>
            <strong>Reproductor de podcast</strong>
            <ServicePill $status="Degradado">Sin audio real</ServicePill>
          </PanelHeader>

          <StatePanel>
            <StateIcon>
              <FiVolumeX />
            </StateIcon>

            <h2>Archivo de audio no disponible</h2>

            <p>
              No se puede reproducir este podcast porque todavía no existe un
              episodio real con archivo de audio cargado desde podcasts-service.
            </p>

            <MetricCard>
              <FiPlay />
              <div>
                <strong>Reproducir</strong>
                <Muted>Bloqueado hasta tener archivo real MP3 o WAV.</Muted>
              </div>
            </MetricCard>

            <MetricCard>
              <FiPause />
              <div>
                <strong>Pausar / continuar</strong>
                <Muted>
                  Se habilitará automáticamente cuando conectemos episodios
                  reales.
                </Muted>
              </div>
            </MetricCard>
          </StatePanel>
        </Panel>
      </InfoGrid>
    </RootShell>
  );
}