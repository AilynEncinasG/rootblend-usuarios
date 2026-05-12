import { FiTrash2 } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { ButtonRow, DangerButton, DangerIcon, DialogCard, GhostLink } from "../../../shared/styles/legacyStyled";
export default function ConfirmDeletePage() {
  return (
    <RootShell active="system">
      <DialogCard>
        <DangerIcon><FiTrash2 /></DangerIcon>
        <h2>¿Eliminar este contenido?</h2>
        <p>Esta accion se puede usar para episodios, clips o mensajes.</p>
        <ButtonRow><GhostLink to="/">Cancelar</GhostLink><DangerButton type="button">Eliminar</DangerButton></ButtonRow>
      </DialogCard>
    </RootShell>
  );
}
