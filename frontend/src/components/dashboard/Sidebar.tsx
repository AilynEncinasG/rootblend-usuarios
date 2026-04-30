// frontend/src/components/dashboard/Sidebar.tsx
import { useEffect, useState } from "react";
import type { Canal } from "../../services/streamsService";
import { getActiveChannels } from "../../services/streamsService";
import {
  SidebarWrapper,
  SidebarSectionTitle,
  SidebarList,
  ChannelItemRow,
  ChannelAvatar,
  ChannelText,
  ChannelName,
  ChannelSubtitle,
} from "../../styles/DashboardStyles";

export default function Sidebar() {
  const [channels, setChannels] = useState<Canal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadChannels() {
      try {
        const data = await getActiveChannels();

        if (mounted) {
          setChannels(data);
        }
      } catch (error) {
        console.error("Error cargando canales activos:", error);

        if (mounted) {
          setChannels([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadChannels();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SidebarWrapper>
      <SidebarSectionTitle>Canales recomendados</SidebarSectionTitle>

      <SidebarList>
        {loading && (
          <ChannelItemRow>
            <ChannelText>
              <ChannelName>Cargando...</ChannelName>
              <ChannelSubtitle>Obteniendo canales</ChannelSubtitle>
            </ChannelText>
          </ChannelItemRow>
        )}

        {!loading && channels.length === 0 && (
          <ChannelItemRow>
            <ChannelText>
              <ChannelName>Sin canales</ChannelName>
              <ChannelSubtitle>No hay canales activos</ChannelSubtitle>
            </ChannelText>
          </ChannelItemRow>
        )}

        {!loading &&
          channels.map((channel) => (
            <ChannelItemRow key={channel.id_canal}>
              <ChannelAvatar>
                {channel.nombre_canal.charAt(0).toUpperCase()}
              </ChannelAvatar>

              <ChannelText>
                <ChannelName>{channel.nombre_canal}</ChannelName>
                <ChannelSubtitle>
                  {channel.tipo_canal.nombre_tipo === "streamer"
                    ? "Canal en vivo"
                    : "Canal podcast"}
                </ChannelSubtitle>
              </ChannelText>
            </ChannelItemRow>
          ))}
      </SidebarList>
    </SidebarWrapper>
  );
}