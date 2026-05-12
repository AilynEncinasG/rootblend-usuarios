import { FiShield } from "react-icons/fi";
import { ButtonRow, DialogCard, GhostLink, PrimaryLink } from "../../../shared/styles/legacyStyled";
import { ChatPanel } from "../../public/utils/publicLegacyHelpers";
import { ModerationScreen } from "../../system/pages/systemLegacy";
export default function AssignModeratorPage() {
  return (
    <ModerationScreen title="Asignar moderador desde el chat" subtitle="Selecciona un usuario del chat y confirma permisos.">
      <ChatPanel />
      <DialogCard>
        <FiShield size={38} />
        <h2>¿Hacer moderador a este usuario?</h2>
        <p>GamerX podra eliminar mensajes, silenciar usuarios y mantener el orden.</p>
        <ButtonRow><GhostLink to="/moderation">Cancelar</GhostLink><PrimaryLink to="/moderation/assign/confirm">Confirmar</PrimaryLink></ButtonRow>
      </DialogCard>
    </ModerationScreen>
  );
}
