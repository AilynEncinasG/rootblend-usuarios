import type { ReactNode } from "react";
import { MetricCard } from "../../styles/legacyStyled";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  helper?: string;
};

export function StatCard({ label, value, icon, helper }: StatCardProps) {
  return (
    <MetricCard>
      {icon ? <span>{icon}</span> : null}
      <strong>{value}</strong>
      <span>{label}</span>
      {helper ? <small>{helper}</small> : null}
    </MetricCard>
  );
}
