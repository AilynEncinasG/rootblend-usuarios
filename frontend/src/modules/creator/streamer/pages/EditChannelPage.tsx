import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiImage,
  FiRefreshCw,
  FiSave,
  FiType,
  FiUpload,
} from "react-icons/fi";
import { RootShell } from "../../../../shared/layout";
import {
  AlertPanel,
  Avatar,
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
  SuccessBox,
  TextArea,
} from "../../../../shared/styles/legacyStyled";
import { CreatorNav } from "../../shared/creatorLegacy";
import {
  getMyChannel,
  updateMyChannel,
  uploadChannelImage,
  type Canal,
} from "../../../streams/services/streamsService";

function getInitials(value?: string | null) {
  const clean = String(value || "").trim();

  if (!clean) {
    return "CH";
  }

  return (
    clean
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "CH"
  );
}

function isImageUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  const cleanValue = value.trim();

  return (
    cleanValue.startsWith("http://") || cleanValue.startsWith("https://")
  );
}

function isLocalMediaUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  const cleanValue = value.trim().toLowerCase();

  return (
    cleanValue.includes("localhost:8080/canales-media") ||
    cleanValue.includes("127.0.0.1:8080/canales-media") ||
    cleanValue.startsWith("/canales-media") ||
    cleanValue.includes("/canales-media/")
  );
}

function cleanDemoImageUrl(value?: string | null) {
  if (!value) {
    return "";
  }

  const cleanValue = value.trim();

  if (isLocalMediaUrl(cleanValue)) {
    return "";
  }

  return cleanValue;
}

function validateImageFile(file: File, tipo: "foto" | "banner") {
  if (!file.type.startsWith("image/")) {
    return "Selecciona un archivo de imagen válido.";
  }

  const maxSize = tipo === "banner" ? 5 * 1024 * 1024 : 3 * 1024 * 1024;

  if (file.size > maxSize) {
    return tipo === "banner"
      ? "El banner no debe superar los 5 MB."
      : "La foto del canal no debe superar los 3 MB.";
  }

  return "";
}

