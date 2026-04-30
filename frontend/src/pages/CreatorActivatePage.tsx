import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/dashboard/Navbar";
import {
  activateChannel,
  getMyChannel,
  type Canal,
} from "../services/streamsService";
import {
  CreatorPageLayout,
  CreatorCard,
  CreatorHeader,
  CreatorTitle,
  CreatorSubtitle,
  CreatorForm,
  CreatorInputGroup,
  CreatorLabel,
  CreatorInput,
  CreatorTextarea,
  CreatorTypeGrid,
  CreatorTypeCard,
  CreatorTypeTitle,
  CreatorTypeDescription,
  CreatorButton,
  CreatorMessage,
  CreatorExistingBox,
} from "../styles/CreatorStyles";

type ChannelType = "streamer" | "podcaster";

export default function CreatorActivatePage() {
  const navigate = useNavigate();

  const [myChannel, setMyChannel] = useState<Canal | null>(null);
  const [checkingChannel, setCheckingChannel] = useState(true);

  const [nombreCanal, setNombreCanal] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoCanal, setTipoCanal] = useState<ChannelType>("streamer");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkChannel() {
      try {
        const response = await getMyChannel();

        if (!mounted) return;

        if (response.tiene_canal && response.canal) {
          setMyChannel(response.canal);
        }
      } catch (err) {
        console.error("No se pudo consultar el canal del usuario:", err);
      } finally {
        if (mounted) {
          setCheckingChannel(false);
        }
      }
    }

    checkChannel();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!nombreCanal.trim()) {
      setError("El nombre del canal es obligatorio.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await activateChannel({
        nombre_canal: nombreCanal.trim(),
        tipo_canal: tipoCanal,
        descripcion: descripcion.trim(),
      });

      setMyChannel(response.canal);
      setMessage("Canal activado correctamente.");

      setTimeout(() => {
        navigate("/creator/dashboard");
      }, 900);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudo activar el canal de creador.";

      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <CreatorPageLayout>
        <CreatorCard>
          <CreatorHeader>
            <span>ROOTBLEND CREATOR</span>
            <CreatorTitle>Activa tu canal de creador</CreatorTitle>
            <CreatorSubtitle>
              Elige si tu canal será de transmisiones en vivo o de contenido
              podcast. Esta decisión define las herramientas que verás en tu
              panel.
            </CreatorSubtitle>
          </CreatorHeader>

          {checkingChannel && (
            <CreatorMessage>Cargando información de tu canal...</CreatorMessage>
          )}

          {!checkingChannel && myChannel && (
            <CreatorExistingBox>
              <h3>Ya tienes un canal activo</h3>
              <p>
                Canal: <strong>{myChannel.nombre_canal}</strong>
              </p>
              <p>
                Tipo:{" "}
                <strong>
                  {myChannel.tipo_canal.nombre_tipo === "streamer"
                    ? "Streamer"
                    : "Podcaster"}
                </strong>
              </p>

              <CreatorButton
                type="button"
                onClick={() => navigate("/creator/dashboard")}
              >
                Ir al panel de creador
              </CreatorButton>
            </CreatorExistingBox>
          )}

          {!checkingChannel && !myChannel && (
            <CreatorForm onSubmit={handleSubmit}>
              <CreatorInputGroup>
                <CreatorLabel>Nombre del canal</CreatorLabel>
                <CreatorInput
                  value={nombreCanal}
                  onChange={(event) => setNombreCanal(event.target.value)}
                  placeholder="Ej. CanalDemo, TechLive, RootCast"
                />
              </CreatorInputGroup>

              <CreatorInputGroup>
                <CreatorLabel>Descripción</CreatorLabel>
                <CreatorTextarea
                  value={descripcion}
                  onChange={(event) => setDescripcion(event.target.value)}
                  placeholder="Describe brevemente tu canal..."
                  rows={4}
                />
              </CreatorInputGroup>

              <CreatorInputGroup>
                <CreatorLabel>Tipo de canal</CreatorLabel>

                <CreatorTypeGrid>
                  <CreatorTypeCard
                    type="button"
                    $active={tipoCanal === "streamer"}
                    onClick={() => setTipoCanal("streamer")}
                  >
                    <CreatorTypeTitle>Streamer</CreatorTypeTitle>
                    <CreatorTypeDescription>
                      Para crear transmisiones en vivo, iniciar directos,
                      aparecer en streams activos y usar chat en vivo.
                    </CreatorTypeDescription>
                  </CreatorTypeCard>

                  <CreatorTypeCard
                    type="button"
                    $active={tipoCanal === "podcaster"}
                    onClick={() => setTipoCanal("podcaster")}
                  >
                    <CreatorTypeTitle>Podcaster</CreatorTypeTitle>
                    <CreatorTypeDescription>
                      Para publicar podcasts, administrar episodios y ver
                      estadísticas de reproducción.
                    </CreatorTypeDescription>
                  </CreatorTypeCard>
                </CreatorTypeGrid>
              </CreatorInputGroup>

              {error && <CreatorMessage $error>{error}</CreatorMessage>}
              {message && <CreatorMessage>{message}</CreatorMessage>}

              <CreatorButton type="submit" disabled={submitting}>
                {submitting ? "Activando canal..." : "Activar canal"}
              </CreatorButton>
            </CreatorForm>
          )}
        </CreatorCard>
      </CreatorPageLayout>
    </>
  );
}