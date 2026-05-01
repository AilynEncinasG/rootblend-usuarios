import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Screen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(0, 229, 255, 0.18), transparent 34%),
    radial-gradient(circle at bottom right, rgba(0, 255, 153, 0.14), transparent 34%),
    #101018;
`;

const Card = styled.form`
  width: min(440px, 100%);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 28px;
  border-radius: 22px;
  color: white;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
  }

  p {
    margin: 0 0 22px;
    color: rgba(255, 255, 255, 0.68);
    line-height: 1.5;
  }

  label {
    display: block;
    margin: 14px 0 7px;
    font-size: 13px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.82);
  }

  input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(0, 0, 0, 0.2);
    color: white;
    border-radius: 14px;
    padding: 13px 14px;
    outline: none;
  }

  button {
    width: 100%;
    border: 0;
    border-radius: 999px;
    padding: 13px 16px;
    margin-top: 20px;
    font-weight: 900;
    cursor: pointer;
    color: #071016;
    background: linear-gradient(135deg, #00e5ff, #00ff99);
  }

  a {
    color: #00e5ff;
    text-decoration: none;
    font-weight: 800;
  }
`;

const ErrorText = styled.div`
  color: #ff7b85;
  font-size: 13px;
  margin-top: 10px;
`;

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("12345678");
  const [confirmPassword, setConfirmPassword] = useState("12345678");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    navigate("/login", { replace: true });
  }

  return (
    <Screen>
      <Card onSubmit={handleSubmit}>
        <h1>Nueva contraseña</h1>

        <p>
          Define una nueva contraseña para recuperar el acceso a tu cuenta.
          Esta pantalla queda lista para conectar luego con el token real del backend.
        </p>

        <label>Nueva contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <label>Confirmar contraseña</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <button type="submit">Guardar nueva contraseña</button>

        <p style={{ marginTop: 18 }}>
          ¿Ya tienes acceso? <Link to="/login">Iniciar sesión</Link>
        </p>
      </Card>
    </Screen>
  );
}