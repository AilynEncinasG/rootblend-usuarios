import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiCheckCircle, FiClock, FiFile, FiRefreshCw, FiSave, FiUser } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { getMe, updateProfile } from "../../../services/userService";
import { formatApiError } from "../../../shared/utils/rootblendHelpers";
import { AlertPanel, Avatar, ButtonRow, Eyebrow, Field, FormCard, GhostButton, Label, PageHeading, PrimaryButton, ProfileHeader, SuccessBox, TextArea } from "../../../shared/styles/legacyStyled";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [nombreVisible, setNombreVisible] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [biografia, setBiografia] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

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

        setNombreVisible(result.data.perfil.nombre_visible || "");
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

  function updateStoredUserName(nextName: string) {
    const raw = localStorage.getItem("auth_user");

    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          ...parsed,
          nombre_visible: nextName,
        })
      );

      window.dispatchEvent(new Event("auth-changed"));
    } catch {
      // No hacemos nada si el usuario local no se puede parsear.
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload: {
        nombre_visible?: string;
        foto_perfil?: string;
        biografia?: string;
        fecha_nacimiento?: string;
      } = {
        nombre_visible: nombreVisible.trim(),
        foto_perfil: fotoPerfil.trim(),
        biografia: biografia.trim(),
      };

      if (fechaNacimiento) {
        payload.fecha_nacimiento = fechaNacimiento;
      }

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

      updateStoredUserName(nombreVisible.trim());
      setSuccessMessage("Perfil actualizado correctamente.");
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
            Actualiza tu informacion publica. Estos datos se guardan en
            usuarios-service usando tu JWT.
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
            {(nombreVisible || "U").slice(0, 1).toUpperCase()}
          </Avatar>

          <GhostButton type="button">
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
          />
        </Field>

        <Label>URL o nombre de foto de perfil</Label>
        <Field>
          <FiFile />
          <input
            value={fotoPerfil}
            onChange={(event) => setFotoPerfil(event.target.value)}
            placeholder="https://... o archivo-perfil.png"
          />
        </Field>

        <Label>Fecha de nacimiento</Label>
        <Field>
          <FiClock />
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(event) => setFechaNacimiento(event.target.value)}
          />
        </Field>

        <Label>Biografia</Label>
        <TextArea
          value={biografia}
          onChange={(event) => setBiografia(event.target.value)}
          placeholder="Cuentale a la comunidad quien eres..."
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
