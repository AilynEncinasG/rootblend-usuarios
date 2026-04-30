import { useEffect, useState } from "react";
import { Navbar } from "../components/dashboard/Navbar";
import { getMyChannel, type Canal } from "../services/streamsService";
import {
  CreatorPageLayout,
  CreatorCard,
  CreatorHeader,
  CreatorTitle,
  CreatorSubtitle,
  CreatorExistingBox,
  CreatorMessage,
  CreatorButton,
} from "../styles/CreatorStyles";

export default function CreatorDashboardPage() {
  const [channel, setChannel] = useState<Canal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadChannel() {
      try {
        const response = await getMyChannel();

        if (!mounted) return;

        if (response.tiene_canal && response.canal) {
          setChannel(response.canal);
        }
      } catch (error) {
        console.error("Error cargando canal:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadChannel();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />

      <CreatorPageLayout>
        <CreatorCard>
          <CreatorHeader>
            <span>CREATOR DASHBOARD</span>
            <CreatorTitle>Panel de creador</CreatorTitle>
            <CreatorSubtitle>
              Desde aquí podrás administrar las herramientas disponibles según
              el tipo de canal que activaste.
            </CreatorSubtitle>
          </CreatorHeader>

          {loading && <CreatorMessage>Cargando canal...</CreatorMessage>}

          {!loading && !channel && (
            <CreatorExistingBox>
              <h3>Aún no tienes canal</h3>
              <p>
                Para usar el panel primero debes activar un canal de creador.
              </p>
              <CreatorButton
                type="button"
                onClick={() => {
                  window.location.href = "/creator/activate";
                }}
              >
                Activar canal
              </CreatorButton>
            </CreatorExistingBox>
          )}

          {!loading && channel && (
            <CreatorExistingBox>
              <h3>{channel.nombre_canal}</h3>
              <p>
                Tipo de canal:{" "}
                <strong>
                  {channel.tipo_canal.nombre_tipo === "streamer"
                    ? "Streamer"
                    : "Podcaster"}
                </strong>
              </p>
              <p>{channel.descripcion || "Sin descripción todavía."}</p>

              {channel.tipo_canal.nombre_tipo === "streamer" ? (
                <>
                  <CreatorMessage>
                    Herramientas disponibles: crear stream, iniciar directo,
                    finalizar transmisión y ver estadísticas de stream.
                  </CreatorMessage>
                  <CreatorButton type="button">
                    Crear transmisión
                  </CreatorButton>
                </>
              ) : (
                <>
                  <CreatorMessage>
                    Herramientas disponibles: crear podcast, subir episodios y
                    ver estadísticas de reproducción.
                  </CreatorMessage>
                  <CreatorButton type="button">
                    Crear podcast
                  </CreatorButton>
                </>
              )}
            </CreatorExistingBox>
          )}
        </CreatorCard>
      </CreatorPageLayout>
    </>
  );
}