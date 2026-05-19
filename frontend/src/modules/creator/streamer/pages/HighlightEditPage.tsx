import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiImage,
  FiLink,
  FiRefreshCw,
  FiSave,
  FiTrash2,
  FiType,
  FiUpload,
  FiVideo,
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
  uploadMomentoMedia,
  type MomentoDestacado,
  type Stream,
} from "../../../streams/services/streamsService";
import { CreatorNav } from "../../shared/creatorLegacy";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function isUrl(value: string) {
  const cleanValue = value.trim();
  return cleanValue.startsWith("http://") || cleanValue.startsWith("https://");
}

function normalizeMediaUrl(value?: string | null) {
  if (!value) return "";

  const cleanValue = value.trim();

  if (cleanValue.startsWith("http://localhost/media/")) {
    return cleanValue.replace(
      "http://localhost/media/",
      "http://localhost:8080/canales-media/"
    );
  }

  if (cleanValue.startsWith("http://127.0.0.1/media/")) {
    return cleanValue.replace(
      "http://127.0.0.1/media/",
      "http://localhost:8080/canales-media/"
    );
  }

  if (cleanValue.startsWith("/media/")) {
    return cleanValue.replace(
      "/media/",
      "http://localhost:8080/canales-media/"
    );
  }

  return cleanValue;
}

function secondsToTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "";
  }

  const safeSeconds = Math.floor(totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function getVideoDurationFromFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.muted = true;
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      const duration = secondsToTime(Number(video.duration));
      URL.revokeObjectURL(objectUrl);
      resolve(duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve("");
    };
  });
}

