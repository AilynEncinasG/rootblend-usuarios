import type { ReactNode } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import {
  AlertPanel,
  ButtonRow,
  GhostButton,
  Muted,
} from "../../styles/legacyStyled";

type ServiceFallbackProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ServiceFallback({
  icon,
  title = "Servicio no disponible",
  description = "Esta sección no pudo cargarse, pero el resto de ROOTBLEND puede seguir funcionando.",
  onRetry,
}: ServiceFallbackProps) {
  return (
    <AlertPanel>
      {icon}
      <div>
        <strong>{title}</strong>
        <Muted>{description}</Muted>
      </div>

      {onRetry ? (
        <ButtonRow>
          <GhostButton type="button" onClick={onRetry}>
            <FiRefreshCcw />
            Reintentar
          </GhostButton>
        </ButtonRow>
      ) : null}
    </AlertPanel>
  );
}
