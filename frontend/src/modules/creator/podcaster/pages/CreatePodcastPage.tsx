import { FiMic, FiUpload } from "react-icons/fi";
import { Field, Label, Select, TextArea, UploadZone } from "../../../../shared/styles/legacyStyled";
import { CreatorForm } from "../../shared/creatorLegacy";
export default function CreatePodcastPage() {
  return (
    <CreatorForm title="Crear podcast" subtitle="Configura el nombre, descripcion y portada." button="Crear podcast">
      <Label>Nombre del podcast</Label><Field><FiMic /><input defaultValue="Hablemos de Tecnologia" /></Field>
      <Label>Descripcion</Label><TextArea defaultValue="Podcast de tecnologia, gadgets y futuro." />
      <Label>Categoria</Label><Select defaultValue="Tecnologia"><option>Tecnologia</option><option>Gaming</option><option>Negocios</option></Select>
      <UploadZone><FiUpload /><strong>Arrastra una imagen</strong><small>PNG o JPG</small></UploadZone>
    </CreatorForm>
  );
}
