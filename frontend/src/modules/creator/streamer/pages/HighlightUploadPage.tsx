import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiImage,
  FiLink,
  FiRefreshCw,
  FiSave,
  FiStar,
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
  Eyebrow,
  Field,
  FormCard,
  GhostLink,
  Label,
  PageHeading,
  PrimaryButton,
  Select,
  SuccessBox,
  TextArea,
} from "../../../../shared/styles/legacyStyled";
import {
  createMomento,
  getMyStreams,
  uploadMomentoMedia,
  type Stream,
} from "../../../streams/services/streamsService";
import { CreatorNav } from "../../shared/creatorLegacy";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

function isUrl(value: string) {
  const cleanValue = value.trim();

  return cleanValue.startsWith("http://") || cleanValue.startsWith("https://");
}

function secondsToTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

function getVideoDuration(source: string): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");

    video.preload = "metadata";
    video.muted = true;
    video.src = source;

    video.onloadedmetadata = () => {
      resolve(secondsToTime(video.duration));
    };

    video.onerror = () => {
      resolve("");
    };
  });
}

function validateVideoFile(file: File) {
  if (!file.type.startsWith("video/")) {
    return "Selecciona un archivo de video válido.";
  }

  if (file.size > MAX_VIDEO_SIZE) {
    return "El video no puede superar los 100 MB.";
  }

  return "";
}

function validateImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    return "Selecciona una imagen válida.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "La miniatura no puede superar los 5 MB.";
  }

  return "";
}

