import { FiAlertTriangle } from "react-icons/fi";
import { ButtonRow, DangerButton, DangerIcon, DialogCard, GhostLink } from "../../../shared/styles/legacyStyled";
import { ModerationScreen } from "../../system/pages/systemLegacy";
export default function BlockUserPage() {
  return (
    <ModerationScreen title="Bloquear usuario del chat" subtitle="Bloqueo permanente para usuarios toxicos.">
      <DialogCard>
        <DangerIcon><FiAlertTriangle /></DangerIcon>
        <h2>¿Bloquear a este usuario?</h2>
        <p>El usuario no podra escribir en el chat ni ver ciertas acciones del canal.</p>
        <ButtonRow><GhostLink to="/moderation">Cancelar</GhostLink><DangerButton type="button">Bloquear usuario</DangerButton></ButtonRow>
      </DialogCard>
    </ModerationScreen>
  );
}
