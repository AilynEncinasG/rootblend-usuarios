import { useState } from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { brandAssets } from "../../../../shared/mock/rootblendMock";
import { AlertPanel, ButtonRow, DangerButton, MetricGrid, PrimaryButton } from "../../../../shared/styles/legacyStyled";
import { CreatorScreen } from "../../shared/creatorLegacy";
import { StatCard } from "../../../public/utils/publicLegacyHelpers";
export default function LiveControlPage() {
  const [live, setLive] = useState(false);

  return (
    <CreatorScreen title="Control de transmision" subtitle={live ? "El stream esta al aire." : "Configura tu stream y presiona iniciar."} image={brandAssets.streamControl}>
      <AlertPanel>
        {live ? <FiCheckCircle /> : <FiAlertTriangle />}
        <div><strong>{live ? "Estas en vivo" : "Estas offline"}</strong><p>{live ? "El chat y las estadisticas estan activos." : "Configura el stream antes de iniciar."}</p></div>
      </AlertPanel>
      <MetricGrid>
        <StatCard label="Espectadores" value={live ? "1.2K" : "0"} trend="Ahora" />
        <StatCard label="Duracion" value={live ? "00:21:43" : "00:00:00"} trend="Directo" />
        <StatCard label="Seguidores en vivo" value={live ? "19" : "0"} trend="+ hoy" />
      </MetricGrid>
      <ButtonRow>
        <PrimaryButton type="button" onClick={() => setLive(true)}>Iniciar transmision</PrimaryButton>
        <DangerButton type="button" onClick={() => setLive(false)}>Finalizar stream</DangerButton>
      </ButtonRow>
    </CreatorScreen>
  );
}
