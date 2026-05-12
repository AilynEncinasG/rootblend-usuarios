import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiLock,
  FiMail,
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
import { forgotPassword } from "../services/authService";
import { formatApiError } from "../utils/formatApiError";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recoveryToken, setRecoveryToken] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccessMessage("");
    setRecoveryToken("");

    try {
      const result = await forgotPassword(email);

      if (!result.success) {
        setError(
          formatApiError(
            result.errors,
            result.message || "No se pudo enviar la recuperación."
          )
        );
        return;
      }

      setSuccessMessage(result.message || "Solicitud de recuperación generada.");

      if (result.data?.token_recuperacion) {
        setRecoveryToken(result.data.token_recuperacion);
      }
    } catch (error) {
      console.error("FORGOT_PASSWORD_ERROR", error);
      setError("No se pudo conectar con el servicio de usuarios.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen $image={brandAssets.loginView}>
      <AuthCard onSubmit={submit}>
        <BrandBlock>
          <FiMail />
          <h1>Recupera tu contraseña</h1>
          <p>Solicita un token de recuperación para restablecer tu contraseña.</p>
        </BrandBlock>

        <Label>Correo electrónico</Label>
        <Field>
          <FiMail />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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

        {recoveryToken && (
          <AlertPanel>
            <FiLock />
            <div>
              <strong>Token de recuperación</strong>
              <p>{recoveryToken}</p>
              <p>
                Copia este token y úsalo en la pantalla de nueva contraseña.
              </p>
            </div>
          </AlertPanel>
        )}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Solicitando..." : "Enviar recuperación"}
        </PrimaryButton>

        {recoveryToken && (
          <GhostLink
            to={`/reset-password?token=${encodeURIComponent(recoveryToken)}`}
          >
            Ir a restablecer contraseña
          </GhostLink>
        )}

        <GhostLink to="/login">Volver al inicio de sesión</GhostLink>

        <Link to="/login" style={{ display: "none" }} aria-hidden="true" />
      </AuthCard>
    </AuthScreen>
  );
}