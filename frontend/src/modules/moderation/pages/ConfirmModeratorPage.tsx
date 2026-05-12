import { FiShield } from "react-icons/fi";
import { StatePage } from "../../system/pages/systemLegacy";
export default function ConfirmModeratorPage() {
  return <StatePage icon={<FiShield />} title="Confirmacion de asignacion" text="El usuario recibira permisos de moderador solo para este canal." primary="/moderation/assigned" primaryLabel="Confirmar" />;
}
