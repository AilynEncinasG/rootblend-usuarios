import type { ReactNode } from "react";
import {
  ButtonRow,
  GhostLink,
  PrimaryLink,
  StateIcon,
  StatePanel,
} from "../../styles/legacyStyled";

type StatePageProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
};

export function StatePage({
  icon,
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: StatePageProps) {
  return (
    <StatePanel>
      {icon ? <StateIcon>{icon}</StateIcon> : null}

      <h1>{title}</h1>

      {description ? <p>{description}</p> : null}

      {(primaryLabel && primaryTo) || (secondaryLabel && secondaryTo) ? (
        <ButtonRow>
          {primaryLabel && primaryTo ? (
            <PrimaryLink to={primaryTo}>{primaryLabel}</PrimaryLink>
          ) : null}

          {secondaryLabel && secondaryTo ? (
            <GhostLink to={secondaryTo}>{secondaryLabel}</GhostLink>
          ) : null}
        </ButtonRow>
      ) : null}
    </StatePanel>
  );
}
