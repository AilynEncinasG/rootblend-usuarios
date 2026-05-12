import { FiFile, FiHeadphones, FiUpload } from "react-icons/fi";
import { Field, Label, TextArea, UploadZone } from "../../../../shared/styles/legacyStyled";
import { CreatorForm } from "../../shared/creatorLegacy";
export default function UploadEpisodePage() {
  return (
    <CreatorForm title="Subir episodio" subtitle="Carga el audio, completa metadatos y publica." button="Publicar episodio">
      <UploadZone><FiUpload /><strong>Arrastra tu archivo de audio aqui</strong><small>MP3, WAV, M4A</small></UploadZone>
      <Label>Titulo del episodio</Label><Field><FiHeadphones /><input defaultValue="El impacto de la IA en 2026" /></Field>
      <Label>Descripcion</Label><TextArea defaultValue="Descripcion breve del episodio." />
      <Label>Numero de episodio</Label><Field><FiFile /><input defaultValue="25" /></Field>
    </CreatorForm>
  );
}
