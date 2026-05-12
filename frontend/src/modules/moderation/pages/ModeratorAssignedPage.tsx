import { FiCheckCircle } from "react-icons/fi";
import { StatePage } from "../../system/pages/systemLegacy";
export default function ModeratorAssignedPage() {
  return <StatePage icon={<FiCheckCircle />} title="Moderador asignado" text="GamerX ahora puede ayudarte a gestionar el chat en vivo." primary="/moderation/moderators" primaryLabel="Ver moderadores" />;
}
