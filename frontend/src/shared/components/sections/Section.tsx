import type { ReactNode } from "react";
import { SectionBlock, SectionHeader, TextLink } from "../../styles/legacyStyled";

type SectionProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
  children: ReactNode;
};

export function Section({
  title,
  subtitle,
  actionLabel,
  actionTo,
  children,
}: SectionProps) {
  return (
    <SectionBlock>
      <SectionHeader>
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>

        {actionLabel && actionTo ? (
          <TextLink to={actionTo}>{actionLabel}</TextLink>
        ) : null}
      </SectionHeader>

      {children}
    </SectionBlock>
  );
}
