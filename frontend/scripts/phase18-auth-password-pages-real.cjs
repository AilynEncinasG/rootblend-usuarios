const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(projectRoot, "src");

function writeFile(relativePath, content) {
  const filePath = path.join(srcRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`[OK] creado src/${relativePath.replace(/\\/g, "/")}`);
}

writeFile(
  "modules/auth/services/passwordRecoveryService.ts",
  `export type PasswordResetRequestPayload = {
  correo: string;
};

export type PasswordResetConfirmPayload = {
  token: string;
  password: string;
  password_confirm: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function getErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== "object") {
    return fallback;
  }

  const data = body as Record<string, unknown>;

  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;

  const firstValue = Object.values(data)[0];

  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return String(firstValue[0]);
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return fallback;
}

async function postJson<T>(path: string, payload: unknown, fallback: string) {
  const response = await fetch(\`\${API_BASE_URL}\${path}\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(body, fallback));
  }

  return body as T;
}

export function requestPasswordReset(payload: PasswordResetRequestPayload) {
  return postJson(
    "/api/auth/password-reset/request/",
    payload,
    "No se pudo enviar la solicitud de recuperación."
  );
}

export function confirmPasswordReset(payload: PasswordResetConfirmPayload) {
  return postJson(
    "/api/auth/password-reset/confirm/",
    payload,
    "No se pudo restablecer la contraseña."
  );
}
`
);

writeFile(
  "modules/auth/pages/ForgotPasswordPage.tsx",
  `import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle, FiMail } from "react-icons/fi";
import styled from "styled-components";
import { brandAssets } from "../../../modules/mock/rootblendMock";
import {
  AlertPanel,
  AuthCard,
  AuthScreen,
  BrandBlock,
  ButtonRow,
  FormLine,
  GhostLink,
  Label,
  Muted,
  PrimaryButton,
  SuccessBox,
} from "../../../shared/styles/legacyStyled";
import { requestPasswordReset } from "../services/passwordRecoveryService";

const AuthInput = styled.input\`
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.72);
  color: #f8fafc;
  padding: 14px 16px;
  outline: none;

  &::placeholder {
    color: rgba(226, 232, 240, 0.45);
  }

  &:focus {
    border-color: rgba(0, 229, 255, 0.75);
    box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.12);
  }
\`;

function isValidEmail(value: string) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
}

export default function ForgotPasswordPage() {
  const [correo, setCorreo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = correo.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage("Ingresa tu correo electrónico.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage("Ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await requestPasswordReset({
        correo: cleanEmail,
      });

      setSent(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la recuperación."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen $image={brandAssets.streamView}>
      <AuthCard>
        <BrandBlock>
          <span>ROOTBLEND</span>
          <h1>Recuperar contraseña</h1>
          <p>
            Ingresa tu correo y te enviaremos las instrucciones para recuperar
            el acceso a tu cuenta.
          </p>
        </BrandBlock>

        {sent ? (
          <SuccessBox>
            <FiCheckCircle />
            <div>
              <strong>Solicitud enviada</strong>
              <Muted>
                Si el correo existe en ROOTBLEND, recibirás instrucciones para
                restablecer tu contraseña.
              </Muted>
            </div>
          </SuccessBox>
        ) : null}

        {errorMessage ? (
          <AlertPanel>
            <FiAlertCircle />
            <div>
              <strong>No se pudo enviar la solicitud</strong>
              <Muted>{errorMessage}</Muted>
            </div>
          </AlertPanel>
        ) : null}

        <form onSubmit={submit}>
          <FormLine>
            <Label htmlFor="correo">Correo electrónico</Label>
            <AuthInput
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              placeholder="tu-correo@rootblend.dev"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
            />
          </FormLine>

          <ButtonRow>
            <PrimaryButton type="submit" disabled={loading}>
              <FiMail />
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </PrimaryButton>

            <GhostLink to="/login">Volver al login</GhostLink>
          </ButtonRow>
        </form>

        <Muted>
          ¿Aún no tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </Muted>
      </AuthCard>
    </AuthScreen>
  );
}
`
);

writeFile(
  "modules/auth/pages/ResetPasswordPage.tsx",
  `import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle, FiKey } from "react-icons/fi";
import styled from "styled-components";
import { brandAssets } from "../../../modules/mock/rootblendMock";
import {
  AlertPanel,
  AuthCard,
  AuthScreen,
  BrandBlock,
  ButtonRow,
  FormLine,
  GhostLink,
  Label,
  Muted,
  PrimaryButton,
  SuccessBox,
} from "../../../shared/styles/legacyStyled";
import { confirmPasswordReset } from "../services/passwordRecoveryService";

const AuthInput = styled.input\`
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.72);
  color: #f8fafc;
  padding: 14px 16px;
  outline: none;

  &::placeholder {
    color: rgba(226, 232, 240, 0.45);
  }

  &:focus {
    border-color: rgba(0, 229, 255, 0.75);
    box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.12);
  }
\`;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tokenFromUrl = useMemo(
    () => searchParams.get("token") || "",
    [searchParams]
  );

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token.trim()) {
      setErrorMessage("Ingresa el token de recuperación.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await confirmPasswordReset({
        token: token.trim(),
        password,
        password_confirm: passwordConfirm,
      });

      setDone(true);

      window.setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo restablecer la contraseña."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen $image={brandAssets.streamView}>
      <AuthCard>
        <BrandBlock>
          <span>ROOTBLEND</span>
          <h1>Restablecer contraseña</h1>
          <p>
            Define una nueva contraseña para recuperar el acceso a tu cuenta.
          </p>
        </BrandBlock>

        {done ? (
          <SuccessBox>
            <FiCheckCircle />
            <div>
              <strong>Contraseña actualizada</strong>
              <Muted>Redirigiendo al inicio de sesión...</Muted>
            </div>
          </SuccessBox>
        ) : null}

        {errorMessage ? (
          <AlertPanel>
            <FiAlertCircle />
            <div>
              <strong>No se pudo restablecer</strong>
              <Muted>{errorMessage}</Muted>
            </div>
          </AlertPanel>
        ) : null}

        <form onSubmit={submit}>
          <FormLine>
            <Label htmlFor="token">Token de recuperación</Label>
            <AuthInput
              id="token"
              name="token"
              type="text"
              autoComplete="one-time-code"
              placeholder="Token recibido por correo"
              value={token}
              onChange={(event) => setToken(event.target.value)}
            />
          </FormLine>

          <FormLine>
            <Label htmlFor="password">Nueva contraseña</Label>
            <AuthInput
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormLine>

          <FormLine>
            <Label htmlFor="password-confirm">Confirmar contraseña</Label>
            <AuthInput
              id="password-confirm"
              name="password_confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
          </FormLine>

          <ButtonRow>
            <PrimaryButton type="submit" disabled={loading || done}>
              <FiKey />
              {loading ? "Actualizando..." : "Restablecer contraseña"}
            </PrimaryButton>

            <GhostLink to="/login">Volver al login</GhostLink>
          </ButtonRow>
        </form>

        <Muted>
          ¿Recuerdas tu contraseña? <Link to="/login">Inicia sesión</Link>
        </Muted>
      </AuthCard>
    </AuthScreen>
  );
}
`
);

console.log("[DONE] Fase 18 completada: ForgotPassword y ResetPassword reales.");
