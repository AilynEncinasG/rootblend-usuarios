import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiSettings, FiLogOut, FiHome } from "react-icons/fi";
import { getCurrentUser, logoutUser } from "../services/userService";
import { getToken } from "../services/authService";

type UserData = {
  usuario?: {
    correo?: string;
  };
  perfil?: {
    nombre_visible?: string;
    biografia?: string | null;
  };
};

const UserMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken();
    const loggedIn = !!token;
    setHasSession(loggedIn);

    if (!loggedIn) {
      setUserData(null);
      return;
    }

    const loadUser = async () => {
      try {
        const result = await getCurrentUser();
        if (result.success) {
          setUserData(result.data || null);
        }
      } catch (error) {
        console.error("Error cargando usuario", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = () => {
    if (!hasSession) {
      navigate("/login");
      return;
    }

    setOpen(!open);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error cerrando sesión", error);
    } finally {
      setOpen(false);
      setHasSession(false);
      setUserData(null);
      navigate("/");
    }
  };

  const nombre =
    userData?.perfil?.nombre_visible ||
    userData?.usuario?.correo?.split("@")[0] ||
    "Usuario";

  const correo = userData?.usuario?.correo || "Sin correo";

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        onClick={handleUserClick}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "none",
          background: "transparent",
          color: "#00f2fe",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
        title={hasSession ? "Abrir menú de usuario" : "Ir a iniciar sesión"}
      >
        <FiUser size={25} style={{ color: "#00f2fe" }} />
      </button>

      {hasSession && open && (
        <div
          style={{
            position: "absolute",
            top: "42px",
            right: 0,
            width: "280px",
            background: "#2b2b35",
            color: "white",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            zIndex: 999,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              marginBottom: "14px",
              paddingBottom: "12px",
              borderBottom: "1px solid #3a3a4a",
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "#f4c95d",
                color: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              {nombre.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>{nombre}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>{correo}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "6px" }}>
            <button onClick={() => navigate("/")} style={menuButtonStyle}>
              <FiHome size={16} /> Inicio
            </button>

            <button
              onClick={() => alert("Perfil próximamente")}
              style={menuButtonStyle}
            >
              <FiUser size={16} /> Perfil
            </button>

            <button
              onClick={() => alert("Configuración próximamente")}
              style={menuButtonStyle}
            >
              <FiSettings size={16} /> Configuración
            </button>

            <button
              onClick={handleLogout}
              style={{ ...menuButtonStyle, color: "#ff7b7b" }}
            >
              <FiLogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const menuButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  padding: "10px 8px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.95rem",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export default UserMenu;