import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
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
  const cleanValue = value.trim();

  return (
    cleanValue.startsWith("http://") ||
    cleanValue.startsWith("https://") ||
    cleanValue.startsWith("data:image/")
  );
}

function updateStoredProfileUser(data: {
  id_usuario?: number;
  correo?: string;
  estado?: string;
  nombre_visible?: string;
  foto_perfil?: string | null;
}) {
  const mainKeys = ["auth_user", "rootblend_user"];
  const optionalKeys = ["user"];

  let baseUser: Record<string, unknown> = {};

  for (const key of [...mainKeys, ...optionalKeys]) {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);

    if (!raw) continue;

    try {
      baseUser = {
        ...baseUser,
        ...(JSON.parse(raw) as Record<string, unknown>),
      };
    } catch {
    }
  }

  const nextUser = {
    ...baseUser,
    ...data,
  };

  const serializedUser = JSON.stringify(nextUser);

  for (const key of mainKeys) {
    localStorage.setItem(key, serializedUser);
  }

  for (const key of optionalKeys) {
    if (localStorage.getItem(key)) {
      localStorage.setItem(key, serializedUser);
    }

    if (sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, serializedUser);
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const BIO_MAX_LENGTH = 250;

  function getMaxBirthDateForAge(minAge: number) {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate()
    );

    return maxDate.toISOString().split("T")[0];
  }

  const maxBirthDate = getMaxBirthDateForAge(15);

  function handleBirthDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextDate = event.target.value;

    if (!nextDate) {
      setFechaNacimiento("");
      return;
    }

    if (nextDate > maxBirthDate) {
      setFechaNacimiento(maxBirthDate);
      return;
    }

    setFechaNacimiento(nextDate);
  }

  function handleBiographyChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const nextValue = event.target.value;

    if (nextValue.length <= BIO_MAX_LENGTH) {
      setBiografia(nextValue);
    }
  }

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

        const nextCorreo = result.data.usuario.correo || "";
        const nextNombre =
          result.data.perfil.nombre_visible ||
          result.data.usuario.correo.split("@")[0] ||
          "";
        const nextFoto = result.data.perfil.foto_perfil || "";
        const nextBiografia = result.data.perfil.biografia || "";
        const nextFechaNacimiento = result.data.perfil.fecha_nacimiento || "";

        setCorreo(nextCorreo);
        setNombreVisible(nextNombre);
        setFotoPerfil(nextFoto);
        setBiografia(nextBiografia);
        setFechaNacimiento(nextFechaNacimiento);

        updateStoredProfileUser({
          id_usuario: result.data.usuario.id_usuario,
          correo: nextCorreo,
          estado: result.data.usuario.estado,
          nombre_visible: nextNombre,
          foto_perfil: nextFoto || null,
        });
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
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);

    if (file) {
      setFotoPerfil("");
    }
  }

  function handlePhotoUrlChange(event: ChangeEvent<HTMLInputElement>) {
    const nextUrl = event.target.value;

    setFotoPerfil(nextUrl);
    setSelectedFile(null);
    setPreviewLocal("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (fechaNacimiento && fechaNacimiento > maxBirthDate) {
      setError("Debes tener al menos 15 años para usar esta fecha de nacimiento.");
      return;
    }

    if (biografia.length > BIO_MAX_LENGTH) {
      setError("La biografía no puede tener más de 250 caracteres.");
      return;
    }

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

      const backendPhoto =
        result.data?.perfil?.foto_perfil || finalPhotoUrl || "";
      const backendName =
        result.data?.perfil?.nombre_visible || nombreVisible.trim();

      setNombreVisible(backendName);
      setFotoPerfil(backendPhoto);

      updateStoredProfileUser({
        correo,
        nombre_visible: backendName,
        foto_perfil: backendPhoto || null,
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
          <h1>Editar perfil</h1>
          <p>
            Actualiza tu información pública. Puedes subir una imagen desde tu
            computadora o usar una URL externa.
          </p>
        </PageHeading>

        {loading ? (
          <AlertPanel>
            <FiRefreshCw />
            <div>
              <strong>Cargando perfil</strong>
              <p>Consultando datos actuales del usuario.</p>
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

        {successMessage ? (
          <SuccessBox>
            <FiCheckCircle /> {successMessage}
          </SuccessBox>
        ) : null}

        <ProfileHeader>
          <Avatar $large>
            {avatarPreview ? (
              <img src={avatarPreview} alt={nombreVisible || "Usuario"} />
            ) : (
              getInitials(nombreVisible || correo || "Usuario")
            )}
          </Avatar>

          <GhostButton>
            Vista previa
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
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={loading || saving}
          />
        </Field>

        {selectedFile ? (
          <SuccessBox>
            <FiImage />
            Imagen seleccionada: {selectedFile.name}
          </SuccessBox>
        ) : null}

        <Label>O usar URL de foto de perfil</Label>
        <Field>
          <FiFile />
          <input
            value={fotoPerfil}
            onChange={handlePhotoUrlChange}
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
            max={maxBirthDate}
            onChange={handleBirthDateChange}
            disabled={loading || saving}
          />
        </Field>

        <Label>Biografía</Label>
        <TextArea
          value={biografia}
          onChange={handleBiographyChange}
          maxLength={BIO_MAX_LENGTH}
          placeholder="Cuéntale a la comunidad quién eres..."
          disabled={loading || saving}
        />

        <small style={{ color: "rgba(226, 232, 240, 0.68)" }}>
          {biografia.length}/{BIO_MAX_LENGTH} caracteres
        </small>

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