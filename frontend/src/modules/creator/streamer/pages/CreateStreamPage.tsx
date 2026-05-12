import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiCheckCircle, FiRadio } from "react-icons/fi";
import {
  AlertPanel,
  Field,
  Label,
  MetaTag,
  Muted,
  Select,
  TagRow,
  TextArea,
} from "../../../../shared/styles/legacyStyled";
import { CreatorForm } from "../../shared/creatorLegacy";
import {
  createStream,
  getCategories,
  type Categoria,
} from "../../../streams/services/streamsService";

export default function CreateStreamPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Categoria[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [quality, setQuality] = useState("720p");
  const [bitrate, setBitrate] = useState("2500");
  const [featured, setFeatured] = useState(false);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setLoadingCategories(true);
      setError("");

      try {
        const categoryList = await getCategories();

        if (!active) {
          return;
        }

        setCategories(categoryList);

        if (categoryList.length > 0) {
          setCategoryId(String(categoryList[0].id_categoria));
        }
      } catch (requestError) {
        console.error("CREATE_STREAM_CATEGORIES_ERROR", requestError);

        if (active) {
          setCategories([]);
          setCategoryId("");
          setError(
            "No se pudieron cargar las categorías reales del backend. Verifica que el backend esté activo."
          );
        }
      } finally {
        if (active) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");
    setSuccess("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const parsedCategoryId = Number(categoryId);
    const parsedBitrate = Number(bitrate);

    if (!cleanTitle) {
      setError("Escribe un título para el stream.");
      return;
    }

    if (!categoryId || !Number.isFinite(parsedCategoryId)) {
      setError("Selecciona una categoría válida.");
      return;
    }

    if (!Number.isFinite(parsedBitrate) || parsedBitrate <= 0) {
      setError("El bitrate debe ser un número mayor a 0.");
      return;
    }

    setSaving(true);

    try {
      const createdStream = await createStream({
        titulo: cleanTitle,
        descripcion: cleanDescription || undefined,
        id_categoria: parsedCategoryId,
        destacado: featured,
        calidad_actual: quality,
        resolucion: quality === "1080p" ? "1920x1080" : "1280x720",
        bitrate: parsedBitrate,
        latencia_modo: "baja",
        audio_activo: true,
      });

      localStorage.setItem(
        "rootblend_last_stream_id",
        String(createdStream.id_stream)
      );

      setSuccess(
        `Stream "${createdStream.titulo}" creado correctamente. Abriendo control de transmisión...`
      );

      setTimeout(() => {
        navigate("/creator/streamer/control");
      }, 500);
    } catch (requestError) {
      console.error("CREATE_STREAM_SAVE_ERROR", requestError);
      setError(
        "No se pudo crear el stream. Revisa que estés logueado, que tengas canal streamer activo y que el backend esté funcionando."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <CreatorForm
      title="Crear / configurar stream"
      subtitle="Completa los datos de tu transmisión. Luego podrás iniciarla desde Control de transmisión."
      button={saving ? "Guardando..." : "Guardar configuracion"}
      onSubmit={submit}
    >
      {error ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>No se pudo guardar</strong>
            <Muted>{error}</Muted>
          </div>
        </AlertPanel>
      ) : null}

      {success ? (
        <AlertPanel>
          <FiCheckCircle />
          <div>
            <strong>Stream creado</strong>
            <Muted>{success}</Muted>
          </div>
        </AlertPanel>
      ) : null}

      <Label>Titulo del stream</Label>
      <Field>
        <FiRadio />
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ej. Directo de la noche"
          disabled={saving}
        />
      </Field>

      <Label>Categoria</Label>
      <Select
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
        disabled={saving || loadingCategories || categories.length === 0}
      >
        {categories.length === 0 ? (
          <option value="">
            {loadingCategories
              ? "Cargando categorias..."
              : "No hay categorias disponibles"}
          </option>
        ) : (
          categories.map((category) => (
            <option
              key={category.id_categoria}
              value={category.id_categoria}
            >
              {category.nombre}
            </option>
          ))
        )}
      </Select>

      <Label>Etiquetas</Label>
      <TagRow>
        <MetaTag>Backend real</MetaTag>
        <MetaTag>Programado</MetaTag>
        <MetaTag>Streamer</MetaTag>
      </TagRow>

      <Label>Descripcion</Label>
      <TextArea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Describe brevemente de qué tratará el directo."
        disabled={saving}
      />

      <Label>Calidad</Label>
      <Select
        value={quality}
        onChange={(event) => setQuality(event.target.value)}
        disabled={saving}
      >
        <option value="720p">720p</option>
        <option value="1080p">1080p recomendado</option>
      </Select>

      <Label>Bitrate</Label>
      <Field>
        <FiRadio />
        <input
          type="number"
          min="1"
          value={bitrate}
          onChange={(event) => setBitrate(event.target.value)}
          placeholder="2500"
          disabled={saving}
        />
      </Field>

      <Label>Destacado</Label>
      <TagRow>
        <label>
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            disabled={saving}
          />{" "}
          Marcar como destacado
        </label>
      </TagRow>
    </CreatorForm>
  );
}