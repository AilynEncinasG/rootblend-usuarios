import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiRadio,
  FiSave,
} from "react-icons/fi";
import { RootShell } from "../../../../shared/layout";
import {
  AlertPanel,
  ButtonRow,
  CreatorLayout,
  CreatorMain,
  Eyebrow,
  Field,
  FormCard,
  GhostLink,
  Label,
  Muted,
  PageHeading,
  PrimaryButton,
  Select,
  TextArea,
} from "../../../../shared/styles/legacyStyled";
import { CreatorNav } from "../../shared/creatorLegacy";
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

        if (!active) return;

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
            "No se pudieron cargar las categorías. Verifica que canales-streaming-service esté activo."
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

    if (saving) return;

    setError("");
    setSuccess("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const parsedCategoryId = Number(categoryId);

    if (!cleanTitle) {
      setError("Escribe un título para el stream.");
      return;
    }

    if (!categoryId || !Number.isFinite(parsedCategoryId)) {
      setError("Selecciona una categoría válida.");
      return;
    }

    setSaving(true);

    try {
      const createdStream = await createStream({
        titulo: cleanTitle,
        descripcion: cleanDescription || undefined,
        id_categoria: parsedCategoryId,
        destacado: false,
        calidad_actual: quality,
        resolucion: quality === "1080p" ? "1920x1080" : "1280x720",
        bitrate: quality === "1080p" ? 4500 : 2500,
        latencia_modo: "baja",
        audio_activo: true,
      });

      localStorage.setItem(
        "rootblend_last_stream_id",
        String(createdStream.id_stream)
      );

      setSuccess("Stream creado correctamente.");

      window.setTimeout(() => {
        navigate("/creator/streamer/control");
      }, 700);
    } catch (requestError) {
      console.error("CREATE_STREAM_SAVE_ERROR", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo crear el stream."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <RootShell active="creator">
      <CreatorLayout>
        <CreatorNav />

        <CreatorMain>
          <div
            style={{
              width: "100%",
              minHeight: "calc(100vh - 130px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingTop: 26,
              paddingBottom: 50,
            }}
          >
            <FormCard
              onSubmit={submit}
              style={{
                width: "min(760px, 100%)",
                maxWidth: 760,
              }}
            >
              <PageHeading>
                <Eyebrow>Formulario</Eyebrow>
                <h1>Crear / configurar stream</h1>
                <p>Completa los datos de tu transmisión...</p>
              </PageHeading>

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

              <Label>Título del stream</Label>
              <Field>
                <FiRadio />
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ej. Directo de la noche"
                  disabled={saving}
                  maxLength={150}
                />
              </Field>

              <Label>Categoría</Label>
              <Select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                disabled={saving || loadingCategories || categories.length === 0}
                style={{
                  width: 170,
                }}
              >
                {categories.length === 0 ? (
                  <option value="">
                    {loadingCategories ? "Cargando..." : "Sin categorías"}
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

              <Label>Descripción</Label>
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
                style={{
                  width: 230,
                }}
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p recomendado</option>
              </Select>

              <ButtonRow>
                <GhostLink to="/creator/streamer/dashboard">
                  Cancelar
                </GhostLink>

                <PrimaryButton type="submit" disabled={saving}>
                  <FiSave />{" "}
                  {saving ? "Guardando..." : "Guardar configuración"}
                </PrimaryButton>
              </ButtonRow>
            </FormCard>
          </div>
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}