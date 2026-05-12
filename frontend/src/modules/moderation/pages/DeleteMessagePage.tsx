import { FiCheckCircle } from "react-icons/fi";
import { AlertPanel } from "../../../shared/styles/legacyStyled";
import { ChatPanel } from "../../public/utils/publicLegacyHelpers";
import { ModerationScreen } from "../../system/pages/systemLegacy";
export default function DeleteMessagePage() {
  return (
    <ModerationScreen title="Eliminar mensaje" subtitle="Accion rapida para limpiar el chat sin tumbar el stream.">
      <ChatPanel />
      <AlertPanel><FiCheckCircle /><div><strong>Mensaje eliminado</strong><p>El mensaje se oculto del chat.</p></div></AlertPanel>
    </ModerationScreen>
  );
}
