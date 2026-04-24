import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiChevronRight } from "react-icons/fi";
import { Card, InputGroup, Input, Button } from "../../styles/GlobalStyles";
import { loginUser, saveAuthSession } from "../../services/authService";

export const LoginForm = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!correo.trim() || !password.trim()) {
      setError("Completa correo y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(correo, password);

      if (!result.success) {
        setError(result.message || "No se pudo iniciar sesión.");
        return;
      }

      if (!result.data?.access_token || !result.data?.refresh_token) {
        setError("No llegaron los tokens desde el servidor.");
        return;
      }

      saveAuthSession(result.data);
      navigate("/");
    } catch {
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
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "CARGANDO..." : "ENTRAR"} <FiChevronRight />
      </Button>
    </Card>
  );
};