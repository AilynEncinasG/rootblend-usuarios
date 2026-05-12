import { FiBell } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { notifications } from "../../../shared/mock/rootblendMock";
import { Eyebrow, GhostButton, InfoGrid, NotificationRow, PageHeading, Panel, PanelHeader, ToggleLine } from "../../../shared/styles/legacyStyled";
export default function InteractionsPage() {
  return (
    <RootShell active="home">
      <PageHeading><Eyebrow>Comunidad</Eyebrow><h1>Centro de interacciones</h1><p>Seguimientos, suscripciones, menciones, comentarios y directos.</p></PageHeading>
      <InfoGrid>
        <Panel><PanelHeader><strong>Hoy</strong></PanelHeader>{notifications.map((item) => <NotificationRow key={item.title} $accent={item.accent}><FiBell /><div><strong>{item.title}</strong><small>{item.meta}</small></div><GhostButton type="button">Ver</GhostButton></NotificationRow>)}</Panel>
        <Panel><PanelHeader><strong>Configuracion rapida</strong></PanelHeader>{["Nuevos seguidores", "Nuevas suscripciones", "Comentarios", "Menciones", "Inicio de directos"].map((item) => <ToggleLine key={item}><span>{item}</span><input type="checkbox" defaultChecked /></ToggleLine>)}</Panel>
      </InfoGrid>
    </RootShell>
  );
}
