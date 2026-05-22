import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiFile, FiHeadphones, FiLink, FiUpload, FiVideo } from "react-icons/fi";
import {
  AlertPanel,
  Field,
  Label,
  Select,
  TextArea,
} from "../../../../shared/styles/legacyStyled";
import { CreatorForm } from "../../shared/creatorLegacy";
import {
  createEpisode,
  getPodcasterPodcasts,
  type PodcasterPodcast,
} from "../services/podcasterCreatorService";

type AudioSource = "file" | "url" | "youtube";

function extensionFromUrl(value: string): string {
  return value.split(".").pop()?.split("?")[0]?.split("#")[0] || "mp3";
}

export default function UploadEpisodePage() {
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState<PodcasterPodcast[]>([]);
  const [selectedPodcastId, setSelectedPodcastId] = useState("");
  const [title, setTitle] = useState("El impacto de la IA en 2026");
  const [description, setDescription] = useState("Descripción breve del episodio.");
  const [episodeNumber, setEpisodeNumber] = useState("1");
  const [duration, setDuration] = useState("00:25:00");
  const [audioSource, setAudioSource] = useState<AudioSource>("file");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPodcasts() {
      try {
        const items = await getPodcasterPodcasts();

        if (!active) return;

        setPodcasts(items);
        setSelectedPodcastId(items[0]?.id || "");
      } catch (loadError) {
        console.error("UPLOAD_EPISODE_PODCASTS_ERROR", loadError);

        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar tus podcasts.");
        }
      }
    }

    loadPodcasts();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit() {
    setError("");

    if (!selectedPodcastId) {
      setError("Primero crea un podcast para poder subir episodios.");
      throw new Error("Primero crea un podcast para poder subir episodios.");
    }

    if (audioSource === "file" && !audioFile) {
      throw new Error("Selecciona un archivo de audio desde tu PC.");
    }

    if (audioSource === "url" && !audioUrl.trim()) {
      throw new Error("Pega una URL directa de audio MP3, WAV, M4A, OGG o AAC.");
    }

    if (audioSource === "youtube" && !youtubeUrl.trim()) {
      throw new Error("Pega un enlace de YouTube.");
    }

    const created = await createEpisode(selectedPodcastId, {
      titulo: title.trim(),
      descripcion: description.trim(),
      duracion: duration,
      estado: "publicado",
      numero_episodio: Number(episodeNumber) || undefined,
      audio: audioSource === "file" ? audioFile : null,
      url_archivo: audioSource === "url" ? audioUrl.trim() : undefined,
      youtube_url: audioSource === "youtube" ? youtubeUrl.trim() : undefined,
      formato: audioSource === "url" ? extensionFromUrl(audioUrl) : undefined,
    });

    navigate(`/podcasts/${created.podcastId || selectedPodcastId}`);
  }

  return (
    <CreatorForm
      title="Subir episodio"
      subtitle="Publica el episodio con audio desde tu PC, una URL directa o YouTube."
      button="Publicar episodio"
      onSubmit={handleSubmit}
    >
      {error ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      ) : null}

      <Label>Podcast</Label>
      <Select value={selectedPodcastId} onChange={(event) => setSelectedPodcastId(event.target.value)}>
        {podcasts.length === 0 ? <option value="">Primero crea un podcast</option> : null}
        {podcasts.map((podcast) => (
          <option key={podcast.id} value={podcast.id}>
            {podcast.title}
          </option>
        ))}
      </Select>

      <Label>Fuente del audio</Label>
      <Select value={audioSource} onChange={(event) => setAudioSource(event.target.value as AudioSource)}>
        <option value="file">Subir audio desde mi PC</option>
        <option value="url">URL directa de audio</option>
        <option value="youtube">Link de YouTube</option>
      </Select>

      {audioSource === "file" ? (
        <>
          <Label>Archivo de audio</Label>
          <Field>
            <FiUpload />
            <input
              type="file"
              accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/ogg,.mp3,.wav,.m4a,.aac,.ogg"
              onChange={(event) => setAudioFile(event.target.files?.[0] || null)}
            />
          </Field>
          <small>Formatos permitidos: MP3, WAV, M4A, OGG o AAC. Máximo 100MB.</small>
        </>
      ) : null}

      {audioSource === "url" ? (
        <>
          <Label>URL directa del audio</Label>
          <Field>
            <FiLink />
            <input
              value={audioUrl}
              onChange={(event) => setAudioUrl(event.target.value)}
              placeholder="https://.../episodio.mp3"
            />
          </Field>
        </>
      ) : null}

      {audioSource === "youtube" ? (
        <>
          <Label>Link de YouTube</Label>
          <Field>
            <FiVideo />
            <input
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Field>
          <small>Se mostrará como reproductor embebido de YouTube en el detalle del podcast.</small>
        </>
      ) : null}

      <Label>Título del episodio</Label>
      <Field>
        <FiHeadphones />
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </Field>

      <Label>Descripción</Label>
      <TextArea value={description} onChange={(event) => setDescription(event.target.value)} />

      <Label>Número de episodio</Label>
      <Field>
        <FiFile />
        <input value={episodeNumber} onChange={(event) => setEpisodeNumber(event.target.value)} />
      </Field>

      <Label>Duración estimada</Label>
      <Field>
        <FiFile />
        <input value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="00:25:00" />
      </Field>
    </CreatorForm>
  );
}
