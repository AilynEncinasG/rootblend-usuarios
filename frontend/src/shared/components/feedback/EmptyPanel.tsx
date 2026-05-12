import type { ReactNode } from "react";
import {
  ButtonRow,
  GhostLink,
  PrimaryLink,
  StateIcon,
  StatePanel,
} from "../../styles/legacyStyled";

type EmptyPanelProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
};

export function EmptyPanel({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  secondaryLabel,
  secondaryTo,
}: EmptyPanelProps) {
  return (
    <StatePanel>
      {icon ? <StateIcon>{icon}</StateIcon> : null}

      <h2>{title}</h2>

      {description ? <p>{description}</p> : null}

      {(actionLabel && actionTo) || (secondaryLabel && secondaryTo) ? (
        <ButtonRow>
          {actionLabel && actionTo ? (
            <PrimaryLink to={actionTo}>{actionLabel}</PrimaryLink>
          ) : null}

          {secondaryLabel && secondaryTo ? (
            <GhostLink to={secondaryTo}>{secondaryLabel}</GhostLink>
          ) : null}
        </ButtonRow>
      ) : null}
    </StatePanel>
  );
}
