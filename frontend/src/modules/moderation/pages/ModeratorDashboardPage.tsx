import { FiLock, FiShield, FiTrash2, FiUsers, FiVolume2, FiXCircle } from "react-icons/fi";
import { DangerLink, GhostLink, MetricGrid, PrimaryLink, QuickActions } from "../../../shared/styles/legacyStyled";
import { ChatPanel, StatCard } from "../../public/utils/publicLegacyHelpers";
import { ModerationScreen } from "../../system/pages/systemLegacy";
export default function ModeratorDashboardPage() {
  return (
    <ModerationScreen title="Panel del moderador" subtitle="Acciones rapidas, incidentes recientes y salud del chat.">
      <QuickActions>
        <PrimaryLink to="/moderation/delete-message"><FiTrash2 /> Eliminar mensaje</PrimaryLink>
        <GhostLink to="/moderation/silence"><FiVolume2 /> Silenciar usuario</GhostLink>
        <DangerLink to="/moderation/block"><FiXCircle /> Bloquear usuario</DangerLink>
        <GhostLink to="/moderation/moderators"><FiUsers /> Moderadores</GhostLink>
        <GhostLink to="/moderation/sanctions"><FiShield /> Sanciones</GhostLink>
        <GhostLink to="/moderation/permissions"><FiLock /> Permisos</GhostLink>
      </QuickActions>
      <MetricGrid>
        <StatCard label="Mensajes reportados" value="12" trend="Ultimas 24h" />
        <StatCard label="Usuarios silenciados" value="7" trend="Actualmente" />
        <StatCard label="Bloqueados" value="3" trend="Total" />
      </MetricGrid>
      <ChatPanel />
    </ModerationScreen>
  );
}
