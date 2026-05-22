import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiHeadphones,
  FiMic,
  FiPlus,
  FiRefreshCw,
  FiServer,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  ButtonRow,
  FeaturedFlag,
  GhostLink,
  HeroCopy,
  HeroGrid,
  HeroMedia,
  HeroOverlay,
  InfoGrid,
  MetricCard,
  Muted,
  Panel,
  PanelHeader,
  PrimaryLink,
  ServicePill,
  StateIcon,
  StatePanel,
} from "../../../shared/styles/legacyStyled";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

type PodcastsHealthState = "loading" | "online" | "offline";

export default function PodcastsPage() {
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
          setHealthMessage("podcasts-service está activo y responde por gateway.");
        } else {
          setHealthState("offline");
          setHealthMessage(
            "podcasts-service respondió, pero no devolvió el formato esperado."
          );
        }
      } catch (error) {
        console.error("PODCASTS_HEALTH_ERROR", error);

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
      <HeroGrid>
        <HeroCopy>
          <h1>Podcasts ROOTBLEND</h1>
          <p>
            Explora contenido de audio dentro de la plataforma. Esta sección ya
            está preparada para consumir podcasts reales desde podcasts-service.
          </p>

          <ButtonRow>
            <PrimaryLink to="/creator/podcaster/create-podcast">
              <FiPlus /> Crear podcast
            </PrimaryLink>

            <GhostLink to="/creator/activate">
              <FiMic /> Activar canal podcaster
            </GhostLink>
          </ButtonRow>
        </HeroCopy>

        <HeroMedia $image={brandAssets.podcastsCategoria}>
          <FeaturedFlag>PODCASTS</FeaturedFlag>

          <HeroOverlay>
            <h3>Catálogo de audio</h3>
            <p>Sin datos falsos: aquí aparecerán podcasts reales.</p>
          </HeroOverlay>
        </HeroMedia>
      </HeroGrid>

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
            <strong>Estado del módulo</strong>
            <ServicePill
              $status={healthState === "online" ? "Operativo" : "Degradado"}
            >
              {healthState === "online" ? "Operativo" : "Pendiente"}
            </ServicePill>
          </PanelHeader>

          <MetricCard>
            <FiServer />
            <div>
              <strong>podcasts-service</strong>
              <Muted>
                El microservicio existe y se valida mediante el gateway.
              </Muted>
            </div>
          </MetricCard>

          <MetricCard>
            <FiHeadphones />
            <div>
              <strong>Catálogo real</strong>
              <Muted>
                Pendiente de implementar en las historias HU-043 a HU-050.
              </Muted>
            </div>
          </MetricCard>
        </Panel>

        <Panel>
          <PanelHeader>
            <strong>Podcasts disponibles</strong>
          </PanelHeader>

          <StatePanel>
            <StateIcon>
              <FiHeadphones />
            </StateIcon>

            <h2>No hay podcasts reales publicados</h2>

            <p>
              La sección ya está lista y no muestra contenido inventado. Cuando
              implementemos crear podcast, subir episodios y listar episodios,
              aquí aparecerá el catálogo real.
            </p>
          </StatePanel>
        </Panel>
      </InfoGrid>
    </RootShell>
  );
}