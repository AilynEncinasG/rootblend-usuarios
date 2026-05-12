import { FiUser } from "react-icons/fi";
import { ChoiceButton, ChoiceGrid, Field, Label, TextArea } from "../../../shared/styles/legacyStyled";
import { FormPanel } from "../../creator/shared/creatorLegacy";
import { ModerationScreen } from "../../system/pages/systemLegacy";
export default function SilenceUserPage() {
  return (
    <ModerationScreen title="Silenciar usuario" subtitle="Impide temporalmente que escriba en el chat.">
      <FormPanel title="Silenciar a un usuario" subtitle="Configura duracion y motivo." button="Silenciar usuario">
        <Label>Usuario</Label><Field><FiUser /><input defaultValue="ToxicUser" /></Field>
        <ChoiceGrid>{["5 min", "10 min", "1 h", "24 h"].map((item, index) => <ChoiceButton type="button" key={item} $active={index === 1}>{item}</ChoiceButton>)}</ChoiceGrid>
        <Label>Motivo</Label><TextArea defaultValue="Lenguaje ofensivo / faltas de respeto" />
      </FormPanel>
    </ModerationScreen>
  );
}
