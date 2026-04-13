import { useEffect, useState } from "react";
import { DashboardLayout, StyledSidebar } from "../styles/GlobalStyles";
import { Navbar } from "../components/dashboard/Navbar";
import { getPreferences, updatePreferences } from "../services/userService";

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

const SettingsPage = () => {
  const [idioma, setIdioma] = useState("es");
  const [tema, setTema] = useState("claro");
  const [autoplay, setAutoplay] = useState(true);
  const [recibirNotificaciones, setRecibirNotificaciones] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const result = await getPreferences();

        if (!result.success) {
          setError(result.message || "No se pudieron cargar las preferencias.");
          return;
        }

        const prefs = result.data?.preferencias;

        setIdioma(prefs?.idioma || "es");
        setTema(prefs?.tema || "claro");
        setAutoplay(Boolean(prefs?.autoplay));
        setRecibirNotificaciones(Boolean(prefs?.recibir_notificaciones));
      } catch {
        setError("Error cargando preferencias.");
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const result = await updatePreferences({
        idioma,
        tema,
        autoplay,
        recibir_notificaciones: recibirNotificaciones,
      });

      if (!result.success) {
        setError(result.message || "No se pudieron actualizar las preferencias.");
        return;
      }

      setMessage("Preferencias actualizadas correctamente.");
    } catch {
      setError("Error actualizando preferencias.");
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
          <h1 style={{ marginBottom: "20px" }}>Configuración</h1>

          {loading ? (
            <p>Cargando preferencias...</p>
          ) : (
            <>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>Idioma</label>
                <select value={idioma} onChange={(e) => setIdioma(e.target.value)} style={inputStyle}>
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>Tema</label>
                <select value={tema} onChange={(e) => setTema(e.target.value)} style={inputStyle}>
                  <option value="claro">Claro</option>
                  <option value="oscuro">Oscuro</option>
                </select>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => setAutoplay(e.target.checked)}
                  />
                  Activar autoplay
                </label>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={recibirNotificaciones}
                    onChange={(e) => setRecibirNotificaciones(e.target.checked)}
                  />
                  Recibir notificaciones
                </label>
              </div>

              {error && <p style={{ color: "#ff7b7b", marginBottom: "12px" }}>{error}</p>}
              {message && <p style={{ color: "#04ff58", marginBottom: "12px" }}>{message}</p>}

              <button onClick={handleSave} disabled={saving} style={buttonStyle}>
                {saving ? "Guardando..." : "Guardar preferencias"}
              </button>
            </>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default SettingsPage;