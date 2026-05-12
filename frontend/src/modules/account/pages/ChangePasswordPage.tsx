import { type FormEvent, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiLock, FiSave } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { changePassword } from "../../auth/services/authService";
import { formatApiError } from "../../../shared/utils/rootblendHelpers";
import { AlertPanel, ButtonRow, Eyebrow, Field, FormCard, GhostLink, Label, PageHeading, PrimaryButton, SuccessBox } from "../../../shared/styles/legacyStyled";

export default function ChangePasswordPage() {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!passwordActual.trim()) {
      setError("Debes ingresar tu contraseña actual.");
      return;
    }

    if (passwordNueva.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (passwordNueva !== confirmPassword) {
      setError("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await changePassword(passwordActual, passwordNueva);

      if (!result.success) {
        setError(
          formatApiError(
            result.errors,
            result.message || "No se pudo cambiar la contraseña."
          )
        );
        return;
      }

      setPasswordActual("");
      setPasswordNueva("");
      setConfirmPassword("");
      setSuccessMessage("Contraseña actualizada correctamente.");
    } catch (error) {
      console.error("CHANGE_PASSWORD_ERROR", error);
      setError("No se pudo conectar con el servicio de usuarios.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RootShell active="home">
      <FormCard onSubmit={submit}>
        <PageHeading>
          <Eyebrow>Seguridad real</Eyebrow>
          <h1>Cambiar contraseña</h1>
          <p>
            Actualiza tu contraseña usando el servicio real de usuarios y tu JWT
            activo.
          </p>
        </PageHeading>

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

        <Label>Contraseña actual</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={passwordActual}
            onChange={(event) => setPasswordActual(event.target.value)}
            placeholder="Ingresa tu contraseña actual"
          />
        </Field>

        <Label>Nueva contraseña</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={passwordNueva}
            onChange={(event) => setPasswordNueva(event.target.value)}
            placeholder="Nueva contrasena"
          />
        </Field>

        <Label>Confirmar nueva contraseña</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repite la nueva contraseña"
          />
        </Field>

        <ButtonRow>
          <GhostLink to="/profile">Volver al perfil</GhostLink>

          <PrimaryButton type="submit" disabled={saving}>
            <FiSave /> {saving ? "Actualizando..." : "Actualizar contraseña"}
          </PrimaryButton>
        </ButtonRow>
      </FormCard>
    </RootShell>
  );
}
