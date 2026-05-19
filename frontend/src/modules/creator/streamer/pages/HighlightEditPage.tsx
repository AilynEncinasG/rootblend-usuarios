import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiImage,
  FiLink,
  FiRefreshCw,
  FiSave,
  FiStar,
  FiTrash2,
  FiType,
} from "react-icons/fi";
import { RootShell } from "../../../../shared/layout";
import {
  AlertPanel,
  ButtonRow,
  CreatorLayout,
  CreatorMain,
  DangerButton,
  Eyebrow,
  Field,
  FormCard,
  GhostLink,
  Label,
  PageHeading,
  PrimaryButton,
  Select,
  TextArea,
} from "../../../../shared/styles/legacyStyled";
import {
  deleteMomento,
  getMomentoById,
  getMyStreams,
  updateMomento,
  type MomentoDestacado,
  type Stream,
} from "../../../streams/services/streamsService";
import { CreatorNav } from "../../shared/creatorLegacy";

function isUrl(value: string) {
  const cleanValue = value.trim();
  return cleanValue.startsWith("http://") || cleanValue.startsWith("https://");
}

export default function HighlightEditPage() {
  const { highlightId } = useParams();
  const navigate = useNavigate();

  const numericHighlightId = Number(highlightId);

  const [momento, setMomento] = useState<MomentoDestacado | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlVideo, setUrlVideo] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duracion, setDuracion] = useState("");
  const [streamId, setStreamId] = useState("");
  const [destacado, setDestacado] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!Number.isFinite(numericHighlightId) || numericHighlightId <= 0) {
        setError("ID de momento invalido.");
        setLoading(false);
        return;
      }

      try {
        const [momentoResult, streamsResult] = await Promise.all([
          getMomentoById(numericHighlightId),
          getMyStreams(),
        ]);

        if (!active) return;

        setMomento(momentoResult);
        setStreams(streamsResult);
        setTitulo(momentoResult.titulo || "");
        setDescripcion(momentoResult.descripcion || "");
        setUrlVideo(momentoResult.url_video || "");
        setThumbnailUrl(momentoResult.thumbnail_url || "");
        setDuracion(momentoResult.duracion || "");
        setStreamId(momentoResult.stream?.id_stream ? String(momentoResult.stream.id_stream) : "");
        setDestacado(Boolean(momentoResult.destacado));
      } catch (requestError) {
        console.error("HIGHLIGHT_EDIT_LOAD_ERROR", requestError);

        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el momento destacado."
          );
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
  }, [numericHighlightId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || deleting) return;

    setError("");
    setSuccess("");

    const cleanTitulo = titulo.trim();
    const cleanDescripcion = descripcion.trim();
    const cleanUrlVideo = urlVideo.trim();
    const cleanThumbnailUrl = thumbnailUrl.trim();
    const cleanDuracion = duracion.trim();

    if (!cleanTitulo) {
      setError("Escribe un titulo para el momento destacado.");
      return;
    }

    if (!cleanUrlVideo || !isUrl(cleanUrlVideo)) {
      setError("La URL del video debe empezar con http:// o https://.");
      return;
    }

    if (cleanThumbnailUrl && !isUrl(cleanThumbnailUrl)) {
      setError("La miniatura debe empezar con http:// o https://.");
      return;
    }

    setSaving(true);

    try {
      const updated = await updateMomento(numericHighlightId, {
        titulo: cleanTitulo,
        descripcion: cleanDescripcion,
        url_video: cleanUrlVideo,
        thumbnail_url: cleanThumbnailUrl,
        duracion: cleanDuracion,
        id_stream: streamId ? Number(streamId) : null,
        destacado,
      });

      setMomento(updated);
      setSuccess("Momento destacado actualizado correctamente.");
    } catch (requestError) {
      console.error("HIGHLIGHT_EDIT_SAVE_ERROR", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar el momento destacado."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeMoment() {
    if (deleting || saving) return;

    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este momento destacado?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeleting(true);

    try {
      await deleteMomento(numericHighlightId);
      navigate("/creator/streamer/highlights");
    } catch (requestError) {
      console.error("HIGHLIGHT_DELETE_ERROR", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo eliminar el momento destacado."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <RootShell active="creator">
      <CreatorLayout>
        <CreatorNav />

        <CreatorMain>
          <FormCard onSubmit={submit}>
            <PageHeading>
              <Eyebrow>Formulario</Eyebrow>
              <h1>Editar / eliminar momento</h1>
              <p>Actualiza el clip o eliminalo si ya no debe mostrarse.</p>
            </PageHeading>

            {loading ? (
              <AlertPanel>
                <FiRefreshCw />
                <div>
                  <strong>Cargando momento</strong>
                  <p>Consultando informacion del clip.</p>
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
                <FiCheckCircle />
                <div>
                  <strong>Guardado</strong>
                  <p>{success}</p>
                </div>
              </AlertPanel>
            ) : null}

            {!loading && momento ? (
              <>
                <Label>Titulo</Label>
                <Field>
                  <FiType />
                  <input
                    value={titulo}
                    onChange={(event) => setTitulo(event.target.value)}
                    placeholder="Ej. Mejor jugada del directo"
                    disabled={saving || deleting}
                    maxLength={150}
                  />
                </Field>

                <Label>Stream origen</Label>
                <Select
                  value={streamId}
                  onChange={(event) => setStreamId(event.target.value)}
                  disabled={saving || deleting}
                >
                  <option value="">Sin stream origen</option>
                  {streams.map((stream) => (
                    <option key={stream.id_stream} value={stream.id_stream}>
                      {stream.titulo} ({stream.estado})
                    </option>
                  ))}
                </Select>

                <Label>Descripcion</Label>
                <TextArea
                  value={descripcion}
                  onChange={(event) => setDescripcion(event.target.value)}
                  placeholder="Describe brevemente el momento destacado."
                  disabled={saving || deleting}
                />

                <Label>URL del video</Label>
                <Field>
                  <FiLink />
                  <input
                    value={urlVideo}
                    onChange={(event) => setUrlVideo(event.target.value)}
                    placeholder="https://ejemplo.com/clip.mp4"
                    disabled={saving || deleting}
                  />
                </Field>

                <Label>Miniatura URL</Label>
                <Field>
                  <FiImage />
                  <input
                    value={thumbnailUrl}
                    onChange={(event) => setThumbnailUrl(event.target.value)}
                    placeholder="https://ejemplo.com/miniatura.jpg"
                    disabled={saving || deleting}
                  />
                </Field>

                {thumbnailUrl.trim() && isUrl(thumbnailUrl) ? (
                  <div
                    style={{
                      minHeight: 220,
                      borderRadius: 22,
                      border: "1px solid rgba(0, 234, 255, 0.18)",
                      background: `linear-gradient(180deg, rgba(2,8,26,.12), rgba(2,8,26,.66)), url(${thumbnailUrl.trim()}) center/cover`,
                    }}
                  />
                ) : null}

                <Label>Duracion</Label>
                <Field>
                  <FiStar />
                  <input
                    value={duracion}
                    onChange={(event) => setDuracion(event.target.value)}
                    placeholder="Ej. 01:25 o 00:01:25"
                    disabled={saving || deleting}
                  />
                </Field>

                <Label>Publicacion</Label>
                <Field>
                  <FiStar />
                  <select
                    value={destacado ? "true" : "false"}
                    onChange={(event) => setDestacado(event.target.value === "true")}
                    disabled={saving || deleting}
                    style={{
                      width: "100%",
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      color: "#fff",
                      fontWeight: 800,
                    }}
                  >
                    <option value="true">Destacado publico</option>
                    <option value="false">Guardado sin destacar</option>
                  </select>
                </Field>

                <DangerButton type="button" onClick={removeMoment} disabled={saving || deleting}>
                  <FiTrash2 /> {deleting ? "Eliminando..." : "Eliminar momento"}
                </DangerButton>
              </>
            ) : null}

            <ButtonRow>
              <GhostLink to="/creator/streamer/highlights">Cancelar</GhostLink>

              <PrimaryButton type="submit" disabled={loading || saving || deleting}>
                <FiSave /> {saving ? "Guardando..." : "Guardar cambios"}
              </PrimaryButton>
            </ButtonRow>
          </FormCard>
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}