import { StatePage } from "./systemLegacy";
export default function NotFoundPage() {
  return <StatePage icon={<strong>404</strong>} title="Pagina no encontrada" text="La pagina que buscas no existe o fue movida." primary="/" primaryLabel="Volver al inicio" secondary="/streams" secondaryLabel="Explorar contenido" />;
}
