import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiFile, FiHeadphones, FiLink } from "react-icons/fi";
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

export default function UploadEpisodePage() {
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState<PodcasterPodcast[]>([]);
  const [selectedPodcastId, setSelectedPodcastId] = useState("");
  const [title, setTitle] = useState("El impacto de la IA en 2026");
  const [description, setDescription] = useState("Descripción breve del episodio.");
  const [episodeNumber, setEpisodeNumber] = useState("1");
  const [duration, setDuration] = useState("00:25:00");
  const [audioUrl, setAudioUrl] = useState("");
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

    if (!audioUrl.trim()) {
      setError("Para la prueba visual pega una URL de audio MP3, WAV o M4A.");
      throw new Error("Falta URL de audio.");
    }

    const created = await createEpisode(selectedPodcastId, {
      titulo: title.trim(),
      descripcion: description.trim(),
      duracion: duration,
      estado: "publicado",
      numero_episodio: Number(episodeNumber) || undefined,
      url_archivo: audioUrl.trim(),
      formato: audioUrl.split(".").pop()?.split("?")[0] || "mp3",
    });

    navigate(`/podcasts/${created.podcastId || selectedPodcastId}`);
  }

  return (
    <CreatorForm
      title="Subir episodio"
      subtitle="Carga el audio, completa metadatos y publica. Para la prueba visual usaremos URL de audio."
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

      <Label>URL del audio</Label>
      <Field>
        <FiLink />
        <input
          value={audioUrl}
          onChange={(event) => setAudioUrl(event.target.value)}
          placeholder="https://.../episodio.mp3"
        />
      </Field>

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
