import { type FormEvent, type ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEdit3,
  FiSave,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { getCreatorRole } from "../../../shared/utils/rootblendHelpers";
import {
  Avatar,
  ButtonRow,
  ChannelHero,
  CreatorLayout,
  CreatorMain,
  CreatorSidebar,
  DangerButton,
  Eyebrow,
  Field,
  FormCard,
  GhostLink,
  Label,
  PageHeading,
  PrimaryButton,
  SidebarLink,
  SuccessBox,
  TextArea,
  UploadZone,
} from "../../../shared/styles/legacyStyled";

export function CreatorScreen({
  title,
  subtitle,
  image,
  children,
}: {
  title: string;
  subtitle: string;
  image: string;
  children: ReactNode;
}) {
  return (
    <RootShell active="creator">
      <CreatorLayout>
        <CreatorNav />
        <CreatorMain>
          <ChannelHero $image={image}><Avatar $large>RB</Avatar><div><Eyebrow>ROOTBLEND Creator</Eyebrow><h1>{title}</h1><p>{subtitle}</p></div></ChannelHero>
          {children}
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}

export function CreatorForm({
  title,
  subtitle,
  button,
  children,
  onSubmit,
}: {
  title: string;
  subtitle: string;
  button: string;
  children: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <RootShell active="creator">
      <FormPanel title={title} subtitle={subtitle} button={button} onSubmit={onSubmit}>{children}</FormPanel>
    </RootShell>
  );
}

export function CreatorNav() {
  const location = useLocation();
  const role = getCreatorRole();
  const isPodcasterArea = location.pathname.startsWith("/creator/podcaster") || role === "podcaster";

  const links = isPodcasterArea
    ? [
        ["/creator/podcaster", "Podcaster"],
        ["/creator/podcaster/episodes", "Episodios"],
        ["/creator/podcaster/stats", "Estadisticas"],
      ]
    : [
        ["/creator/streamer", "Streamer"],
        ["/creator/streamer/control", "Control"],
        ["/creator/streamer/stats", "Estadisticas"],
        ["/creator/streamer/highlights", "Momentos"],
        ["/moderation", "Moderacion"],
      ];

  return (
    <CreatorSidebar>
      {links.map(([to, label]) => (
        <SidebarLink key={to} to={to}>
          <FiArrowRight />
          <span>{label}</span>
        </SidebarLink>
      ))}
    </CreatorSidebar>
  );
}

export function FormPanel({
  title,
  subtitle,
  button,
  children,
  onSubmit,
}: {
  title: string;
  subtitle: string;
  button: string;
  children: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(event);
    setSaved(true);
  }

  return (
    <FormCard onSubmit={submit}>
      <PageHeading><Eyebrow>Formulario</Eyebrow><h1>{title}</h1><p>{subtitle}</p></PageHeading>
      {children}
      {saved && <SuccessBox><FiCheckCircle /> Cambios guardados en el mock frontend.</SuccessBox>}
      <ButtonRow><GhostLink to="/">Cancelar</GhostLink><PrimaryButton type="submit"><FiSave /> {button}</PrimaryButton></ButtonRow>
    </FormCard>
  );
}

export function UploadForm({ title, subtitle, danger = false }: { title: string; subtitle: string; danger?: boolean }) {
  return (
    <CreatorForm title={title} subtitle={subtitle} button="Guardar cambios">
      <UploadZone><FiUpload /><strong>Arrastra y suelta tu video aqui</strong><small>MP4, MOV, WebM hasta 500MB</small></UploadZone>
      <Label>Titulo</Label><Field><FiEdit3 /><input defaultValue="Clutch epico 1v4" /></Field>
      <Label>Descripcion</Label><TextArea defaultValue="Una de las mejores jugadas del directo." />
      {danger && <DangerButton type="button"><FiTrash2 /> Eliminar</DangerButton>}
    </CreatorForm>
  );
}
