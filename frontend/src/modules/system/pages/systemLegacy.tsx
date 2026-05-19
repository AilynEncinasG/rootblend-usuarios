import { type ReactNode } from "react";
import { RootShell } from "../../../shared/layout";
import {
  ButtonRow,
  CreatorLayout,
  CreatorMain,
  Eyebrow,
  GhostLink,
  PageHeading,
  PrimaryLink,
  StateIcon,
  StatePanel,
} from "../../../shared/styles/legacyStyled";
import { CreatorNav } from "../../creator/shared/creatorLegacy";

export function StatePage({
  icon,
  title,
  text,
  primary,
  primaryLabel,
  secondary,
  secondaryLabel,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  primary: string;
  primaryLabel: string;
  secondary?: string;
  secondaryLabel?: string;
}) {
  return (
    <RootShell active="system">
      <StatePanel>
        <StateIcon>{icon}</StateIcon>
        <h1>{title}</h1>
        <p>{text}</p>

        <ButtonRow>
          <PrimaryLink to={primary}>{primaryLabel}</PrimaryLink>

          {secondary && secondaryLabel ? (
            <GhostLink to={secondary}>{secondaryLabel}</GhostLink>
          ) : null}
        </ButtonRow>
      </StatePanel>
    </RootShell>
  );
}

export function ModerationScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <RootShell active="moderation">
      <CreatorLayout>
        <CreatorNav />

        <CreatorMain>
          <PageHeading>
            <Eyebrow>Moderación</Eyebrow>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </PageHeading>

          {children}
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}