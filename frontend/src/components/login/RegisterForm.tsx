import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiUserPlus } from "react-icons/fi";
import { Card, InputGroup, Input, Button } from "../../styles/GlobalStyles";
import { registerUser } from "../../services/authService";

export const RegisterForm = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!correo.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser(correo, password);

      if (!result.success) {
        setError(result.message || "No se pudo registrar.");
        return;
      }

      setSuccess("Registro exitoso. Redirigiendo al login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <InputGroup>
        <FiUser style={{ position: "absolute", left: 15, top: 18, color: "#00f2fe" }} />
        <Input
          type="text"
          placeholder="Email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </InputGroup>

      <InputGroup>
        <FiLock style={{ position: "absolute", left: 15, top: 18, color: "#00f2fe" }} />
        <Input
          type="password"
          placeholder="Crear contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputGroup>

      <InputGroup>
        <FiLock style={{ position: "absolute", left: 15, top: 18, color: "#00f2fe" }} />
        <Input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </InputGroup>

      {error && (
        <p style={{ color: "#ff6b6b", marginBottom: "15px", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "#04ff58", marginBottom: "15px", fontSize: "0.9rem" }}>
          {success}
        </p>
      )}

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "CARGANDO..." : "REGISTRARSE"} <FiUserPlus />
      </Button>
    </Card>
  );
};