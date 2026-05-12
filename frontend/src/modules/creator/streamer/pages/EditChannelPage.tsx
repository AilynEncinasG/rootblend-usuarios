import { FiArrowRight, FiUser } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import { Avatar, ChannelHero, Field, Label, TextArea } from "../../../../shared/styles/legacyStyled";
import { CreatorForm } from "../../shared/creatorLegacy";
export default function EditChannelPage() {
  return (
    <CreatorForm title="Editar informacion del canal" subtitle="Ajusta identidad publica, banner y redes sociales." button="Guardar cambios">
      <ChannelHero $image={brandAssets.channelView}><Avatar $large>NP</Avatar><div><h2>NeoPlayer</h2><p>Game. Stream. Repeat.</p></div></ChannelHero>
      <Label>Nombre del canal</Label><Field><FiUser /><input defaultValue="NeoPlayer" /></Field>
      <Label>Biografia</Label><TextArea defaultValue="Streams de juegos, tecnologia y charlas epicas." />
      <Label>URL personalizada</Label><Field><FiArrowRight /><input defaultValue="rootblend/neoplayer" /></Field>
    </CreatorForm>
  );
}
