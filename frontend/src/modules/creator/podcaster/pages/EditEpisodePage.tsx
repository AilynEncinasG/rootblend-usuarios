import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  getPodcasterEpisodes,
  updateEpisode,
  type PodcasterEpisode,
} from "../services/podcasterCreatorService";

function audioUrlFor(episode: PodcasterEpisode | null): string {
  return episode?.audio?.url || episode?.audio?.url_archivo || "";
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
  const [audioUrl, setAudioUrl] = useState("");
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
    setAudioUrl(audioUrlFor(episode));
  }, [episode]);

  async function handleSubmit() {
    setError("");

    if (!episodeId) {
      throw new Error("No se encontró el episodio para editar.");
    }

    await updateEpisode(episodeId, {
      titulo: title.trim(),
      descripcion: description.trim(),
      duracion: duration,
      estado: status,
      numero_episodio: Number(episodeNumber) || undefined,
      url_archivo: audioUrl.trim() || undefined,
      formato: audioUrl.split(".").pop()?.split("?")[0] || "mp3",
    });

    navigate("/creator/podcaster/episodes");
  }

  return (
    <CreatorForm
      title="Editar episodio"
      subtitle="Actualiza título, descripción, estado, duración y URL de audio."
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

      <Label>URL del audio</Label>
      <Field>
        <FiLink />
        <input value={audioUrl} onChange={(event) => setAudioUrl(event.target.value)} />
      </Field>

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
