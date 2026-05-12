import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiLogOut } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { Avatar, DangerButton, MenuLine, NarrowPanel, ProfileHeader } from "../../../shared/styles/legacyStyled";
import { clearAuthStorage } from "../../auth/utils/authStorage";

export default function UserMenuPage() {
  const navigate = useNavigate();

  return (
    <RootShell active="home">
      <NarrowPanel>
        <ProfileHeader>
          <Avatar $large>U</Avatar>
          <div>
            <h1>usuario_123</h1>
            <p>Ver mi perfil</p>
          </div>
        </ProfileHeader>
        {[
          ["Mi canal", "/channels/cyberpunk-2077"],
          ["Panel de creador", "/creator/dashboard"],
          ["Estadisticas", "/creator/streamer/stats"],
          ["Configuracion", "/settings"],
          ["Notificaciones", "/notifications"],
          ["Idioma: Espanol", "/settings"],
        ].map(([label, to]) => (
          <MenuLine key={label} to={to}>{label}<FiArrowRight /></MenuLine>
        ))}
        <DangerButton type="button" onClick={() => { clearAuthStorage(); navigate("/"); }}>
          <FiLogOut /> Cerrar sesion
        </DangerButton>
      </NarrowPanel>
    </RootShell>
  );
}
