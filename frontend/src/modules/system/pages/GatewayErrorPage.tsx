import { FiWifiOff } from "react-icons/fi";
import { StatePage } from "./systemLegacy";
export default function GatewayErrorPage() {
  return <StatePage icon={<FiWifiOff />} title="Ups! Algo salio mal" text="No pudimos conectar con el servicio en este momento. Codigo de error: 502 Bad Gateway." primary="/partial-unavailable" primaryLabel="Intentar de nuevo" secondary="/" secondaryLabel="Ir al inicio" />;
}
