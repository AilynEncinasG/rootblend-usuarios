import { type FormEvent, type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiEdit3,
  FiHeadphones,
  FiMonitor,
  FiPlus,
  FiRadio,
  FiSave,
  FiShield,
  FiStar,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { getCreatorRole } from "../../../shared/utils/rootblendHelpers";
import {
  AlertPanel,
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
  SuccessBox,
  TextArea,
  UploadZone,
} from "../../../shared/styles/legacyStyled";

type CreatorScreenProps = {
  title: string;
  subtitle: string;
  image: string;
  children: ReactNode;
};

type CreatorFormProps = {
  title: string;
  subtitle: string;
  button: string;
  children: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

type FormPanelProps = CreatorFormProps;

function CreatorSideLink({
  to,
  label,
  icon,
  activeMatch,
}: {
  to: string;
  label: string;
  icon: ReactNode;
  activeMatch?: string[];
}) {
  const location = useLocation();

  const isActive = activeMatch
    ? activeMatch.some((path) => location.pathname.startsWith(path))
    : location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        minHeight: 38,
        marginBottom: 8,
        padding: "8px 10px",
        borderRadius: 10,
        color: isActive ? "#04111f" : "rgba(226, 232, 240, 0.82)",
        background: isActive
          ? "linear-gradient(135deg, #00e5ff, #22c55e)"
          : "transparent",
        fontSize: 13,
        fontWeight: 850,
        lineHeight: 1.15,
        textDecoration: "none",
        whiteSpace: "normal",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          flex: "0 0 auto",
        }}
      >
        {icon}
      </span>

      <span>{label}</span>
    </Link>
  );
}

export function CreatorNav() {
  const location = useLocation();
  const role = getCreatorRole();

  const isPodcasterArea =
    location.pathname.startsWith("/creator/podcaster") || role === "podcaster";

  if (isPodcasterArea) {
    return (
      <CreatorSidebar>
        <CreatorSideLink
          to="/creator/podcaster/dashboard"
          label="Podcaster"
          icon={<FiHeadphones />}
          activeMatch={["/creator/podcaster/dashboard"]}
        />

        <CreatorSideLink
          to="/creator/podcaster/episodes"
          label="Episodios"
          icon={<FiPlus />}
          activeMatch={["/creator/podcaster/episodes"]}
        />

        <CreatorSideLink
          to="/creator/podcaster/stats"
          label="Estadísticas"
          icon={<FiActivity />}
          activeMatch={["/creator/podcaster/stats"]}
        />
      </CreatorSidebar>
    );
  }

  return (
    <CreatorSidebar>
      <CreatorSideLink
        to="/creator/streamer/dashboard"
        label="Streamer"
        icon={<FiMonitor />}
        activeMatch={["/creator/streamer/dashboard", "/creator/streamer"]}
      />

      <CreatorSideLink
        to="/creator/streamer/control"
        label="Iniciar transmisión"
        icon={<FiRadio />}
        activeMatch={["/creator/streamer/control"]}
      />

      <CreatorSideLink
        to="/creator/streamer/create-stream"
        label="Configurar stream"
        icon={<FiPlus />}
        activeMatch={[
          "/creator/streamer/create-stream",
          "/creator/streamer/streams/new",
        ]}
      />

      <CreatorSideLink
        to="/creator/streamer/channel/edit"
        label="Editar canal"
        icon={<FiEdit3 />}
        activeMatch={[
          "/creator/streamer/channel/edit",
          "/creator/streamer/edit-channel",
          "/creator/streamer/channel",
        ]}
      />

      <CreatorSideLink
        to="/creator/streamer/highlights"
        label="Momentos"
        icon={<FiStar />}
        activeMatch={["/creator/streamer/highlights"]}
      />

      <CreatorSideLink
        to="/creator/streamer/stats"
        label="Estadísticas"
        icon={<FiActivity />}
        activeMatch={["/creator/streamer/stats"]}
      />

      <CreatorSideLink
        to="/moderation/moderators"
        label="Moderadores"
        icon={<FiShield />}
        activeMatch={["/moderation"]}
      />
    </CreatorSidebar>
  );
}

export function CreatorScreen({
  title,
  subtitle,
  image,
  children,
}: CreatorScreenProps) {
  return (
    <RootShell active="creator">
      <CreatorLayout>
        <CreatorNav />

        <CreatorMain>
          <ChannelHero $image={image}>
            <Avatar $large>RB</Avatar>

            <div>
              <Eyebrow>ROOTBLEND Creator</Eyebrow>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </ChannelHero>

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
}: CreatorFormProps) {
  return (
    <RootShell active="creator">
      <CreatorLayout>
        <CreatorNav />

        <CreatorMain>
          <FormPanel
            title={title}
            subtitle={subtitle}
            button={button}
            onSubmit={onSubmit}
          >
            {children}
          </FormPanel>
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}

export function FormPanel({
  title,
  subtitle,
  button,
  children,
  onSubmit,
}: FormPanelProps) {
  const role = getCreatorRole();
  const cancelTo = role === "podcaster" ? "/creator/podcaster/dashboard" : "/creator/streamer/dashboard";
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSaved(false);
    setError("");
    setSubmitting(true);

    try {
      await onSubmit?.(event);
      setSaved(true);
    } catch (submitError) {
      console.error("CREATOR_FORM_SUBMIT_ERROR", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar la información."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormCard onSubmit={submit}>
      <PageHeading>
        <Eyebrow>Formulario</Eyebrow>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </PageHeading>

      {children}

      {error ? (
        <AlertPanel>
          <FiAlertTriangle />
          <div>
            <strong>No se pudo guardar</strong>
            <p>{error}</p>
          </div>
        </AlertPanel>
      ) : null}

      {saved ? (
        <SuccessBox>
          <FiCheckCircle />
          Configuración guardada correctamente.
        </SuccessBox>
      ) : null}

      <ButtonRow>
        <GhostLink to={cancelTo}>Cancelar</GhostLink>

        <PrimaryButton type="submit" disabled={submitting}>
          <FiSave /> {submitting ? "Guardando..." : button}
        </PrimaryButton>
      </ButtonRow>
    </FormCard>
  );
}

export function UploadForm({
  title,
  subtitle,
  danger = false,
}: {
  title: string;
  subtitle: string;
  danger?: boolean;
}) {
  return (
    <CreatorForm title={title} subtitle={subtitle} button="Guardar cambios">
      <UploadZone>
        <FiUpload />
        <strong>Arrastra y suelta tu video aquí</strong>
        <small>MP4, MOV, WebM hasta 500MB</small>
      </UploadZone>

      <Label>Título</Label>
      <Field>
        <FiEdit3 />
        <input defaultValue="Clutch épico 1v4" />
      </Field>

      <Label>Descripción</Label>
      <TextArea defaultValue="Una de las mejores jugadas del directo." />

      {danger ? (
        <DangerButton type="button">
          <FiTrash2 /> Eliminar
        </DangerButton>
      ) : null}
    </CreatorForm>
  );
}