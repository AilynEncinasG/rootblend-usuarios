import { type FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  AuthCard,
  AuthScreen,
  BrandBlock,
  Field,
  GhostLink,
  Label,
  PrimaryButton,
  SuccessBox,
} from "../../../shared/styles/legacyStyled";
import { resetPassword } from "../services/authService";
import { formatApiError } from "../utils/formatApiError";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [token, setToken] = useState(params.get("token") || "");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token.trim()) {
      setError("Debes ingresar el token de recuperación.");
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

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await resetPassword(token.trim(), passwordNueva);

      if (!result.success) {
        setError(
          formatApiError(
            result.errors,
            result.message || "No se pudo restablecer la contraseña."
          )
        );
        return;
      }

      setSuccessMessage(
        "Contraseña restablecida correctamente. Redirigiendo al login..."
      );

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      console.error("RESET_PASSWORD_ERROR", error);
      setError("No se pudo conectar con el servicio de usuarios.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen $image={brandAssets.loginView}>
      <AuthCard onSubmit={submit}>
        <BrandBlock>
          <FiLock />
          <h1>Nueva contraseña</h1>
          <p>Usa el token de recuperación para definir una nueva contraseña.</p>
        </BrandBlock>

        <Label>Token de recuperación</Label>
        <Field>
          <FiLock />
          <input
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Pega aquí el token"
          />
        </Field>

        <Label>Nueva contraseña</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={passwordNueva}
            onChange={(event) => setPasswordNueva(event.target.value)}
          />
        </Field>

        <Label>Confirmar contraseña</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Field>

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

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Restableciendo..." : "Guardar nueva contraseña"}
        </PrimaryButton>

        <GhostLink to="/login">Volver al inicio de sesión</GhostLink>
      </AuthCard>
    </AuthScreen>
  );
}