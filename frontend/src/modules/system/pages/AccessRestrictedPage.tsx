import { FiLock } from "react-icons/fi";
import { StatePage } from "./systemLegacy";
export default function AccessRestrictedPage() {
  return <StatePage icon={<FiLock />} title="Acceso restringido" text="No tienes permisos para acceder a esta seccion. Debes ser creador o moderador." primary="/" primaryLabel="Ir al inicio" secondary="/creator/activate" secondaryLabel="Activar canal" />;
}
