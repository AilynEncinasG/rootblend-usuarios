import { FiRadio } from "react-icons/fi";
import { Field, Label, MetaTag, Select, TagRow, TextArea } from "../../../../shared/styles/legacyStyled";
import { CreatorForm } from "../../shared/creatorLegacy";
export default function CreateStreamPage() {
  return (
    <CreatorForm title="Crear / configurar stream" subtitle="Define titulo, categoria, etiquetas y calidad." button="Guardar configuracion">
      <Label>Titulo del stream</Label><Field><FiRadio /><input defaultValue="Rankeando en Valorant con la squad" /></Field>
      <Label>Categoria</Label><Select defaultValue="VALORANT"><option>VALORANT</option><option>Just Chatting</option><option>Musica</option></Select>
      <Label>Etiquetas</Label><TagRow><MetaTag>FPS</MetaTag><MetaTag>Competitivo</MetaTag><MetaTag>Espanol</MetaTag></TagRow>
      <Label>Descripcion</Label><TextArea defaultValue="Directo competitivo rankeando y pasando un buen rato con la comunidad." />
      <Label>Calidad</Label><Select defaultValue="1080p"><option>1080p recomendado</option><option>720p</option></Select>
    </CreatorForm>
  );
}
