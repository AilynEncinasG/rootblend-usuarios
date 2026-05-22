import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  ButtonRow,
  DangerButton,
  DangerIcon,
  DialogCard,
  GhostLink,
} from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import {
  deleteEpisode,
  getPodcasterEpisodes,
  type PodcasterEpisode,
} from "../services/podcasterCreatorService";

export default function DeleteEpisodePage() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<PodcasterEpisode[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEpisodes() {
      try {
        const items = await getPodcasterEpisodes();

        if (active) {
          setEpisodes(items);
        }
      } catch (loadError) {
        console.error("DELETE_EPISODE_LOAD_ERROR", loadError);

        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el episodio.");
        }
      }
    }

    loadEpisodes();

    return () => {
      active = false;
    };
  }, []);

  const episode = useMemo(() => {
    return episodes.find((item) => item.id === episodeId) || null;
  }, [episodeId, episodes]);

  async function handleDelete() {
    if (!episodeId) return;

    setDeleting(true);
    setError("");

    try {
      await deleteEpisode(episodeId);
      navigate("/creator/podcaster/episodes");
    } catch (deleteError) {
      console.error("DELETE_EPISODE_ERROR", deleteError);
      setError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el episodio.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <CreatorScreen
      title="Eliminar episodio"
      subtitle="Confirma antes de eliminar un contenido publicado."
      image={brandAssets.podcasterPanel}
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

      <DialogCard>
        <DangerIcon>
          <FiTrash2 />
        </DangerIcon>
        <h2>¿Eliminar este episodio?</h2>
        <p>
          {episode
            ? `Vas a eliminar “${episode.title}”. Esta acción lo ocultará de la lista pública.`
            : "No se encontró el episodio seleccionado."}
        </p>
        <ButtonRow>
          <GhostLink to="/creator/podcaster/episodes">Cancelar</GhostLink>
          <DangerButton type="button" disabled={deleting || !episodeId} onClick={handleDelete}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </DangerButton>
        </ButtonRow>
      </DialogCard>
    </CreatorScreen>
  );
}
