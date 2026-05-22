import { type FormEvent, useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiBell,
  FiCheckCircle,
  FiRefreshCw,
  FiSave,
  FiServer,
} from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { getPreferences, updatePreferences } from "../../../services/userService";
import {
  getNotificationConfig,
  updateNotificationConfig,
} from "../../interactions/services/interactionsService";
import { formatApiError } from "../../../shared/utils/rootblendHelpers";
import {
  AlertPanel,
  ButtonRow,
  Eyebrow,
  FilterChip,
  FormCard,
  Label,
  GhostLink,
  PageHeading,
  PrimaryButton,
  Select,
  ServicePill,
  SuccessBox,
  Tabs,
  ToggleLine,
} from "../../../shared/styles/legacyStyled";

export default function SettingsPage() {
  const [tema, setTema] = useState<"claro" | "oscuro">("oscuro");
  const [idioma, setIdioma] = useState<"es" | "en">("es");
  const [autoplay, setAutoplay] = useState(true);

  const [recibirNotificaciones, setRecibirNotificaciones] = useState(true);
  const [notificarDirectos, setNotificarDirectos] = useState(true);
  const [notificarSuscripciones, setNotificarSuscripciones] = useState(true);
  const [notificarPromociones, setNotificarPromociones] = useState(false);
  const [canalWeb, setCanalWeb] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [interactionsReady, setInteractionsReady] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPreferences() {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      setInteractionsReady(false);

      try {
        const [userPreferencesResult, interactionConfigResult] =
          await Promise.allSettled([
            getPreferences(),
            getNotificationConfig(),
          ]);

        if (!active) return;

        if (userPreferencesResult.status === "fulfilled") {
          const result = userPreferencesResult.value;

          if (!result.success || !result.data) {
            setError(result.message || "No se pudieron cargar las preferencias.");
          } else {
            const preferences = result.data.preferencias;

            setTema(preferences.tema);
            setIdioma(preferences.idioma);
            setAutoplay(Boolean(preferences.autoplay));
            setRecibirNotificaciones(
              Boolean(preferences.recibir_notificaciones),
            );
          }
        } else {
          setError("No se pudo conectar con usuarios-service.");
        }

        if (interactionConfigResult.status === "fulfilled") {
          const config = interactionConfigResult.value;

          setInteractionsReady(true);
          setNotificarDirectos(Boolean(config.notificar_directos));
          setNotificarSuscripciones(Boolean(config.notificar_suscripciones));
          setNotificarPromociones(Boolean(config.notificar_promociones));
          setCanalWeb(Boolean(config.canal_web));
        } else {
          setInteractionsReady(false);
          setError((current) =>
            current
              ? `${current} Además, no se pudo cargar interacciones-service.`
              : "No se pudo cargar configuración real de notificaciones desde interacciones-service.",
          );
        }
      } catch (error) {
        console.error("PREFERENCES_LOAD_ERROR", error);

        if (active) {
          setError("No se pudieron cargar las configuraciones.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPreferences();

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await updatePreferences({
        tema,
        idioma,
        autoplay,
        recibir_notificaciones: recibirNotificaciones,
      });

      if (!result.success) {
        setError(
          formatApiError(
            result.errors,
            result.message || "No se pudieron actualizar las preferencias.",
          ),
        );
        return;
      }

      await updateNotificationConfig({
        notificar_directos: recibirNotificaciones && notificarDirectos,
        notificar_suscripciones:
          recibirNotificaciones && notificarSuscripciones,
        notificar_promociones:
          recibirNotificaciones && notificarPromociones,
        canal_web: recibirNotificaciones && canalWeb,
      });

      setInteractionsReady(true);
      setSuccessMessage(
        "Preferencias guardadas en usuarios-service e interacciones-service.",
      );
    } catch (error) {
      console.error("PREFERENCES_UPDATE_ERROR", error);
      setError(
        "No se pudieron guardar todas las configuraciones. Revisa usuarios-service e interacciones-service.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <RootShell active="home">
      <FormCard onSubmit={submit}>
        <PageHeading>
          <Eyebrow>Preferencias reales</Eyebrow>
          <h1>Configuración</h1>
          <p>
            Gestiona idioma, tema, reproducción automática y notificaciones.
            Ahora las notificaciones se guardan también en interacciones-service.
          </p>
        </PageHeading>

        {loading && (
          <AlertPanel>
            <FiRefreshCw />
            <div>
              <strong>Cargando preferencias</strong>
              <p>Consultando usuarios-service e interacciones-service.</p>
            </div>
          </AlertPanel>
        )}

        {error && (
          <AlertPanel>
            <FiAlertTriangle />
            <div>
              <strong>Atención</strong>
              <p>{error}</p>
            </div>
          </AlertPanel>
        )}

        {successMessage && (
          <SuccessBox>
            <FiCheckCircle /> {successMessage}
          </SuccessBox>
        )}

        <AlertPanel>
          <FiServer />

          <div>
            <strong>Estado de interacciones-service</strong>
            <p>
              {interactionsReady
                ? "Configuración de notificaciones conectada al microservicio de interacciones."
                : "La pantalla funciona, pero todavía no se pudo sincronizar con interacciones-service."}
            </p>
          </div>

          <ServicePill $status={interactionsReady ? "Operativo" : "Degradado"}>
            {interactionsReady ? "Conectado" : "Pendiente"}
          </ServicePill>
        </AlertPanel>

        <Tabs>
          <FilterChip $active>Cuenta</FilterChip>
          <FilterChip>Privacidad</FilterChip>
          <FilterChip>Apariencia</FilterChip>
          <FilterChip>Reproducción</FilterChip>
          <FilterChip>Notificaciones</FilterChip>
        </Tabs>

        <Label>Tema</Label>
        <Select
          value={tema}
          onChange={(event) =>
            setTema(event.target.value as "claro" | "oscuro")
          }
          disabled={loading || saving}
        >
          <option value="oscuro">Oscuro</option>
          <option value="claro">Claro</option>
        </Select>

        <Label>Idioma</Label>
        <Select
          value={idioma}
          onChange={(event) => setIdioma(event.target.value as "es" | "en")}
          disabled={loading || saving}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </Select>

        <ToggleLine>
          <span>Reproducción automática</span>
          <input
            type="checkbox"
            checked={autoplay}
            disabled={loading || saving}
            onChange={(event) => setAutoplay(event.target.checked)}
          />
        </ToggleLine>

        <AlertPanel>
          <FiBell />

          <div>
            <strong>Notificaciones reales</strong>
            <p>
              Si desactivas recibir notificaciones, interacciones-service no debe
              generar avisos web para directos ni suscripciones.
            </p>
          </div>
        </AlertPanel>

        <ToggleLine>
          <span>Recibir notificaciones</span>
          <input
            type="checkbox"
            checked={recibirNotificaciones}
            disabled={loading || saving}
            onChange={(event) => {
              const checked = event.target.checked;
              setRecibirNotificaciones(checked);

              if (!checked) {
                setNotificarDirectos(false);
                setNotificarSuscripciones(false);
                setNotificarPromociones(false);
                setCanalWeb(false);
              } else {
                setNotificarDirectos(true);
                setNotificarSuscripciones(true);
                setCanalWeb(true);
              }
            }}
          />
        </ToggleLine>

        <ToggleLine>
          <span>Notificar cuando un canal seguido inicia directo</span>
          <input
            type="checkbox"
            checked={notificarDirectos}
            disabled={loading || saving || !recibirNotificaciones}
            onChange={(event) => setNotificarDirectos(event.target.checked)}
          />
        </ToggleLine>

        <ToggleLine>
          <span>Notificar eventos de suscripciones</span>
          <input
            type="checkbox"
            checked={notificarSuscripciones}
            disabled={loading || saving || !recibirNotificaciones}
            onChange={(event) =>
              setNotificarSuscripciones(event.target.checked)
            }
          />
        </ToggleLine>

        <ToggleLine>
          <span>Notificar promociones</span>
          <input
            type="checkbox"
            checked={notificarPromociones}
            disabled={loading || saving || !recibirNotificaciones}
            onChange={(event) => setNotificarPromociones(event.target.checked)}
          />
        </ToggleLine>

        <ToggleLine>
          <span>Canal web activo</span>
          <input
            type="checkbox"
            checked={canalWeb}
            disabled={loading || saving || !recibirNotificaciones}
            onChange={(event) => setCanalWeb(event.target.checked)}
          />
        </ToggleLine>

        <ButtonRow>
          <GhostLink to="/profile">Volver al perfil</GhostLink>

          <PrimaryButton type="submit" disabled={loading || saving}>
            <FiSave /> {saving ? "Guardando..." : "Guardar preferencias"}
          </PrimaryButton>
        </ButtonRow>
      </FormCard>
    </RootShell>
  );
}