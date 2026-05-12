import { FiBell } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { notifications } from "../../../shared/mock/rootblendMock";
import { Eyebrow, NotificationRow, PageHeading, Panel } from "../../../shared/styles/legacyStyled";

export default function NotificationsPage() {
  return (
    <RootShell active="home">
      <PageHeading><Eyebrow>Centro personal</Eyebrow><h1>Notificaciones</h1><p>Todo lo que pasa en tus canales seguidos.</p></PageHeading>
      <Panel>
        {notifications.map((item) => (
          <NotificationRow key={item.title} $accent={item.accent}>
            <FiBell />
            <div><strong>{item.title}</strong><small>{item.meta}</small></div>
            <span />
          </NotificationRow>
        ))}
      </Panel>
    </RootShell>
  );
}
