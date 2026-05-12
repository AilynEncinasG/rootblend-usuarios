import { FiRadio } from "react-icons/fi";
import { StatePage } from "./systemLegacy";
export default function NoStreamsPage() {
  return <StatePage icon={<FiRadio />} title="No hay streams en vivo" text="Parece que todos estan descansando. Vuelve mas tarde o explora podcasts." primary="/categories" primaryLabel="Explorar categorias" />;
}
