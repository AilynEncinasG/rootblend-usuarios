import { useState } from "react";
import { Link } from "react-router-dom";
import { RootShell } from "../../../shared/layout";
import { streams } from "../../../shared/mock/rootblendMock";
import { Avatar, ButtonRow, Eyebrow, GhostButton, GhostLink, NotificationRow, PageHeading, Panel, PanelHeader } from "../../../shared/styles/legacyStyled";

export default function FollowingPage() {
  const [items, setItems] = useState(() => streams.slice(0, 6));

  return (
    <RootShell active="home">
      <PageHeading><Eyebrow>Comunidad</Eyebrow><h1>Canales seguidos</h1><p>Vista separada para administrar solo los canales que sigues.</p></PageHeading>
      <Panel>
        <PanelHeader><strong>Siguiendo ahora</strong><Link to="/subscriptions">Ver suscripciones</Link></PanelHeader>
        {items.map((stream) => (
          <NotificationRow key={stream.id} $accent="#00e5ff">
            <Avatar>{stream.avatar}</Avatar>
            <div><strong>{stream.channel}</strong><small>{stream.category} - {stream.viewers} espectadores</small></div>
            <ButtonRow>
              <GhostLink to={`/channels/${stream.id}`}>Ver canal</GhostLink>
              <GhostButton type="button" onClick={() => setItems((current) => current.filter((item) => item.id !== stream.id))}>
                Dejar de seguir
              </GhostButton>
            </ButtonRow>
          </NotificationRow>
        ))}
      </Panel>
    </RootShell>
  );
}