export default function EditChannelPage() {
  const navigate = useNavigate();

  const [channel, setChannel] = useState<Canal | null>(null);

  const [nombreCanal, setNombreCanal] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotoCanal, setFotoCanal] = useState("");
  const [bannerCanal, setBannerCanal] = useState("");

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [fotoPreviewLocal, setFotoPreviewLocal] = useState("");
  const [bannerPreviewLocal, setBannerPreviewLocal] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadChannel() {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const result = await getMyChannel();

        if (!active) return;

        if (!result.tiene_canal || !result.canal) {
          setError("Todavía no tienes un canal activo.");
          return;
        }

        setChannel(result.canal);
        setNombreCanal(result.canal.nombre_canal || "");
        setDescripcion(result.canal.descripcion || "");

        /*
          Importante para demo:
          Si la BD trae una imagen local tipo localhost/canales-media,
          no la reutilizamos en el input para evitar que se vuelva a guardar.
        */
        setFotoCanal(cleanDemoImageUrl(result.canal.foto_canal));
        setBannerCanal(cleanDemoImageUrl(result.canal.banner_canal));
      } catch (err) {
        console.error("EDIT_CHANNEL_LOAD_ERROR", err);

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la información del canal."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadChannel();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!fotoFile) {
      setFotoPreviewLocal("");
      return;
    }

    const objectUrl = URL.createObjectURL(fotoFile);
    setFotoPreviewLocal(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [fotoFile]);

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreviewLocal("");
      return;
    }

    const objectUrl = URL.createObjectURL(bannerFile);
    setBannerPreviewLocal(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [bannerFile]);

  const avatarPreview = useMemo(() => {
    if (fotoPreviewLocal) {
      return fotoPreviewLocal;
    }

    const cleanFoto = cleanDemoImageUrl(fotoCanal || channel?.foto_canal);

    return isImageUrl(cleanFoto) ? cleanFoto : "";
  }, [channel?.foto_canal, fotoCanal, fotoPreviewLocal]);

  const bannerPreview = useMemo(() => {
    if (bannerPreviewLocal) {
      return bannerPreviewLocal;
    }

    const cleanBanner = cleanDemoImageUrl(bannerCanal || channel?.banner_canal);

    return isImageUrl(cleanBanner) ? cleanBanner : "";
  }, [bannerCanal, bannerPreviewLocal, channel?.banner_canal]);

  function handleFotoFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    setError("");
    setSuccess("");

    if (!file) {
      setFotoFile(null);
      return;
    }

    const validationError = validateImageFile(file, "foto");

    if (validationError) {
      setError(validationError);
      event.target.value = "";
      setFotoFile(null);
      return;
    }

    /*
      Si seleccionas archivo, limpiamos la URL.
      Si quieres usar URL externa, no selecciones archivo.
    */
    setFotoCanal("");
    setFotoFile(file);
  }

  function handleBannerFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    setError("");
    setSuccess("");

    if (!file) {
      setBannerFile(null);
      return;
    }

    const validationError = validateImageFile(file, "banner");

    if (validationError) {
      setError(validationError);
      event.target.value = "";
      setBannerFile(null);
      return;
    }

    /*
      Si seleccionas archivo, limpiamos la URL.
      Si quieres usar URL externa, no selecciones archivo.
    */
    setBannerCanal("");
    setBannerFile(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    const cleanNombre = nombreCanal.trim();
    const cleanDescripcion = descripcion.trim();

    let finalFoto = cleanDemoImageUrl(fotoCanal);
    let finalBanner = cleanDemoImageUrl(bannerCanal);

    if (!cleanNombre) {
      setError("El nombre del canal es obligatorio.");
      return;
    }

    if (cleanNombre.length > 100) {
      setError("El nombre del canal no puede superar 100 caracteres.");
      return;
    }

    if (finalFoto && !isImageUrl(finalFoto)) {
      setError(
        "La foto del canal debe ser una URL válida que empiece con http:// o https://."
      );
      return;
    }

    if (finalFoto.length > 255) {
      setError("La URL de la foto no puede superar 255 caracteres.");
      return;
    }

    if (finalBanner && !isImageUrl(finalBanner)) {
      setError(
        "El banner del canal debe ser una URL válida que empiece con http:// o https://."
      );
      return;
    }

    if (finalBanner.length > 255) {
      setError("La URL del banner no puede superar 255 caracteres.");
      return;
    }

    setSaving(true);

    try {
      /*
        Regla importante:
        1. Si escribiste URL externa, esa URL gana.
        2. Solo se sube archivo local si el input URL está vacío.
        3. Así ya no vuelve a guardar localhost si estás usando URLs para demo.
      */

      if (!finalFoto && fotoFile) {
        const uploadedPhoto = await uploadChannelImage("foto", fotoFile);
        finalFoto = uploadedPhoto.url;
      }

      if (!finalBanner && bannerFile) {
        const uploadedBanner = await uploadChannelImage("banner", bannerFile);
        finalBanner = uploadedBanner.url;
      }

      const updatedChannel = await updateMyChannel({
        nombre_canal: cleanNombre,
        descripcion: cleanDescripcion,
        foto_canal: finalFoto,
        banner_canal: finalBanner,
      });

      setChannel(updatedChannel);
      setFotoCanal(cleanDemoImageUrl(updatedChannel.foto_canal));
      setBannerCanal(cleanDemoImageUrl(updatedChannel.banner_canal));
      setFotoFile(null);
      setBannerFile(null);

      setSuccess("Canal actualizado correctamente.");

      window.setTimeout(() => {
        navigate("/creator/streamer/dashboard");
      }, 700);
    } catch (err) {
      console.error("EDIT_CHANNEL_SAVE_ERROR", err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el canal."
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
          <FormCard onSubmit={submit}>
            <PageHeading>
              <Eyebrow>Branding del canal</Eyebrow>
              <h1>Editar canal</h1>
              <p>
                Configura el nombre, la descripción, la foto y el banner del
                canal. Para la demostración se recomienda usar URLs públicas de
                imagen.
              </p>
            </PageHeading>

            {loading ? (
              <AlertPanel>
                <FiRefreshCw />
                <div>
                  <strong>Cargando canal</strong>
                  <p>Consultando la información actual del canal.</p>
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

            <div
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(0, 220, 255, 0.20)",
                background: bannerPreview
                  ? `linear-gradient(180deg, rgba(2,8,26,.20), rgba(2,8,26,.78)), url(${bannerPreview}) center/cover`
                  : "linear-gradient(135deg, rgba(0, 217, 255, 0.16), rgba(127, 86, 217, 0.18))",
                minHeight: 230,
                display: "flex",
                alignItems: "flex-end",
                padding: 26,
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <Avatar $large>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={nombreCanal || "Canal"}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    getInitials(nombreCanal || channel?.nombre_canal)
                  )}
                </Avatar>

                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#00eaff",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    Vista previa
                  </p>
                  <h2 style={{ margin: "4px 0", fontSize: 34 }}>
                    {nombreCanal || "Tu canal"}
                  </h2>
                  <p style={{ margin: 0 }}>
                    {descripcion || "Describe tu canal para la comunidad."}
                  </p>
                </div>
              </div>
            </div>

            <Label>Nombre del canal</Label>
            <Field>
              <FiType />
              <input
                value={nombreCanal}
                onChange={(event) => setNombreCanal(event.target.value)}
                placeholder="Ej. TTCEREN"
                maxLength={100}
                disabled={loading || saving}
              />
            </Field>

            <Label>Descripción</Label>
            <TextArea
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              placeholder="Ej. Canal de directos, charlas y demostraciones."
              disabled={loading || saving}
            />

            <Label>URL de foto del canal</Label>
            <Field>
              <FiImage />
              <input
                value={fotoCanal}
                onChange={(event) => {
                  setFotoCanal(event.target.value);
                  setFotoFile(null);
                }}
                placeholder="https://ejemplo.com/foto-canal.jpg"
                disabled={loading || saving}
              />
            </Field>

            <Label>Subir foto del canal desde tu computadora</Label>
            <Field>
              <FiUpload />
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleFotoFileChange}
                disabled={loading || saving}
              />
            </Field>

            {fotoFile ? (
              <SuccessBox>
                <FiImage />
                Foto seleccionada: {fotoFile.name}
              </SuccessBox>
            ) : null}

            <Label>URL de banner del canal</Label>
            <Field>
              <FiImage />
              <input
                value={bannerCanal}
                onChange={(event) => {
                  setBannerCanal(event.target.value);
                  setBannerFile(null);
                }}
                placeholder="https://ejemplo.com/banner-canal.jpg"
                disabled={loading || saving}
              />
            </Field>

            <Label>Subir banner del canal desde tu computadora</Label>
            <Field>
              <FiUpload />
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleBannerFileChange}
                disabled={loading || saving}
              />
            </Field>

            {bannerFile ? (
              <SuccessBox>
                <FiImage />
                Banner seleccionado: {bannerFile.name}
              </SuccessBox>
            ) : null}

            <ButtonRow>
              <GhostLink to="/creator/streamer/dashboard">Cancelar</GhostLink>

              <PrimaryButton type="submit" disabled={loading || saving}>
                <FiSave /> {saving ? "Guardando..." : "Guardar canal"}
              </PrimaryButton>
            </ButtonRow>
          </FormCard>
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}