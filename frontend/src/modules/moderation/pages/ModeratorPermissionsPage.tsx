import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { InfoGrid, Panel, PanelHeader, PermissionLine } from "../../../shared/styles/legacyStyled";
import { ModerationScreen } from "../../system/pages/systemLegacy";
export default function ModeratorPermissionsPage() {
  return (
    <ModerationScreen title="Permisos y funciones del moderador" subtitle="Resumen claro de lo que puede y no puede hacer.">
      <InfoGrid>
        <Panel><PanelHeader><strong>Lo que si pueden hacer</strong></PanelHeader>{["Eliminar mensajes inapropiados", "Silenciar usuarios", "Bloquear usuarios toxicos", "Gestionar orden del chat"].map((item) => <PermissionLine key={item}><FiCheckCircle /> {item}</PermissionLine>)}</Panel>
        <Panel><PanelHeader><strong>Lo que no pueden hacer</strong></PanelHeader>{["Iniciar directos", "Finalizar directos", "Editar canal", "Ver estadisticas privadas", "Administrar podcast", "Cambiar propietario"].map((item) => <PermissionLine key={item}><FiXCircle /> {item}</PermissionLine>)}</Panel>
      </InfoGrid>
    </ModerationScreen>
  );
}
