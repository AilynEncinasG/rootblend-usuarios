import { type FormEvent, useState } from "react";
import { FiAlertTriangle, FiLock, FiPlus, FiShield, FiUser } from "react-icons/fi";
import { AlertPanel, Avatar, ButtonRow, DangerButton, DialogCard, Field, GhostButton, GhostLink, ModeratorToolbar, NotificationRow, Panel, PrimaryButton, ServicePill } from "../../../shared/styles/legacyStyled";
import { getCreatorRole, getModerators, saveModerators } from "../../../shared/utils/rootblendHelpers";
import { EmptyPanel } from "../../public/utils/publicLegacyHelpers";
import { ModerationScreen } from "../../system/pages/systemLegacy";
export default function ModeratorsListPage() {
  const [moderators, setModerators] = useState<string[]>(() => getModerators());
  const [newModerator, setNewModerator] = useState("NeoModerator");
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);
  const ownerMode = getCreatorRole() === "streamer";

  function addModerator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ownerMode) return;
    const cleanName = newModerator.trim();
    if (!cleanName) return;

    const next = Array.from(new Set([...moderators, cleanName]));
    setModerators(next);
    saveModerators(next);
    setNewModerator("");
  }

  function removeModerator(name: string) {
    const next = moderators.filter((moderator) => moderator !== name);
    setModerators(next);
    saveModerators(next);
  }

  return (
    <ModerationScreen title="Lista de moderadores" subtitle="Gestiona los moderadores de tu canal.">
      <Panel>
        {ownerMode ? (
          <ModeratorToolbar onSubmit={addModerator}>
            <Field>
              <FiUser />
              <input
                value={newModerator}
                onChange={(event) => setNewModerator(event.target.value)}
                placeholder="Nombre del usuario"
              />
            </Field>
            <PrimaryButton type="submit"><FiPlus /> Agregar moderador</PrimaryButton>
            <GhostLink to="/moderation/permissions">Ver permisos</GhostLink>
          </ModeratorToolbar>
        ) : (
          <AlertPanel>
            <FiLock />
            <div>
              <strong>Modo moderador</strong>
              <p>Puedes revisar la lista, pero solo el duenio streamer agrega o quita moderadores.</p>
            </div>
            <GhostLink to="/moderation/permissions">Ver permisos</GhostLink>
          </AlertPanel>
        )}

        <AlertPanel>
          <FiShield />
          <div>
            <strong>Moderacion por canal</strong>
            <p>Estos permisos aplican solo al canal Cyberpunk 2077 / PixelNate. Para otro canal, el duenio debe asignarlo de nuevo.</p>
          </div>
        </AlertPanel>

        {moderators.length === 0 ? (
          <EmptyPanel icon={<FiShield />} title="Sin moderadores" text="Agrega usuarios para ayudarte a ordenar el chat." />
        ) : (
          moderators.map((name) => (
            <NotificationRow key={name} $accent="#00e5ff">
              <Avatar>{name.slice(0, 2).toUpperCase()}</Avatar>
              <div>
                <strong>{name}</strong>
                <small>Activo - Canal Cyberpunk 2077</small>
              </div>
              {ownerMode ? (
                <DangerButton type="button" onClick={() => setPendingRemove(name)}>
                  Quitar rol
                </DangerButton>
              ) : (
                <ServicePill $status="Operativo">Activo</ServicePill>
              )}
            </NotificationRow>
          ))
        )}
      </Panel>
      {pendingRemove && (
        <DialogCard>
          <FiAlertTriangle size={34} />
          <h2>Quitar moderador</h2>
          <p>{pendingRemove} perdera permisos de moderacion solo en este canal.</p>
          <ButtonRow>
            <GhostButton type="button" onClick={() => setPendingRemove(null)}>Cancelar</GhostButton>
            <DangerButton
              type="button"
              onClick={() => {
                removeModerator(pendingRemove);
                setPendingRemove(null);
              }}
            >
              Quitar rol
            </DangerButton>
          </ButtonRow>
        </DialogCard>
      )}
    </ModerationScreen>
  );
}
