import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccessMessage("");

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

      setSuccessMessage(
        result.message ||
          "Si el correo existe, enviamos instrucciones de recuperación."
      );
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
          <p>
            Escribe el correo registrado en ROOTBLEND. Si existe una cuenta con
            ese correo, enviaremos un enlace para restablecer la contraseña.
          </p>
        </BrandBlock>

        <Label>Correo electrónico</Label>
        <Field>
          <FiMail />
          <input
            type="email"
            value={email}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            required
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
            <FiCheckCircle />
            <div>
              <strong>Solicitud enviada</strong>
              <p>{successMessage}</p>
              <p>
                Revisa la bandeja de entrada o spam del correo registrado.
              </p>
            </div>
          </SuccessBox>
        )}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </PrimaryButton>

        <GhostLink to="/reset-password">
          Ya tengo un enlace o token de recuperación
        </GhostLink>

        <GhostLink to="/login">Volver al inicio de sesión</GhostLink>

        <Link to="/login" style={{ display: "none" }} aria-hidden="true" />
      </AuthCard>
    </AuthScreen>
  );
}