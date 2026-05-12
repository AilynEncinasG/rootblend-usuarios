import { FiSearch } from "react-icons/fi";
import { StatePage } from "./systemLegacy";
export default function EmptySearchPage() {
  return <StatePage icon={<FiSearch />} title="No encontramos resultados" text="Intenta con otras palabras clave o limpia los filtros." primary="/streams" primaryLabel="Limpiar busqueda" />;
}