export default function HighlightEditPage() {
  const params = useParams<{
    highlightId?: string;
    momentoId?: string;
    id?: string;
  }>();

  const navigate = useNavigate();

  const rawHighlightId =
    params.highlightId || params.momentoId || params.id || "";
  const numericHighlightId = Number(rawHighlightId);

  const [momento, setMomento] = useState<MomentoDestacado | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlVideo, setUrlVideo] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duracion, setDuracion] = useState("");
  const [streamId, setStreamId] = useState("");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
        setUrlVideo(normalizeMediaUrl(momentoResult.url_video || ""));
        setThumbnailUrl(normalizeMediaUrl(momentoResult.thumbnail_url || ""));
        setDuracion(momentoResult.duracion || "");
        setStreamId(
          momentoResult.stream?.id_stream
            ? String(momentoResult.stream.id_stream)
            : ""
        );
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

  async function handleVideoFileChange(file: File | null) {
    setError("");
    setSuccess("");
    setVideoFile(file);

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Selecciona un archivo de video valido.");
      setVideoFile(null);
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setError("El video no puede superar los 100 MB.");
      setVideoFile(null);
      return;
    }

    const detectedDuration = await getVideoDurationFromFile(file);

    if (detectedDuration) {
      setDuracion(detectedDuration);
    }
  }

  function handleThumbnailFileChange(file: File | null) {
    setError("");
    setSuccess("");
    setThumbnailFile(file);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecciona una imagen valida.");
      setThumbnailFile(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("La miniatura no puede superar los 5 MB.");
      setThumbnailFile(null);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || deleting) return;

    setError("");
    setSuccess("");

    const cleanTitulo = titulo.trim();
    const cleanDescripcion = descripcion.trim();

    let finalVideoUrl = urlVideo.trim();
    let finalThumbnailUrl = thumbnailUrl.trim();
    let finalDuracion = duracion.trim();

    if (!cleanTitulo) {
      setError("Escribe un titulo para el momento destacado.");
      return;
    }

    if (!finalVideoUrl && !videoFile) {
      setError("Agrega una URL de video o sube un video desde tu computadora.");
      return;
    }

    if (finalVideoUrl && !isUrl(finalVideoUrl)) {
      setError("La URL del video debe empezar con http:// o https://.");
      return;
    }

    if (finalThumbnailUrl && !isUrl(finalThumbnailUrl)) {
      setError("La miniatura debe empezar con http:// o https://.");
      return;
    }

    setSaving(true);

    try {
      if (videoFile) {
        const uploadedVideo = await uploadMomentoMedia("video", videoFile);
        finalVideoUrl = normalizeMediaUrl(uploadedVideo.url);

        const detectedDuration = await getVideoDurationFromFile(videoFile);
        if (detectedDuration) {
          finalDuracion = detectedDuration;
        }
      }

      if (thumbnailFile) {
        const uploadedThumbnail = await uploadMomentoMedia(
          "miniatura",
          thumbnailFile
        );
        finalThumbnailUrl = normalizeMediaUrl(uploadedThumbnail.url);
      }

      const updated = await updateMomento(numericHighlightId, {
        titulo: cleanTitulo,
        descripcion: cleanDescripcion,
        url_video: finalVideoUrl,
        thumbnail_url: finalThumbnailUrl,
        duracion: finalDuracion || undefined,
        id_stream: streamId ? Number(streamId) : null,
        destacado: true,
      });

      setMomento(updated);
      setUrlVideo(normalizeMediaUrl(updated.url_video || finalVideoUrl));
      setThumbnailUrl(
        normalizeMediaUrl(updated.thumbnail_url || finalThumbnailUrl)
      );
      setDuracion(updated.duracion || finalDuracion);
      setVideoFile(null);
      setThumbnailFile(null);
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

    setConfirmDeleteOpen(false);
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
              <p>
                Actualiza el clip o eliminalo si ya no debe mostrarse. Puedes
                usar URL externa o subir video y miniatura desde tu computadora.
              </p>
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
                    placeholder="https://ejemplo.com/clip.mp4 o YouTube"
                    disabled={saving || deleting}
                  />
                </Field>

                <Label>O subir video desde tu computadora</Label>
                <Field>
                  <FiUpload />
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={(event) =>
                      handleVideoFileChange(event.target.files?.[0] || null)
                    }
                    disabled={saving || deleting}
                  />
                </Field>

                {videoFile ? (
                  <AlertPanel>
                    <FiVideo />
                    <div>
                      <strong>Video seleccionado</strong>
                      <p>{videoFile.name}</p>
                    </div>
                  </AlertPanel>
                ) : null}

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

                <Label>O subir miniatura desde tu computadora</Label>
                <Field>
                  <FiUpload />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    onChange={(event) =>
                      handleThumbnailFileChange(event.target.files?.[0] || null)
                    }
                    disabled={saving || deleting}
                  />
                </Field>

                {thumbnailFile ? (
                  <AlertPanel>
                    <FiImage />
                    <div>
                      <strong>Miniatura seleccionada</strong>
                      <p>{thumbnailFile.name}</p>
                    </div>
                  </AlertPanel>
                ) : null}

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

                <DangerButton
                  type="button"
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={saving || deleting}
                >
                  <FiTrash2 /> {deleting ? "Eliminando..." : "Eliminar momento"}
                </DangerButton>
              </>
            ) : null}

            <ButtonRow>
              <GhostLink to="/creator/streamer/highlights">Cancelar</GhostLink>

              <PrimaryButton
                type="submit"
                disabled={loading || saving || deleting}
              >
                <FiSave /> {saving ? "Guardando..." : "Guardar cambios"}
              </PrimaryButton>
            </ButtonRow>
          </FormCard>

          {confirmDeleteOpen ? (
            <div
              role="presentation"
              onClick={() => {
                if (!deleting) {
                  setConfirmDeleteOpen(false);
                }
              }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "grid",
                placeItems: "center",
                padding: 24,
                background:
                  "radial-gradient(circle at top, rgba(0, 234, 255, 0.12), transparent 34%), rgba(2, 6, 23, 0.78)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-moment-title"
                onClick={(event) => event.stopPropagation()}
                style={{
                  width: "min(520px, 100%)",
                  borderRadius: 24,
                  border: "1px solid rgba(248, 113, 113, 0.38)",
                  background:
                    "linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(45, 18, 82, 0.94))",
                  boxShadow: "0 28px 90px rgba(0, 0, 0, 0.55)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: 24,
                    display: "grid",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 18,
                      display: "grid",
                      placeItems: "center",
                      color: "#fecaca",
                      background: "rgba(248, 113, 113, 0.14)",
                      border: "1px solid rgba(248, 113, 113, 0.35)",
                      fontSize: 26,
                    }}
                  >
                    <FiTrash2 />
                  </div>

                  <div>
                    <p
                      style={{
                        margin: "0 0 6px",
                        color: "#fb7185",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        fontSize: 12,
                        letterSpacing: "0.08em",
                      }}
                    >
                      Accion irreversible
                    </p>

                    <h2
                      id="delete-moment-title"
                      style={{
                        margin: 0,
                        fontSize: 30,
                        lineHeight: 1.05,
                      }}
                    >
                      ¿Eliminar este momento?
                    </h2>

                    <p
                      style={{
                        margin: "12px 0 0",
                        color: "rgba(226, 232, 240, 0.78)",
                        lineHeight: 1.5,
                      }}
                    >
                      Se eliminara el clip destacado{" "}
                      <strong style={{ color: "#ffffff" }}>
                        {titulo || "seleccionado"}
                      </strong>
                      . Ya no aparecera en tu panel, en el canal publico ni en
                      la pagina de reproduccion.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    padding: 18,
                    borderTop: "1px solid rgba(148, 163, 184, 0.12)",
                    background: "rgba(2, 6, 23, 0.34)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteOpen(false)}
                    disabled={deleting}
                    style={{
                      minHeight: 48,
                      borderRadius: 14,
                      border: "1px solid rgba(0, 234, 255, 0.32)",
                      background: "rgba(15, 23, 42, 0.72)",
                      color: "#ffffff",
                      fontWeight: 900,
                      cursor: deleting ? "not-allowed" : "pointer",
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={removeMoment}
                    disabled={deleting}
                    style={{
                      minHeight: 48,
                      borderRadius: 14,
                      border: 0,
                      background: "linear-gradient(135deg, #fb7185, #e11d48)",
                      color: "#ffffff",
                      fontWeight: 900,
                      cursor: deleting ? "not-allowed" : "pointer",
                      boxShadow: "0 14px 34px rgba(225, 29, 72, 0.28)",
                    }}
                  >
                    {deleting ? "Eliminando..." : "Si, eliminar"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}