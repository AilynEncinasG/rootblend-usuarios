import { FiTrash2 } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import { ButtonRow, DangerButton, DangerIcon, DialogCard, GhostLink } from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
export default function DeleteEpisodePage() {
  return (
    <CreatorScreen title="Eliminar episodio" subtitle="Confirma antes de eliminar un contenido publicado." image={brandAssets.podcasterPanel}>
      <DialogCard>
        <DangerIcon><FiTrash2 /></DangerIcon>
        <h2>¿Eliminar este episodio?</h2>
        <p>Esta accion no se puede deshacer.</p>
        <ButtonRow><GhostLink to="/creator/podcaster/episodes">Cancelar</GhostLink><DangerButton type="button">Eliminar</DangerButton></ButtonRow>
      </DialogCard>
    </CreatorScreen>
  );
}
