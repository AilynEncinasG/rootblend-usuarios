import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiLock, FiMail } from "react-icons/fi";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  AuthCard,
  AuthScreen,
  BrandBlock,
  Field,
  FormLine,
  Label,
  Muted,
  PrimaryButton,
} from "../../../shared/styles/legacyStyled";
import { loginUser, saveAuthSession } from "../services/authService";
import { formatApiError } from "../utils/formatApiError";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Completa correo y contrasena.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await loginUser(email, password);

      if (!result.success || !result.data) {
        setError(
          formatApiError(
            result.errors,
            result.message || "No se pudo iniciar sesión."
          )
        );
        return;
      }

      saveAuthSession(result.data);

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("auth-session-changed"));

      navigate("/", { replace: true });
    } catch (error) {
      console.error("LOGIN_ERROR", error);
      setError("No se pudo conectar con el servicio de usuarios.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen $image={brandAssets.loginView}>
      <AuthCard onSubmit={submit} autoComplete="off">
        <BrandBlock>
          <img src={brandAssets.logo} alt="ROOTBLEND" />
          <h1>
            ROOT<span>BLEND</span>
          </h1>
          <p>Inicia sesión en tu cuenta</p>
        </BrandBlock>

        <Label>Correo electrónico</Label>
        <Field>
          <FiMail />
          <input
            type="email"
            value={email}
            autoComplete="off"
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Label>Contraseña</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <FormLine>
          <span />
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </FormLine>

        {error && (
          <AlertPanel>
            <FiAlertTriangle />
            <div>
              <strong>Error de inicio de sesión</strong>
              <p>{error}</p>
            </div>
          </AlertPanel>
        )}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Conectando..." : "Iniciar sesión"}
        </PrimaryButton>

        <Muted>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </Muted>
      </AuthCard>
    </AuthScreen>
  );
}