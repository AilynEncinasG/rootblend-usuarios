import { FiFile } from "react-icons/fi";
import { StatePage } from "./systemLegacy";
export default function InvalidFilePage() {
  return <StatePage icon={<FiFile />} title="Archivo no valido" text="El archivo que intentaste subir no cumple con los requisitos." primary="/creator/podcaster/episodes/new" primaryLabel="Entendido" />;
}
