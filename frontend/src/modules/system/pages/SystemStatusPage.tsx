import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { serviceStatuses } from "../../../shared/mock/rootblendMock";
import { ButtonRow, Eyebrow, GhostButton, MetricGrid, PageHeading, Panel, PrimaryLink, ServicePill, ServiceRow } from "../../../shared/styles/legacyStyled";
import { StatCard } from "../../public/utils/publicLegacyHelpers";
export default function SystemStatusPage() {
  return (
    <RootShell active="system">
      <PageHeading><Eyebrow>Demo distribuida</Eyebrow><h1>Estado de los servicios</h1><p>Panel visual para demostrar resiliencia cuando un servicio cae.</p></PageHeading>
      <MetricGrid>
        <StatCard label="Servicios totales" value="8" trend="Monitoreados" />
        <StatCard label="Operativos" value="7" trend="OK" />
        <StatCard label="Degradados" value="1" trend="Parcial" />
        <StatCard label="Caidos" value="0" trend="Criticos" />
      </MetricGrid>
      <Panel>
        {serviceStatuses.map((service) => (
          <ServiceRow key={service.name}>
            <span>{service.name}</span>
            <small>{service.type}</small>
            <ServicePill $status={service.status}>{service.status}</ServicePill>
            <small>{service.latency}</small>
            <small>{service.lastCheck}</small>
          </ServiceRow>
        ))}
      </Panel>
      <ButtonRow><PrimaryLink to="/partial-unavailable"><FiAlertTriangle /> Simular servicio caido</PrimaryLink><GhostButton type="button"><FiRefreshCw /> Actualizar</GhostButton></ButtonRow>
    </RootShell>
  );
}
