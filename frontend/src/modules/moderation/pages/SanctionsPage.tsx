import { moderationRows } from "../../../shared/mock/rootblendMock";
import { GhostButton, Panel, Table } from "../../../shared/styles/legacyStyled";
import { ModerationScreen } from "../../system/pages/systemLegacy";
export default function SanctionsPage() {
  return (
    <ModerationScreen title="Usuarios sancionados" subtitle="Silenciados, bloqueados y sanciones activas.">
      <Panel>
        <Table>
          <thead><tr><th>Usuario</th><th>Tipo</th><th>Motivo</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {moderationRows.map((row) => (
              <tr key={row.user}><td>{row.user}</td><td>{row.type}</td><td>{row.reason}</td><td>{row.date}</td><td>{row.status}</td><td><GhostButton type="button">Levantar</GhostButton></td></tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    </ModerationScreen>
  );
}
