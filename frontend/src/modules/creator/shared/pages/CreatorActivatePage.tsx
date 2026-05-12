import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiHeadphones,
  FiRadio,
  FiRefreshCw,
} from "react-icons/fi";
import { RootShell } from "../../../../shared/layout";
import {
  AlertPanel,
  ButtonRow,
  ChoiceButton,
  ChoiceGrid,
  Muted,
  PageHeading,
  Panel,
  PrimaryButton,
  SuccessBox,
  TagRow,
} from "../../../../shared/styles/legacyStyled";
import {
  clearCreatorRole,
  getCreatorRole,
  setCreatorRole,
  type CreatorRole,
} from "../services/creatorRoleService";

export default function CreatorActivatePage() {
  const navigate = useNavigate();
  const activeRole = getCreatorRole();

  function activate(role: CreatorRole) {
    setCreatorRole(role);

    window.dispatchEvent(new Event("creator-role-changed"));

    if (role === "podcaster") {
      navigate("/creator/podcaster/dashboard");
      return;
    }

    navigate("/creator/streamer/dashboard");
  }

  function resetRole() {
    clearCreatorRole();

    window.dispatchEvent(new Event("creator-role-changed"));

    navigate("/creator/activate");
  }

  return (
    <RootShell active="creator">
      <PageHeading>
        <span>Creator mode</span>
        <h1>Activa tu espacio de creador</h1>
        <p>
          Elige si quieres crear transmisiones en vivo o publicar podcasts dentro
          de ROOTBLEND.
        </p>
      </PageHeading>

      {activeRole ? (
        <SuccessBox>
          <FiCheckCircle />
          <div>
            <strong>
              Rol actual: {activeRole === "podcaster" ? "Podcaster" : "Streamer"}
            </strong>
            <Muted>
              Tu menú y accesos rápidos se adaptan según el tipo de creador
              seleccionado.
            </Muted>
          </div>
        </SuccessBox>
      ) : (
        <AlertPanel>
          <FiRefreshCw />
          <div>
            <strong>Selecciona un rol</strong>
            <Muted>
              Esta selección simula la activación del canal del creador y se
              guarda localmente para navegación.
            </Muted>
          </div>
        </AlertPanel>
      )}

      <ChoiceGrid>
        <ChoiceButton
          type="button"
          $active={activeRole === "streamer"}
          onClick={() => activate("streamer")}
        >
          <FiRadio />

          <div>
            <strong>Crear como streamer</strong>
            <Muted>
              Configura canales, transmisiones en vivo, chat, moderación y
              estadísticas de audiencia.
            </Muted>
          </div>

          <TagRow>
            <span>Streams</span>
            <span>Chat</span>
            <span>Live control</span>
          </TagRow>
        </ChoiceButton>

        <ChoiceButton
          type="button"
          $active={activeRole === "podcaster"}
          onClick={() => activate("podcaster")}
        >
          <FiHeadphones />

          <div>
            <strong>Crear como podcaster</strong>
            <Muted>
              Publica podcasts, administra episodios, historial y métricas de
              audio.
            </Muted>
          </div>

          <TagRow>
            <span>Podcasts</span>
            <span>Episodios</span>
            <span>Audio</span>
          </TagRow>
        </ChoiceButton>
      </ChoiceGrid>

      <Panel>
        <h2>Demo técnica</h2>
        <Muted>
          El rol de creador se guarda en localStorage para conservar el flujo
          visual del frontend antiguo y permitir navegación por dashboards.
        </Muted>

        <ButtonRow>
          <PrimaryButton type="button" onClick={resetRole}>
            <FiRefreshCw />
            Reiniciar rol demo
          </PrimaryButton>
        </ButtonRow>
      </Panel>
    </RootShell>
  );
}