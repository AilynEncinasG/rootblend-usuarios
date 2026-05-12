import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiLock, FiMail } from "react-icons/fi";
import { brandAssets } from "../../../shared/mock/rootblendMock";
import {
  AlertPanel,
  AuthCard,
  AuthScreen,
  BrandBlock,
  ChoiceButton,
  ChoiceGrid,
  Field,
  Label,
  Muted,
  PrimaryButton,
} from "../../../shared/styles/legacyStyled";
import {
  loginUser,
  registerUser,
  saveAuthSession,
} from "../services/authService";
import { formatApiError } from "../utils/formatApiError";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"viewer" | "streamer" | "podcaster">(
    "viewer"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Completa correo, contrasena y confirmacion.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await registerUser(email, password);

      if (!result.success) {
        setError(
          formatApiError(
            result.errors,
            result.message || "No se pudo registrar el usuario."
          )
        );
        return;
      }

      const loginResult = await loginUser(email, password);

      if (loginResult.success && loginResult.data) {
        saveAuthSession(loginResult.data);

        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("auth-session-changed"));

        navigate(
          role === "streamer"
            ? "/creator/activate"
            : role === "podcaster"
              ? "/creator/activate"
              : "/",
          { replace: true }
        );

        return;
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("REGISTER_ERROR", error);
      setError("No se pudo conectar con el servicio de usuarios.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen $image={brandAssets.cover}>
      <AuthCard onSubmit={submit}>
        <BrandBlock>
          <img src={brandAssets.logo} alt="ROOTBLEND" />
          <h1>Crea tu cuenta</h1>
          <p>Únete a la comunidad de ROOTBLEND</p>
        </BrandBlock>

        <Label>Correo electrónico</Label>
        <Field>
          <FiMail />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Label>Contraseña</Label>
        <Field>
          <FiLock />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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

        <ChoiceGrid>
          <ChoiceButton
            type="button"
            $active={role === "viewer"}
            onClick={() => setRole("viewer")}
          >
            Viewer
          </ChoiceButton>

          <ChoiceButton
            type="button"
            $active={role === "streamer"}
            onClick={() => setRole("streamer")}
          >
            Streamer
          </ChoiceButton>

          <ChoiceButton
            type="button"
            $active={role === "podcaster"}
            onClick={() => setRole("podcaster")}
          >
            Podcaster
          </ChoiceButton>
        </ChoiceGrid>

        {error && (
          <AlertPanel>
            <FiAlertTriangle />
            <div>
              <strong>Error de registro</strong>
              <p>{error}</p>
            </div>
          </AlertPanel>
        )}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </PrimaryButton>

        <Muted>
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </Muted>
      </AuthCard>
    </AuthScreen>
  );
}