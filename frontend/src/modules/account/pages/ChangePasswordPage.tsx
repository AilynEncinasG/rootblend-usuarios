import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiLogIn,
  FiSave,
  FiShield,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { changePassword } from "../../auth/services/authService";
import { clearAuthStorage } from "../../auth/utils/authStorage";
import { formatApiError } from "../../../shared/utils/rootblendHelpers";
import {
  AlertPanel,
  ButtonRow,
  Eyebrow,
  Field,
  FormCard,
  GhostLink,
  Label,
  PageHeading,
  PrimaryButton,
  SuccessBox,
} from "../../../shared/styles/legacyStyled";

type PasswordFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  visible: boolean;
  disabled: boolean;
  autoComplete: string;
  onToggleVisible: () => void;
  onChange: (value: string) => void;
};

function PasswordField({
  label,
  value,
  placeholder,
  visible,
  disabled,
  autoComplete,
  onToggleVisible,
  onChange,
}: PasswordFieldProps) {
  return (
    <>
      <Label>{label}</Label>

      <Field>
        <FiLock />

        <input
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required
          onChange={(event) => onChange(event.target.value)}
        />

        <button
          type="button"
          onClick={onToggleVisible}
          disabled={disabled}
          title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          style={{
            border: 0,
            background: "transparent",
            color: "inherit",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "grid",
            placeItems: "center",
            padding: 0,
          }}
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </Field>
    </>
  );
}

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-ZÁÉÍÓÚÑ]/.test(password)) score += 1;
  if (/[a-záéíóúñ]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9]/.test(password)) score += 1;

  if (!password) {
    return {
      label: "Sin contraseña",
      detail: "Escribe una nueva contraseña.",
    };
  }

  if (score <= 2) {
    return {
      label: "Débil",
      detail: "Usa mínimo 8 caracteres, números y letras.",
    };
  }

  if (score <= 4) {
    return {
      label: "Aceptable",
      detail: "Puedes mejorarla agregando mayúsculas o símbolos.",
    };
  }

  return {
    label: "Fuerte",
    detail: "La contraseña cumple una buena combinación.",
  };
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successDone, setSuccessDone] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const strength = useMemo(
    () => getPasswordStrength(passwordNueva),
    [passwordNueva]
  );

  function validateForm() {
    if (!passwordActual.trim()) {
      return "Debes ingresar tu contraseña actual.";
    }

    if (!passwordNueva.trim()) {
      return "Debes ingresar una nueva contraseña.";
    }

    if (passwordNueva.length < 8) {
      return "La nueva contraseña debe tener al menos 8 caracteres.";
    }

    if (passwordActual === passwordNueva) {
      return "La nueva contraseña no puede ser igual a la contraseña actual.";
    }

    if (!confirmPassword.trim()) {
      return "Debes confirmar la nueva contraseña.";
    }

    if (passwordNueva !== confirmPassword) {
      return "La confirmación no coincide con la nueva contraseña.";
    }

    return "";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccessMessage("");
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
      setSuccessDone(true);
      setSuccessMessage(
        result.message ||
          "Contraseña actualizada correctamente. Por seguridad, vuelve a iniciar sesión."
      );

      window.setTimeout(() => {
        clearAuthStorage();
        navigate("/login", { replace: true });
      }, 1600);
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
          <Eyebrow>Seguridad de cuenta</Eyebrow>
          <h1>Cambiar contraseña</h1>
          <p>
            Actualiza tu contraseña usando tu sesión actual. Después del cambio,
            ROOTBLEND cerrará tu sesión por seguridad.
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
            <FiCheckCircle />
            <div>
              <strong>Contraseña actualizada</strong>
              <p>{successMessage}</p>
              <p>Redirigiendo al inicio de sesión...</p>
            </div>
          </SuccessBox>
        )}

        <PasswordField
          label="Contraseña actual"
          value={passwordActual}
          placeholder="Ingresa tu contraseña actual"
          visible={showCurrent}
          disabled={saving || successDone}
          autoComplete="current-password"
          onToggleVisible={() => setShowCurrent((value) => !value)}
          onChange={setPasswordActual}
        />

        <PasswordField
          label="Nueva contraseña"
          value={passwordNueva}
          placeholder="Mínimo 8 caracteres"
          visible={showNew}
          disabled={saving || successDone}
          autoComplete="new-password"
          onToggleVisible={() => setShowNew((value) => !value)}
          onChange={setPasswordNueva}
        />

        <AlertPanel>
          <FiShield />
          <div>
            <strong>Seguridad: {strength.label}</strong>
            <p>{strength.detail}</p>
          </div>
        </AlertPanel>

        <PasswordField
          label="Confirmar nueva contraseña"
          value={confirmPassword}
          placeholder="Repite la nueva contraseña"
          visible={showConfirm}
          disabled={saving || successDone}
          autoComplete="new-password"
          onToggleVisible={() => setShowConfirm((value) => !value)}
          onChange={setConfirmPassword}
        />

        <ButtonRow>
          <GhostLink to="/profile">Volver al perfil</GhostLink>

          <PrimaryButton type="submit" disabled={saving || successDone}>
            {successDone ? (
              <>
                <FiLogIn /> Volver a iniciar sesión
              </>
            ) : (
              <>
                <FiSave /> {saving ? "Actualizando..." : "Actualizar contraseña"}
              </>
            )}
          </PrimaryButton>
        </ButtonRow>
      </FormCard>
    </RootShell>
  );
}