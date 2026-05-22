import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiAlertTriangle, FiHeadphones, FiImage, FiLink, FiRefreshCw, FiSave, FiUpload } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  ButtonRow,
  EpisodeRow,
  Field,
  FormCard,
  InfoGrid,
  Label,
  Panel,
  PanelHeader,
  PrimaryButton,
  Select,
  ServicePill,
  StateIcon,
  StatePanel,
  TextArea,
  TwoCol,
} from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import {
  getPodcastCategoriesForCreator,
  getPodcasterEpisodes,
  getPodcasterPodcasts,
  updatePodcast,
  type PodcasterEpisode,
  type PodcasterPodcast,
} from "../services/podcasterCreatorService";
import type { PodcastCategory } from "../../../podcasts/services/podcastsCatalogService";

type CoverMode = "url" | "file";

export default function ManagePodcastPage() {
  const { podcastId } = useParams();
  const [podcasts, setPodcasts] = useState<PodcasterPodcast[]>([]);
  const [episodes, setEpisodes] = useState<PodcasterEpisode[]>([]);
  const [categories, setCategories] = useState<PodcastCategory[]>([]);
  const [selectedPodcastId, setSelectedPodcastId] = useState(podcastId || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverMode, setCoverMode] = useState<CoverMode>("url");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [podcastItems, episodeItems, categoryItems] = await Promise.all([
          getPodcasterPodcasts(),
          getPodcasterEpisodes(),
          getPodcastCategoriesForCreator(),
        ]);

        if (!active) return;

        setPodcasts(podcastItems);
        setEpisodes(episodeItems);
        setCategories(categoryItems);
        setSelectedPodcastId(podcastId || podcastItems[0]?.id || "");
      } catch (loadError) {
        console.error("MANAGE_PODCAST_LOAD_ERROR", loadError);

        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la administración del podcast.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [podcastId]);

  const selectedPodcast = useMemo(() => {
    return podcasts.find((podcast) => podcast.id === selectedPodcastId) || podcasts[0] || null;
  }, [podcasts, selectedPodcastId]);

  useEffect(() => {
    if (!selectedPodcast) return;

    setName(selectedPodcast.title);
    setDescription(selectedPodcast.description);
    setCategoryId(String(selectedPodcast.id_categoria_podcast || categories[0]?.id_categoria_podcast || ""));
    setCoverUrl(selectedPodcast.cover || "");
    setCoverMode("url");
    setCoverFile(null);
  }, [categories, selectedPodcast]);

  const selectedEpisodes = episodes.filter(
    (episode) => String(episode.podcastId) === String(selectedPodcast?.id)
  );

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedPodcast) return;

    if (coverMode === "url" && coverUrl.trim() && !/^https?:\/\//i.test(coverUrl.trim())) {
      setError("La URL de portada debe empezar con http:// o https://.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updatePodcast(selectedPodcast.id, {
        nombre: name.trim(),
        descripcion: description.trim(),
        id_categoria_podcast: Number(categoryId),
        imagen_portada: coverMode === "url" ? coverUrl.trim() || undefined : undefined,
        portada: coverMode === "file" ? coverFile : null,
      });

      setPodcasts((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      setCoverMode("url");
      setCoverFile(null);
      setSuccess("Podcast actualizado correctamente.");
    } catch (saveError) {
      console.error("MANAGE_PODCAST_SAVE_ERROR", saveError);
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar el podcast.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <CreatorScreen
      title="Administrar podcast"
      subtitle="Edita información, portada, episodios, configuración y estado público."
      image={brandAssets.podcasterPanel}
    >
      {loading ? (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Cargando podcast</strong>
            <p>Consultando podcasts-service...</p>
          </div>
        </AlertPanel>
      ) : null}

      {error ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      ) : null}

      {success ? (
        <AlertPanel>
          <FiSave />
          <div>
            <strong>Guardado</strong>
            <p>{success}</p>
          </div>
        </AlertPanel>
      ) : null}

      {selectedPodcast ? (
        <InfoGrid>
          <FormCard onSubmit={handleSave}>
            <PanelHeader>
              <strong>Editar información</strong>
              <ServicePill $status="Operativo">Real</ServicePill>
            </PanelHeader>

            <Label>Podcast</Label>
            <Select value={selectedPodcastId} onChange={(event) => setSelectedPodcastId(event.target.value)}>
              {podcasts.map((podcast) => (
                <option key={podcast.id} value={podcast.id}>
                  {podcast.title}
                </option>
              ))}
            </Select>

            <Label>Nombre</Label>
            <Field>
              <FiHeadphones />
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </Field>

            <Label>Descripción</Label>
            <TextArea value={description} onChange={(event) => setDescription(event.target.value)} />

            <Label>Categoría</Label>
            <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              {categories.map((category) => (
                <option key={category.id_categoria_podcast} value={category.id_categoria_podcast}>
                  {category.nombre}
                </option>
              ))}
            </Select>

            <Label>Tipo de portada</Label>
            <Select value={coverMode} onChange={(event) => setCoverMode(event.target.value as CoverMode)}>
              <option value="url">Usar URL de imagen</option>
              <option value="file">Subir imagen desde mi PC</option>
            </Select>

            {coverMode === "url" ? (
              <>
                <Label>URL de portada</Label>
                <Field>
                  <FiLink />
                  <input value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} />
                </Field>
              </>
            ) : (
              <>
                <Label>Nueva portada desde PC</Label>
                <Field>
                  <FiUpload />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
                  />
                </Field>
              </>
            )}

            <ButtonRow>
              <PrimaryButton type="submit" disabled={saving}>
                <FiSave /> {saving ? "Guardando..." : "Guardar cambios"}
              </PrimaryButton>
            </ButtonRow>
          </FormCard>

          <Panel>
            <PanelHeader>
              <strong>Resumen</strong>
              <Link to={`/podcasts/${selectedPodcast.id}`}>Ver público</Link>
            </PanelHeader>

            {selectedPodcast.cover ? (
              <img
                src={selectedPodcast.cover}
                alt={selectedPodcast.title}
                style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 14, marginBottom: 14 }}
              />
            ) : null}

            <TwoCol>
              <span>Nombre</span>
              <strong>{selectedPodcast.title}</strong>
              <span>Categoría</span>
              <strong>{selectedPodcast.category || "Sin categoría"}</strong>
              <span>Estado</span>
              <strong>{selectedPodcast.status === "published" ? "Publicado" : "Borrador"}</strong>
              <span>Episodios</span>
              <strong>{selectedPodcast.episodes}</strong>
            </TwoCol>
          </Panel>

          <Panel>
            <PanelHeader>
              <strong>Últimos episodios</strong>
              <Link to="/creator/podcaster/episodes">Ver todos</Link>
            </PanelHeader>

            {selectedEpisodes.length > 0 ? (
              selectedEpisodes.map((episode) => (
                <EpisodeRow key={episode.id}>
                  <FiHeadphones />
                  <span>{episode.title}</span>
                  <small>{episode.duration}</small>
                  <Link to={`/creator/podcaster/episodes/${episode.id}/edit`}>Editar</Link>
                </EpisodeRow>
              ))
            ) : (
              <StatePanel>
                <StateIcon>
                  <FiHeadphones />
                </StateIcon>
                <h2>Sin episodios</h2>
                <p>Sube un episodio para asociarlo a este podcast.</p>
              </StatePanel>
            )}
          </Panel>
        </InfoGrid>
      ) : (
        <StatePanel>
          <StateIcon>
            <FiImage />
          </StateIcon>
          <h2>No tienes podcasts todavía</h2>
          <p>Crea tu primer podcast para administrarlo.</p>
        </StatePanel>
      )}
    </CreatorScreen>
  );
}
