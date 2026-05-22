import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiHeadphones,
  FiMic,
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  ButtonRow,
  FeaturedFlag,
  Field,
  GhostLink,
  HeroCopy,
  HeroGrid,
  HeroMedia,
  HeroOverlay,
  MetaLine,
  Muted,
  Panel,
  PanelHeader,
  PodcastCover,
  PodcastGrid,
  PodcastTile,
  PrimaryLink,
  ServicePill,
  StateIcon,
  StatePanel,
} from "../../../shared/styles/legacyStyled";
import { getPodcasts, type PodcastItem } from "../services/podcastsCatalogService";

type LoadState = "loading" | "online" | "offline";

export default function PodcastsPage() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("Cargando podcasts reales...");
  const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPodcasts() {
      setLoadState("loading");
      setMessage("Cargando podcasts reales desde podcasts-service...");

      try {
        const items = await getPodcasts();

        if (!active) return;

        setPodcasts(items);
        setLoadState("online");
        setMessage("podcasts-service está activo y entregó el catálogo real.");
      } catch (error) {
        console.error("PODCASTS_LOAD_ERROR", error);

        if (!active) return;

        setPodcasts([]);
        setLoadState("offline");
        setMessage(
          error instanceof Error
            ? error.message
            : "No se pudo cargar podcasts-service mediante el gateway."
        );
      }
    }

    loadPodcasts();

    return () => {
      active = false;
    };
  }, []);

  const filteredPodcasts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return podcasts;

    return podcasts.filter((podcast) => {
      const text = [
        podcast.title,
        podcast.description,
        podcast.category || "",
        podcast.latestEpisode || "",
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(normalizedSearch);
    });
  }, [podcasts, search]);

  return (
    <RootShell active="podcasts">
      <HeroGrid>
        <HeroCopy>
          <h1>Podcasts ROOTBLEND</h1>
          <p>
            Catálogo público conectado a podcasts-service. Aquí se prueban visualmente
            HU-012, HU-013 y HU-014: listar podcasts, ver episodios y reproducir audio.
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
            <p>Sin mocks: los elementos salen de la base de datos del servicio Laravel.</p>
          </HeroOverlay>
        </HeroMedia>
      </HeroGrid>

      {loadState === "loading" ? (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando servicio</strong>
            <p>{message}</p>
          </div>
        </AlertPanel>
      ) : null}

      {loadState === "offline" ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Podcasts no disponible</strong>
            <p>{message}</p>
          </div>
        </AlertPanel>
      ) : null}

      {loadState === "online" ? (
        <AlertPanel>
          <FiCheckCircle />
          <div>
            <strong>Servicio disponible</strong>
            <p>{message}</p>
          </div>
        </AlertPanel>
      ) : null}

      <Panel>
        <PanelHeader>
          <strong>Podcasts disponibles</strong>
          <ServicePill $status={loadState === "online" ? "Operativo" : "Degradado"}>
            {loadState === "online" ? `${podcasts.length} reales` : "Sin conexión"}
          </ServicePill>
        </PanelHeader>

        <Field>
          <FiSearch />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar podcast, categoría o episodio..."
          />
        </Field>

        {filteredPodcasts.length > 0 ? (
          <PodcastGrid>
            {filteredPodcasts.map((podcast) => (
              <PodcastTile key={podcast.id} to={`/podcasts/${podcast.id}`}>
                <PodcastCover $image={podcast.cover || brandAssets.podcastsCategoria}>
                  <FiHeadphones />
                </PodcastCover>

                <div>
                  <h3>{podcast.title}</h3>
                  <MetaLine>
                    <span>{podcast.category || "Sin categoría"}</span>
                    <span>{podcast.episodes} episodios</span>
                    <span>{podcast.plays ?? 0} reproducciones</span>
                  </MetaLine>
                  <Muted>{podcast.description}</Muted>
                  <small>
                    Último episodio: {podcast.latestEpisode || "Todavía sin episodios publicados"}
                  </small>
                </div>
              </PodcastTile>
            ))}
          </PodcastGrid>
        ) : (
          <StatePanel>
            <StateIcon>
              <FiHeadphones />
            </StateIcon>
            <h2>No hay podcasts para mostrar</h2>
            <p>
              Crea un podcast desde el panel podcaster y vuelve a esta pantalla: debe aparecer
              aquí sin usar consola.
            </p>
          </StatePanel>
        )}
      </Panel>
    </RootShell>
  );
}
