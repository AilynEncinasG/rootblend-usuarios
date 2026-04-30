// frontend/src/components/dashboard/StreamCard.tsx
import type { Stream } from "../../services/streamsService";
import {
  StreamCardWrapper,
  StreamThumb,
  ThumbCenterText,
  LiveBadge,
  FeaturedBadge,
  StreamBody,
  StreamTitle,
  StreamChannel,
  StreamCategory,
  StreamDescription,
  StreamMetaRow,
  MetaChip,
} from "../../styles/DashboardStyles";

type StreamCardProps = {
  stream: Stream;
};

export default function StreamCard({ stream }: StreamCardProps) {
  const isLive = stream.estado === "en_vivo";

  return (
    <StreamCardWrapper>
      <StreamThumb>
        <ThumbCenterText>{stream.categoria?.nombre || "ROOTBLEND"}</ThumbCenterText>

        {isLive && <LiveBadge>LIVE</LiveBadge>}

        {stream.destacado && <FeaturedBadge>DESTACADO</FeaturedBadge>}
      </StreamThumb>

      <StreamBody>
        <StreamTitle>{stream.titulo}</StreamTitle>

        <StreamChannel>
          {stream.canal?.nombre_canal || "Canal desconocido"}
        </StreamChannel>

        <StreamCategory>
          {stream.categoria?.nombre || "Sin categoría"}
        </StreamCategory>

        <StreamDescription>
          {stream.descripcion || "Transmisión en vivo disponible en ROOTBLEND."}
        </StreamDescription>

        <StreamMetaRow>
          <MetaChip>{stream.calidad_actual || "720p"}</MetaChip>
          <MetaChip>{stream.configuracion?.latencia_modo || "normal"}</MetaChip>
          <MetaChip>{isLive ? "En vivo" : "Offline"}</MetaChip>
        </StreamMetaRow>
      </StreamBody>
    </StreamCardWrapper>
  );
}