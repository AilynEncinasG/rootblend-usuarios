import { useEffect, useState } from "react";
import { DashboardLayout, StyledNavbar, StyledSidebar } from "../styles/GlobalStyles";
import { Navbar } from "../components/dashboard/Navbar";
import { getCurrentUser, updateProfile } from "../services/userService";

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

const labelStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  marginBottom: "8px",
  display: "block",
  fontWeight: 600,
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

const ProfilePage = () => {
  const [correo, setCorreo] = useState("");
  const [nombreVisible, setNombreVisible] = useState("");
  const [biografia, setBiografia] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const result = await getCurrentUser();

        if (!result.success) {
          setError(result.message || "No se pudo cargar el perfil.");
          return;
        }

        const usuario = result.data?.usuario;
        const perfil = result.data?.perfil;

        setCorreo(usuario?.correo || "");
        setNombreVisible(perfil?.nombre_visible || "");
        setBiografia(perfil?.biografia || "");
        setFechaNacimiento(perfil?.fecha_nacimiento || "");
      } catch {
        setError("Error cargando datos del perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const result = await updateProfile({
        nombre_visible: nombreVisible,
        biografia: biografia,
        fecha_nacimiento: fechaNacimiento,
      });

      if (!result.success) {
        setError(result.message || "No se pudo actualizar el perfil.");
        return;
      }

      setMessage("Perfil actualizado correctamente.");
    } catch {
      setError("Error actualizando perfil.");
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
          <h1 style={{ marginBottom: "20px" }}>Mi perfil</h1>

          {loading ? (
            <p>Cargando perfil...</p>
          ) : (
            <>
              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Correo</label>
                <input value={correo} disabled style={{ ...inputStyle, opacity: 0.7 }} />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Nombre visible</label>
                <input
                  value={nombreVisible}
                  onChange={(e) => setNombreVisible(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Biografía</label>
                <textarea
                  value={biografia}
                  onChange={(e) => setBiografia(e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Fecha de nacimiento</label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {error && <p style={{ color: "#ff7b7b", marginBottom: "12px" }}>{error}</p>}
              {message && <p style={{ color: "#04ff58", marginBottom: "12px" }}>{message}</p>}

              <button onClick={handleSave} disabled={saving} style={buttonStyle}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default ProfilePage;