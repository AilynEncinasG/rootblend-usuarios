import { useState } from "react";
import { DashboardLayout, StyledSidebar } from "../styles/GlobalStyles";
import { Navbar } from "../components/dashboard/Navbar";
import { changePassword } from "../services/userService";

const boxStyle: React.CSSProperties = {
  background: "#171722",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "24px",
  maxWidth: "700px",
  width: "100%",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#0f0f17",
  color: "white",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "10px",
  background: "#00f2fe",
  color: "#000",
  fontWeight: 700,
  cursor: "pointer",
};

const ChangePasswordPage = () => {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmPasswordNueva, setConfirmPasswordNueva] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    setMessage("");

    if (!passwordActual || !passwordNueva || !confirmPasswordNueva) {
      setError("Completa todos los campos.");
      return;
    }

    if (passwordNueva !== confirmPasswordNueva) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      setSaving(true);

      const result = await changePassword({
        password_actual: passwordActual,
        password_nueva: passwordNueva,
      });

      if (!result.success) {
        setError(result.message || "No se pudo cambiar la contraseña.");
        return;
      }

      setMessage("Contraseña actualizada correctamente.");
      setPasswordActual("");
      setPasswordNueva("");
      setConfirmPasswordNueva("");
    } catch {
      setError("Error cambiando contraseña.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Navbar />
      <StyledSidebar />
      <main style={{ gridArea: "main", padding: "30px", overflowY: "auto" }}>
        <div style={boxStyle}>
          <h1 style={{ marginBottom: "20px" }}>Cambiar contraseña</h1>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>Contraseña actual</label>
            <input
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>Nueva contraseña</label>
            <input
              type="password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmPasswordNueva}
              onChange={(e) => setConfirmPasswordNueva(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && <p style={{ color: "#ff7b7b", marginBottom: "12px" }}>{error}</p>}
          {message && <p style={{ color: "#04ff58", marginBottom: "12px" }}>{message}</p>}

          <button onClick={handleSave} disabled={saving} style={buttonStyle}>
            {saving ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default ChangePasswordPage;