export default function HighlightUploadPage() {
  const navigate = useNavigate();

  const [streams, setStreams] = useState<Stream[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlVideo, setUrlVideo] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duracion, setDuracion] = useState("");
  const [streamId, setStreamId] = useState("");
  const [destacado, setDestacado] = useState(true);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailLocalPreview, setThumbnailLocalPreview] = useState("");

  const [loadingStreams, setLoadingStreams] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStreams() {
      setLoadingStreams(true);
      setError("");

      try {
        const results = await getMyStreams();

        if (!active) return;

        setStreams(results);
      } catch (requestError) {
        console.error("HIGHLIGHT_UPLOAD_STREAMS_ERROR", requestError);

        if (active) {
          setError(
            "No se pudieron cargar tus streams. Aun puedes crear el momento sin stream origen."
          );
        }
      } finally {
        if (active) {
          setLoadingStreams(false);
        }
      }
    }

    loadStreams();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailLocalPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailLocalPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [thumbnailFile]);

  async function handleVideoFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    setError("");
    setSuccess("");

    if (!file) {
      setVideoFile(null);
      setDuracion("");
      return;
    }

    const validationError = validateVideoFile(file);

    if (validationError) {
      setError(validationError);
      event.target.value = "";
      setVideoFile(null);
      setDuracion("");
      return;
    }

    setUrlVideo("");
    setVideoFile(file);

    const objectUrl = URL.createObjectURL(file);
    const detectedDuration = await getVideoDuration(objectUrl);
    URL.revokeObjectURL(objectUrl);

    if (detectedDuration) {
      setDuracion(detectedDuration);
    }
  }

  async function handleVideoUrlBlur() {
    const cleanUrl = urlVideo.trim();

    if (!cleanUrl || !isUrl(cleanUrl)) return;

    const detectedDuration = await getVideoDuration(cleanUrl);

    if (detectedDuration) {
      setDuracion(detectedDuration);
    }
  }

  function handleThumbnailFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    setError("");
    setSuccess("");

    if (!file) {
      setThumbnailFile(null);
      return;
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      setError(validationError);
      event.target.value = "";
      setThumbnailFile(null);
      return;
    }

    setThumbnailUrl("");
    setThumbnailFile(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    const cleanTitulo = titulo.trim();
    const cleanDescripcion = descripcion.trim();
    let finalVideoUrl = urlVideo.trim();
    let finalThumbnailUrl = thumbnailUrl.trim();
    let finalDuracion = duracion.trim();

    if (!cleanTitulo) {
      setError("Escribe un título para el momento destacado.");
      return;
    }

    if (finalVideoUrl && !isUrl(finalVideoUrl)) {
      setError("La URL del video debe empezar con http:// o https://.");
      return;
    }

    if (!finalVideoUrl && !videoFile) {
      setError("Agrega una URL de video o sube un video desde tu computadora.");
      return;
    }

    if (finalThumbnailUrl && !isUrl(finalThumbnailUrl)) {
      setError("La miniatura debe empezar con http:// o https://.");
      return;
    }

    if (!finalThumbnailUrl && !thumbnailFile) {
      setError(
        "Agrega una URL de miniatura o sube una miniatura desde tu computadora."
      );
      return;
    }

    setSaving(true);

    try {
      if (!finalVideoUrl && videoFile) {
        const uploadedVideo = await uploadMomentoMedia("video", videoFile);
        finalVideoUrl = uploadedVideo.url;
      }

      if (!finalThumbnailUrl && thumbnailFile) {
        const uploadedThumbnail = await uploadMomentoMedia(
          "miniatura",
          thumbnailFile
        );
        finalThumbnailUrl = uploadedThumbnail.url;
      }

      if (!finalDuracion && videoFile) {
        const objectUrl = URL.createObjectURL(videoFile);
        finalDuracion = await getVideoDuration(objectUrl);
        URL.revokeObjectURL(objectUrl);
      }

      await createMomento({
        titulo: cleanTitulo,
        descripcion: cleanDescripcion,
        url_video: finalVideoUrl,
        thumbnail_url: finalThumbnailUrl,
        duracion: finalDuracion || undefined,
        id_stream: streamId ? Number(streamId) : null,
        destacado,
      });

      setSuccess("Momento destacado creado correctamente.");

      window.setTimeout(() => {
        navigate("/creator/streamer/highlights");
      }, 700);
    } catch (requestError) {
      console.error("HIGHLIGHT_UPLOAD_SAVE_ERROR", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo crear el momento destacado."
      );
    } finally {
      setSaving(false);
    }
  }

  const previewImage = thumbnailLocalPreview || thumbnailUrl.trim();

  return (
    <RootShell active="creator">
      <CreatorLayout>
        <CreatorNav />

        <CreatorMain>
          <FormCard onSubmit={submit}>
            <PageHeading>
              <Eyebrow>Formulario</Eyebrow>
              <h1>Subir momento destacado</h1>
              <p>
                Sube un clip desde tu computadora o usa una URL directa de
                video. La duración se detecta automáticamente cuando el
                navegador puede leer el video.
              </p>
            </PageHeading>

            {loadingStreams ? (
              <AlertPanel>
                <FiRefreshCw />
                <div>
                  <strong>Cargando streams</strong>
                  <p>Buscando streams de tu canal.</p>
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

            <Label>Título</Label>
            <Field>
              <FiType />
              <input
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                placeholder="Ej. Mejor jugada del directo"
                disabled={saving}
                maxLength={150}
              />
            </Field>

            <Label>Stream origen</Label>
            <Select
              value={streamId}
              onChange={(event) => setStreamId(event.target.value)}
              disabled={saving || loadingStreams}
            >
              <option value="">Sin stream origen</option>
              {streams.map((stream) => (
                <option key={stream.id_stream} value={stream.id_stream}>
                  {stream.titulo} ({stream.estado})
                </option>
              ))}
            </Select>

            <Label>Descripción</Label>
            <TextArea
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              placeholder="Describe brevemente el momento destacado."
              disabled={saving}
            />

            <Label>Subir video desde tu computadora</Label>
            <Field>
              <FiUpload />
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={handleVideoFileChange}
                disabled={saving}
              />
            </Field>

            {videoFile ? (
              <SuccessBox>
                <FiVideo /> Video seleccionado: {videoFile.name} · Duración:{" "}
                {duracion || "detectando..."}
              </SuccessBox>
            ) : null}

            <Label>O usar URL directa del video</Label>
            <Field>
              <FiLink />
              <input
                value={urlVideo}
                onChange={(event) => {
                  setUrlVideo(event.target.value);
                  setVideoFile(null);
                  setDuracion("");
                }}
                onBlur={handleVideoUrlBlur}
                placeholder="https://ejemplo.com/clip.mp4"
                disabled={saving}
              />
            </Field>

            {urlVideo.trim() ? (
              <SuccessBox>
                <FiVideo /> Duración detectada: {duracion || "pendiente"}
              </SuccessBox>
            ) : null}

            <Label>Subir miniatura desde tu computadora</Label>
            <Field>
              <FiUpload />
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleThumbnailFileChange}
                disabled={saving}
              />
            </Field>

            {thumbnailFile ? (
              <SuccessBox>
                <FiImage /> Miniatura seleccionada: {thumbnailFile.name}
              </SuccessBox>
            ) : null}

            <Label>O usar URL de miniatura</Label>
            <Field>
              <FiImage />
              <input
                value={thumbnailUrl}
                onChange={(event) => {
                  setThumbnailUrl(event.target.value);
                  setThumbnailFile(null);
                }}
                placeholder="https://ejemplo.com/miniatura.jpg"
                disabled={saving}
              />
            </Field>

            {previewImage && isUrl(previewImage) ? (
              <div
                style={{
                  minHeight: 220,
                  borderRadius: 22,
                  border: "1px solid rgba(0, 234, 255, 0.18)",
                  background: `linear-gradient(180deg, rgba(2,8,26,.12), rgba(2,8,26,.66)), url(${previewImage}) center/cover`,
                }}
              />
            ) : null}

            <Label>Publicación</Label>
            <Field>
              <FiStar />
              <select
                value={destacado ? "true" : "false"}
                onChange={(event) =>
                  setDestacado(event.target.value === "true")
                }
                disabled={saving}
                style={{
                  width: "100%",
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                <option value="true">Destacado público</option>
                <option value="false">Guardado sin destacar</option>
              </select>
            </Field>

            <ButtonRow>
              <GhostLink to="/creator/streamer/highlights">
                Cancelar
              </GhostLink>

              <PrimaryButton type="submit" disabled={saving}>
                <FiSave /> {saving ? "Guardando..." : "Guardar momento"}
              </PrimaryButton>
            </ButtonRow>
          </FormCard>
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}