import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiFile,
  FiImage,
  FiRefreshCw,
  FiSave,
  FiUpload,
  FiUser,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import {
  getMe,
  updateProfile,
  uploadProfilePhoto,
} from "../../../services/userService";
import { formatApiError } from "../../../shared/utils/rootblendHelpers";
import {
  AlertPanel,
  Avatar,
  ButtonRow,
  Eyebrow,
  Field,
  FormCard,
  GhostButton,
  Label,
  PageHeading,
  PrimaryButton,
  ProfileHeader,
  SuccessBox,
  TextArea,
} from "../../../shared/styles/legacyStyled";

function getInitials(name: string) {
  const cleanName = name.trim();

  if (!cleanName) {
    return "U";
  }

  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function isImageUrl(value: string) {
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/")
  );
}

function updateStoredProfileUser(data: {
  correo?: string;
  nombre_visible?: string;
  foto_perfil?: string | null;
}) {
  const keys = ["auth_user", "rootblend_user"];

  for (const key of keys) {
    const raw = localStorage.getItem(key);

    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      localStorage.setItem(
        key,
        JSON.stringify({
          ...parsed,
          ...data,
        })
      );
    } catch {
      // Si localStorage tiene datos viejos o corruptos, lo ignoramos.
    }
  }

  window.dispatchEvent(new Event("auth-changed"));
  window.dispatchEvent(new Event("auth-session-changed"));
  window.dispatchEvent(new Event("storage"));
}

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [nombreVisible, setNombreVisible] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [biografia, setBiografia] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewLocal, setPreviewLocal] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const result = await getMe();

        if (!active) return;

        if (!result.success || !result.data) {
          setError(result.message || "No se pudo cargar el perfil.");
          return;
        }

        setCorreo(result.data.usuario.correo || "");
        setNombreVisible(
          result.data.perfil.nombre_visible ||
            result.data.usuario.correo.split("@")[0] ||
            ""
        );
        setFotoPerfil(result.data.perfil.foto_perfil || "");
        setBiografia(result.data.perfil.biografia || "");
        setFechaNacimiento(result.data.perfil.fecha_nacimiento || "");
      } catch (error) {
        console.error("PROFILE_EDIT_LOAD_ERROR", error);

        if (active) {
          setError("No se pudo conectar con el servicio de usuarios.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewLocal("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewLocal(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const avatarPreview = useMemo(() => {
    if (previewLocal) {
      return previewLocal;
    }

    if (isImageUrl(fotoPerfil)) {
      return fotoPerfil;
    }

    return "";
  }, [fotoPerfil, previewLocal]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    setError("");
    setSuccessMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    const maxSize = 3 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("La imagen no debe superar los 3 MB.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      let finalPhotoUrl = fotoPerfil.trim();

      if (selectedFile) {
        const uploadResult = await uploadProfilePhoto(selectedFile);

        if (!uploadResult.success || !uploadResult.data) {
          setError(
            formatApiError(
              uploadResult.errors,
              uploadResult.message || "No se pudo subir la foto de perfil."
            )
          );
          return;
        }

        finalPhotoUrl = uploadResult.data.foto_perfil;
        setFotoPerfil(finalPhotoUrl);
        setSelectedFile(null);
      }

      const payload: {
        nombre_visible?: string;
        foto_perfil?: string;
        biografia?: string;
        fecha_nacimiento?: string;
      } = {
        nombre_visible: nombreVisible.trim(),
        foto_perfil: finalPhotoUrl,
        biografia: biografia.trim(),
        fecha_nacimiento: fechaNacimiento || "",
      };

      const result = await updateProfile(payload);

      if (!result.success) {
        setError(
          formatApiError(
            result.errors,
            result.message || "No se pudo actualizar el perfil."
          )
        );
        return;
      }

      updateStoredProfileUser({
        correo,
        nombre_visible: nombreVisible.trim(),
        foto_perfil: finalPhotoUrl || null,
      });

      setSuccessMessage("Perfil actualizado correctamente.");

      window.setTimeout(() => {
        navigate("/profile");
      }, 700);
    } catch (error) {
      console.error("PROFILE_UPDATE_ERROR", error);
      setError("No se pudo conectar con el servicio de usuarios.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RootShell active="home">
      <FormCard onSubmit={submit}>
        <PageHeading>
          <Eyebrow>Perfil real</Eyebrow>
          <h1>Editar perfil</h1>
          <p>
            Actualiza tu información pública. Ahora puedes subir una imagen
            desde tu computadora o usar una URL externa.
          </p>
        </PageHeading>

        {loading && (
          <AlertPanel>
            <FiRefreshCw />
            <div>
              <strong>Cargando perfil</strong>
              <p>Consultando datos actuales del usuario.</p>
            </div>
          </AlertPanel>
        )}

        {error && (
          <AlertPanel>
            <FiAlertTriangle />
            <div>
              <strong>Error</strong>
              <p>{error}</p>
            </div>
          </AlertPanel>
        )}

        {successMessage && (
          <SuccessBox>
            <FiCheckCircle /> {successMessage}
          </SuccessBox>
        )}

        <ProfileHeader>
          <Avatar $large>
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={nombreVisible || "Usuario"}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              getInitials(nombreVisible || correo || "Usuario")
            )}
          </Avatar>

          <GhostButton type="button" onClick={() => navigate("/profile")}>
            Vista previa de perfil
          </GhostButton>
        </ProfileHeader>

        <Label>Nombre visible</Label>
        <Field>
          <FiUser />
          <input
            value={nombreVisible}
            onChange={(event) => setNombreVisible(event.target.value)}
            placeholder="Ejemplo: Denilson"
            maxLength={100}
            required
            disabled={loading || saving}
          />
        </Field>

        <Label>Subir foto desde tu computadora</Label>
        <Field>
          <FiUpload />
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={loading || saving}
          />
        </Field>

        {selectedFile && (
          <SuccessBox>
            <FiImage />
            Imagen seleccionada: {selectedFile.name}
          </SuccessBox>
        )}

        <Label>O usar URL de foto de perfil</Label>
        <Field>
          <FiFile />
          <input
            value={fotoPerfil}
            onChange={(event) => {
              setFotoPerfil(event.target.value);
              setSelectedFile(null);
            }}
            placeholder="https://ejemplo.com/mi-foto.png"
            disabled={loading || saving}
          />
        </Field>

        <Label>Fecha de nacimiento</Label>
        <Field>
          <FiClock />
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(event) => setFechaNacimiento(event.target.value)}
            disabled={loading || saving}
          />
        </Field>

        <Label>Biografía</Label>
        <TextArea
          value={biografia}
          onChange={(event) => setBiografia(event.target.value)}
          placeholder="Cuéntale a la comunidad quién eres..."
          disabled={loading || saving}
        />

        <ButtonRow>
          <GhostButton type="button" onClick={() => navigate("/profile")}>
            Cancelar
          </GhostButton>

          <PrimaryButton type="submit" disabled={saving || loading}>
            <FiSave /> {saving ? "Guardando..." : "Guardar cambios"}
          </PrimaryButton>
        </ButtonRow>
      </FormCard>
    </RootShell>
  );
}