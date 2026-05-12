import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiMic, FiRadio } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { CREATOR_ROLE_KEY, getCreatorRole, setCreatorRole, type CreatorRole } from "../../../shared/utils/rootblendHelpers";
import { AlertPanel, ChoiceButton, ChoiceGrid, Field, GhostButton, Label, PrimaryLink, ProgressSteps, TextArea } from "../../../shared/styles/legacyStyled";
import { FormPanel } from "./creatorLegacy";
export default function CreatorActivatePage() {
  const navigate = useNavigate();
  const existingRole = getCreatorRole();
  const [role, setRole] = useState<CreatorRole>(existingRole || "streamer");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (existingRole) {
      navigate(existingRole === "streamer" ? "/creator/streamer" : "/creator/podcaster");
      return;
    }

    setCreatorRole(role);
    navigate(role === "streamer" ? "/creator/streamer" : "/creator/podcaster");
  }

  function resetDemoRole() {
    localStorage.removeItem(CREATOR_ROLE_KEY);
    window.dispatchEvent(new Event("creator-role-changed"));
    setRole("streamer");
  }

  return (
    <RootShell active="creator">
      {existingRole && (
        <AlertPanel>
          <FiLock />
          <div>
            <strong>Ya tienes un canal activo como {existingRole}</strong>
            <p>Una cuenta solo puede ser streamer o podcaster. El panel contrario se redirige al rol activo.</p>
          </div>
          <PrimaryLink to={existingRole === "streamer" ? "/creator/streamer" : "/creator/podcaster"}>
            Ir a mi panel
          </PrimaryLink>
          <GhostButton type="button" onClick={resetDemoRole}>Cambiar seleccion</GhostButton>
        </AlertPanel>
      )}
      <FormPanel
        title="Activa tu canal de creador"
        subtitle="Escoge un solo tipo de canal: streamer o podcaster."
        button={existingRole ? "Ir al panel activo" : "Continuar"}
        onSubmit={submit}
      >
        <ProgressSteps><span>Informacion</span><span>Tipo de canal</span><span>Listo</span></ProgressSteps>
        <Label>Nombre del canal</Label><Field><FiRadio /><input defaultValue="NeoPlayer" disabled={Boolean(existingRole)} /></Field>
        <Label>URL personalizada</Label><Field><FiLinkIcon /> <input defaultValue="rootblend/neoplayer" disabled={Boolean(existingRole)} /></Field>
        <Label>Descripcion del canal</Label><TextArea defaultValue="Streams de juegos, tecnologia y charlas epicas." disabled={Boolean(existingRole)} />
        <ChoiceGrid>
          <ChoiceButton type="button" $active={role === "streamer"} disabled={Boolean(existingRole)} onClick={() => setRole("streamer")}><FiRadio /> Streamer</ChoiceButton>
          <ChoiceButton type="button" $active={role === "podcaster"} disabled={Boolean(existingRole)} onClick={() => setRole("podcaster")}><FiMic /> Podcaster</ChoiceButton>
        </ChoiceGrid>
      </FormPanel>
    </RootShell>
  );
}

function FiLinkIcon() {
  return <FiArrowRight />;
}
