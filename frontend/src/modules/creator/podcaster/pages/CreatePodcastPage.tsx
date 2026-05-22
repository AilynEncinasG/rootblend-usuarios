import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiImage, FiMic } from "react-icons/fi";
import {
  AlertPanel,
  Field,
  Label,
  Select,
  TextArea,
} from "../../../../shared/styles/legacyStyled";
import { getMyChannel } from "../../../streams/services/streamsService";
import { CreatorForm } from "../../shared/creatorLegacy";
import {
  createPodcast,
  getPodcastCategoriesForCreator,
} from "../services/podcasterCreatorService";
import type { PodcastCategory } from "../../../podcasts/services/podcastsCatalogService";

export default function CreatePodcastPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<PodcastCategory[]>([]);
  const [channelId, setChannelId] = useState<number | null>(null);
  const [name, setName] = useState("Hablemos de Tecnología");
  const [description, setDescription] = useState("Podcast de tecnología, gadgets y futuro.");
  const [coverUrl, setCoverUrl] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [categoryItems, channelResult] = await Promise.all([
          getPodcastCategoriesForCreator(),
          getMyChannel(),
        ]);

        if (!active) return;

        setCategories(categoryItems);
        setSelectedCategoryId(String(categoryItems[0]?.id_categoria_podcast || ""));
        setChannelId(channelResult.canal?.id_canal || null);
      } catch (loadError) {
        console.error("CREATE_PODCAST_INIT_ERROR", loadError);

        if (active) {
          setError(loadError instanceof Error ? loadError.message : "No se pudo preparar el formulario.");
        }
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit() {
    setError("");

    if (!channelId) {
      throw new Error("Primero debes activar un canal podcaster.");
    }

    if (!selectedCategoryId) {
      throw new Error("Selecciona una categoría para el podcast.");
    }

    const created = await createPodcast({
      id_canal: channelId,
      id_categoria_podcast: Number(selectedCategoryId),
      nombre: name.trim(),
      descripcion: description.trim(),
      imagen_portada: coverUrl.trim() || undefined,
      estado: "activo",
    });

    navigate(`/creator/podcaster/podcasts/${created.id}/manage`);
  }

  return (
    <CreatorForm
      title="Crear podcast"
      subtitle="Configura el nombre, descripción, categoría y portada."
      button="Crear podcast"
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

      <Label>Nombre del podcast</Label>
      <Field>
        <FiMic />
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </Field>

      <Label>Descripción</Label>
      <TextArea value={description} onChange={(event) => setDescription(event.target.value)} />

      <Label>Categoría</Label>
      <Select value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.target.value)}>
        {categories.map((category) => (
          <option key={category.id_categoria_podcast} value={category.id_categoria_podcast}>
            {category.nombre}
          </option>
        ))}
      </Select>

      <Label>URL de portada opcional</Label>
      <Field>
        <FiImage />
        <input
          value={coverUrl}
          onChange={(event) => setCoverUrl(event.target.value)}
          placeholder="https://.../portada.jpg"
        />
      </Field>
    </CreatorForm>
  );
}
