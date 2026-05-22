import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheckCircle,
  FiExternalLink,
  FiHeadphones,
  FiList,
  FiPause,
  FiPlay,
  FiRefreshCw,
  FiVideo,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  AudioBar,
  ButtonRow,
  ChannelHero,
  EpisodeRow,
  Eyebrow,
  GhostLink,
  InfoGrid,
  MetaLine,
  Muted,
  Panel,
  PanelHeader,
  PodcastCover,
  PrimaryButton,
  ServicePill,
  StateIcon,
  StatePanel,
} from "../../../shared/styles/legacyStyled";
import {
  getPodcastById,
  playPodcastEpisode,
  type PodcastEpisode,
  type PodcastItem,
} from "../services/podcastsCatalogService";

type LoadState = "loading" | "online" | "offline";

function audioUrlFor(episode: PodcastEpisode): string | null {
  return episode.audio?.url || episode.audio?.url_archivo || null;
}

function embedUrlFor(episode: PodcastEpisode): string | null {
  return episode.audio?.embedUrl || episode.audio?.embed_url || null;
}

function isYoutubeEpisode(episode: PodcastEpisode): boolean {
  return Boolean(episode.audio?.isYoutube || episode.audio?.is_youtube || episode.audio?.sourceType === "youtube" || episode.audio?.tipo_origen === "youtube");
}

export default function PodcastDetailPage() {
  const { podcastId } = useParams();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("Cargando detalle del podcast...");
  const [podcast, setPodcast] = useState<PodcastItem | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [registeredPlays, setRegisteredPlays] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadPodcast() {
      setLoadState("loading");
      setMessage("Cargando podcast real desde podcasts-service...");

      try {
        const item = await getPodcastById(podcastId);

        if (!active) return;

        setPodcast(item);
        setSelectedEpisodeId(item?.episodeList[0]?.id || null);
        setLoadState("online");
        setMessage("Podcast cargado correctamente desde el backend.");
      } catch (error) {
        console.error("PODCAST_DETAIL_LOAD_ERROR", error);

        if (!active) return;

        setPodcast(null);
        setLoadState("offline");
        setMessage(error instanceof Error ? error.message : "No se pudo cargar el podcast.");
      }
    }

    loadPodcast();

    return () => {
      active = false;
    };
  }, [podcastId]);

  const selectedEpisode = useMemo(() => {
    if (!podcast) return null;

    return (
      podcast.episodeList.find((episode) => episode.id === selectedEpisodeId) ||
      podcast.episodeList[0] ||
      null
    );
  }, [podcast, selectedEpisodeId]);

  async function registerPlay(episode: PodcastEpisode) {
    if (registeredPlays.includes(episode.id)) return;

    setRegisteredPlays((items) => [...items, episode.id]);

    try {
      await playPodcastEpisode(episode.id);
    } catch (error) {
      console.error("PODCAST_PLAY_REGISTER_ERROR", error);
    }
  }

  return (
    <RootShell active="podcasts">
      <ChannelHero $image={podcast?.cover || brandAssets.podcastsCategoria}>
        <PodcastCover $image={podcast?.cover || brandAssets.podcastsCategoria}>
          <FiHeadphones />
        </PodcastCover>

        <div>
          <Eyebrow>Detalle de podcast</Eyebrow>
          <h1>{podcast?.title || `Podcast ${podcastId || "sin seleccionar"}`}</h1>
          <p>{podcast?.description || "Cargando información del podcast."}</p>

          <ButtonRow>
            <GhostLink to="/podcasts">
              <FiArrowLeft /> Volver a podcasts
            </GhostLink>
          </ButtonRow>
        </div>
      </ChannelHero>

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
            <strong>No se pudo abrir el podcast</strong>
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

      <InfoGrid>
        <Panel>
          <PanelHeader>
            <strong>Información</strong>
            <ServicePill $status={loadState === "online" ? "Operativo" : "Degradado"}>
              {loadState === "online" ? "Real" : "Pendiente"}
            </ServicePill>
          </PanelHeader>

          <MetaLine>
            <span>Categoría: {podcast?.category || "Sin categoría"}</span>
            <span>Episodios: {podcast?.episodes ?? 0}</span>
            <span>Reproducciones: {podcast?.plays ?? 0}</span>
          </MetaLine>

          <Muted>
            Último episodio: {podcast?.latestEpisode || "Todavía no hay episodios publicados."}
          </Muted>
        </Panel>

        <Panel>
          <PanelHeader>
            <strong>Episodios</strong>
          </PanelHeader>

          {podcast && podcast.episodeList.length > 0 ? (
            podcast.episodeList.map((episode) => (
              <EpisodeRow key={episode.id}>
                <button type="button" onClick={() => setSelectedEpisodeId(episode.id)}>
                  {selectedEpisode?.id === episode.id ? <FiPause /> : <FiPlay />}
                </button>
                <span>{episode.title}</span>
                <small>{episode.duration}</small>
                <small>{isYoutubeEpisode(episode) ? "YouTube" : episode.audio?.sourceType || episode.audio?.tipo_origen || "Audio"}</small>
                <small>{episode.plays ?? 0} plays</small>
              </EpisodeRow>
            ))
          ) : (
            <StatePanel>
              <StateIcon>
                <FiList />
              </StateIcon>
              <h2>No hay episodios publicados</h2>
              <p>Sube un episodio desde el panel podcaster y aparecerá aquí.</p>
            </StatePanel>
          )}
        </Panel>
      </InfoGrid>

      <Panel>
        <PanelHeader>
          <strong>Reproductor de podcast</strong>
          <ServicePill $status={selectedEpisode && audioUrlFor(selectedEpisode) ? "Operativo" : "Degradado"}>
            {selectedEpisode && audioUrlFor(selectedEpisode)
              ? isYoutubeEpisode(selectedEpisode)
                ? "YouTube disponible"
                : "Audio disponible"
              : "Sin audio"}
          </ServicePill>
        </PanelHeader>

        {selectedEpisode && isYoutubeEpisode(selectedEpisode) && embedUrlFor(selectedEpisode) ? (
          <AudioBar>
            <strong>{selectedEpisode.title}</strong>
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 14, overflow: "hidden", background: "#020617" }}>
              <iframe
                title={selectedEpisode.title}
                src={embedUrlFor(selectedEpisode) || undefined}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
            <ButtonRow>
              <PrimaryButton type="button" onClick={() => registerPlay(selectedEpisode)}>
                <FiVideo /> Registrar reproducción
              </PrimaryButton>
              {audioUrlFor(selectedEpisode) ? (
                <a href={audioUrlFor(selectedEpisode) || "#"} target="_blank" rel="noreferrer">
                  <FiExternalLink /> Abrir en YouTube
                </a>
              ) : null}
            </ButtonRow>
          </AudioBar>
        ) : selectedEpisode && audioUrlFor(selectedEpisode) ? (
          <AudioBar>
            <strong>{selectedEpisode.title}</strong>
            <audio
              controls
              src={audioUrlFor(selectedEpisode) || undefined}
              onPlay={() => registerPlay(selectedEpisode)}
              style={{ width: "100%" }}
            />
            <PrimaryButton type="button" onClick={() => registerPlay(selectedEpisode)}>
              <FiVolume2 /> Registrar play
            </PrimaryButton>
          </AudioBar>
        ) : (
          <StatePanel>
            <StateIcon>
              <FiVolumeX />
            </StateIcon>
            <h2>Archivo de audio no disponible</h2>
            <p>El episodio seleccionado no tiene audio, URL directa o YouTube registrado.</p>
          </StatePanel>
        )}
      </Panel>
    </RootShell>
  );
}
