import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  getPodcasterEpisodes,
  updateEpisode,
  type PodcasterEpisode,
} from "../services/podcasterCreatorService";

type AudioSource = "keep" | "file" | "url" | "youtube";

function audioUrlFor(episode: PodcasterEpisode | null): string {
  return episode?.audio?.url || episode?.audio?.url_archivo || "";
}

function audioSourceFor(episode: PodcasterEpisode | null): AudioSource {
  const source = episode?.audio?.sourceType || episode?.audio?.tipo_origen;

  if (source === "youtube") return "youtube";
  if (source === "archivo") return "file";
  if (source === "url") return "url";
  return "keep";
}

function extensionFromUrl(value: string): string {
  return value.split(".").pop()?.split("?")[0]?.split("#")[0] || "mp3";
}

export default function EditEpisodePage() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<PodcasterEpisode[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [duration, setDuration] = useState("00:25:00");
  const [status, setStatus] = useState("publicado");
  const [audioSource, setAudioSource] = useState<AudioSource>("keep");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEpisode() {
      try {
        const items = await getPodcasterEpisodes();

        if (active) {
          setEpisodes(items);
        }
      } catch (loadError) {
        console.error("EDIT_EPISODE_LOAD_ERROR", loadError);

        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el episodio.");
        }
      }
    }

    loadEpisode();

    return () => {
      active = false;
    };
  }, []);

  const episode = useMemo(() => {
    return episodes.find((item) => item.id === episodeId) || null;
  }, [episodeId, episodes]);

  useEffect(() => {
    if (!episode) return;

    setTitle(episode.title);
    setDescription(episode.description);
    setEpisodeNumber(String(episode.episodeNumber || episode.numero_episodio || ""));
    setDuration(episode.duration || "00:25:00");
    setStatus(episode.estado || (episode.status === "draft" ? "borrador" : "publicado"));
    setAudioSource("keep");
    setAudioUrl(audioUrlFor(episode));
    setYoutubeUrl(audioSourceFor(episode) === "youtube" ? audioUrlFor(episode) : "");
    setAudioFile(null);
  }, [episode]);

  async function handleSubmit() {
    setError("");

    if (!episodeId) {
      throw new Error("No se encontró el episodio para editar.");
    }

    if (audioSource === "file" && !audioFile) {
      throw new Error("Selecciona un nuevo archivo de audio o deja la opción en conservar actual.");
    }

    if (audioSource === "url" && !audioUrl.trim()) {
      throw new Error("Pega una URL directa de audio.");
    }

    if (audioSource === "youtube" && !youtubeUrl.trim()) {
      throw new Error("Pega un enlace de YouTube.");
    }

    await updateEpisode(episodeId, {
      titulo: title.trim(),
      descripcion: description.trim(),
      duracion: duration,
      estado: status,
      numero_episodio: Number(episodeNumber) || undefined,
      audio: audioSource === "file" ? audioFile : null,
      url_archivo: audioSource === "url" ? audioUrl.trim() : undefined,
      youtube_url: audioSource === "youtube" ? youtubeUrl.trim() : undefined,
      formato: audioSource === "url" ? extensionFromUrl(audioUrl) : undefined,
    });

    navigate("/creator/podcaster/episodes");
  }

  return (
    <CreatorForm
      title="Editar episodio"
      subtitle="Actualiza título, descripción, estado, duración y cambia el audio si lo necesitas."
      button="Guardar cambios"
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

      <Label>Título</Label>
      <Field>
        <FiHeadphones />
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </Field>

      <Label>Descripción</Label>
      <TextArea value={description} onChange={(event) => setDescription(event.target.value)} />

      <Label>Estado</Label>
      <Select value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="publicado">Publicado</option>
        <option value="borrador">Borrador</option>
      </Select>

      <Label>Audio</Label>
      <Select value={audioSource} onChange={(event) => setAudioSource(event.target.value as AudioSource)}>
        <option value="keep">Conservar audio actual</option>
        <option value="file">Reemplazar por archivo de mi PC</option>
        <option value="url">Reemplazar por URL directa</option>
        <option value="youtube">Reemplazar por YouTube</option>
      </Select>

      {audioSource === "keep" ? (
        <AlertPanel>
          <FiHeadphones />
          <div>
            <strong>Audio actual</strong>
            <p>{audioUrlFor(episode) || "Este episodio todavía no tiene audio."}</p>
          </div>
        </AlertPanel>
      ) : null}

      {audioSource === "file" ? (
        <>
          <Label>Nuevo archivo de audio</Label>
          <Field>
            <FiUpload />
            <input
              type="file"
              accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/ogg,.mp3,.wav,.m4a,.aac,.ogg"
              onChange={(event) => setAudioFile(event.target.files?.[0] || null)}
            />
          </Field>
        </>
      ) : null}

      {audioSource === "url" ? (
        <>
          <Label>Nueva URL directa del audio</Label>
          <Field>
            <FiLink />
            <input value={audioUrl} onChange={(event) => setAudioUrl(event.target.value)} />
          </Field>
        </>
      ) : null}

      {audioSource === "youtube" ? (
        <>
          <Label>Nuevo link de YouTube</Label>
          <Field>
            <FiVideo />
            <input value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} />
          </Field>
        </>
      ) : null}

      <Label>Número de episodio</Label>
      <Field>
        <FiFile />
        <input value={episodeNumber} onChange={(event) => setEpisodeNumber(event.target.value)} />
      </Field>

      <Label>Duración</Label>
      <Field>
        <FiFile />
        <input value={duration} onChange={(event) => setDuration(event.target.value)} />
      </Field>
    </CreatorForm>
  );
}
