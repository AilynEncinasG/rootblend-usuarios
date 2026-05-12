import { useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { streams, type StreamItem } from "../../../shared/mock/rootblendMock";
import { Avatar, ButtonRow, DangerButton, DialogCard, Eyebrow, GhostButton, GhostLink, NotificationRow, PageHeading, Panel, PanelHeader } from "../../../shared/styles/legacyStyled";

export default function SubscriptionsPage() {
  const [items, setItems] = useState(() => streams.slice(1, 4));
  const [pendingCancel, setPendingCancel] = useState<StreamItem | null>(null);

  return (
    <RootShell active="home">
      <PageHeading><Eyebrow>Comunidad</Eyebrow><h1>Suscripciones</h1><p>Administra los canales suscritos, beneficios y cancelaciones.</p></PageHeading>
      <Panel>
        <PanelHeader><strong>Canales suscritos</strong><Link to="/following">Ver seguidos</Link></PanelHeader>
        {items.map((stream) => (
          <NotificationRow key={stream.id} $accent="#a855f7">
            <Avatar>{stream.avatar}</Avatar>
            <div>
              <strong>{stream.channel}</strong>
              <small>Plan comunidad - vence el 30/06/2026</small>
            </div>
            <ButtonRow>
              <GhostLink to={`/channels/${stream.id}`}>Ver canal</GhostLink>
              <DangerButton type="button" onClick={() => setPendingCancel(stream)}>Cancelar</DangerButton>
            </ButtonRow>
          </NotificationRow>
        ))}
      </Panel>
      {pendingCancel && (
        <DialogCard>
          <FiAlertTriangle size={34} />
          <h2>Cancelar suscripcion</h2>
          <p>Se cancelara la suscripcion a {pendingCancel.channel}. El acceso se conserva hasta el vencimiento.</p>
          <ButtonRow>
            <GhostButton type="button" onClick={() => setPendingCancel(null)}>Volver</GhostButton>
            <DangerButton
              type="button"
              onClick={() => {
                setItems((current) => current.filter((stream) => stream.id !== pendingCancel.id));
                setPendingCancel(null);
              }}
            >
              Confirmar
            </DangerButton>
          </ButtonRow>
        </DialogCard>
      )}
    </RootShell>
  );
}
