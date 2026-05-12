import { type FormEvent, useEffect, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiSave } from "react-icons/fi";
import { RootShell } from "../../../shared/layout";
import { getPreferences, updatePreferences } from "../../../services/userService";
import { formatApiError } from "../../../shared/utils/rootblendHelpers";
import { AlertPanel, ButtonRow, Eyebrow, FilterChip, FormCard, GhostLink, Label, PageHeading, PrimaryButton, Select, SuccessBox, Tabs, ToggleLine } from "../../../shared/styles/legacyStyled";

export default function SettingsPage() {
  const [tema, setTema] = useState<"claro" | "oscuro">("oscuro");
  const [idioma, setIdioma] = useState<"es" | "en">("es");
  const [autoplay, setAutoplay] = useState(true);
  const [recibirNotificaciones, setRecibirNotificaciones] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPreferences() {
      setLoading(true);
      setError("");

      try {
        const result = await getPreferences();

        if (!active) return;

        if (!result.success || !result.data) {
          setError(result.message || "No se pudieron cargar las preferencias.");
          return;
        }

        const preferences = result.data.preferencias;

        setTema(preferences.tema);
        setIdioma(preferences.idioma);
        setAutoplay(Boolean(preferences.autoplay));
        setRecibirNotificaciones(Boolean(preferences.recibir_notificaciones));
      } catch (error) {
        console.error("PREFERENCES_LOAD_ERROR", error);

        if (active) {
          setError("No se pudo conectar con el servicio de usuarios.");
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
            result.message || "No se pudieron actualizar las preferencias."
          )
        );
        return;
      }

      setSuccessMessage("Preferencias actualizadas correctamente.");
    } catch (error) {
      console.error("PREFERENCES_UPDATE_ERROR", error);
      setError("No se pudo conectar con el servicio de usuarios.");
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
            Estos datos se guardan en usuarios-service usando tu JWT.
          </p>
        </PageHeading>

        {loading && (
          <AlertPanel>
            <FiRefreshCw />
            <div>
              <strong>Cargando preferencias</strong>
              <p>Consultando configuración real del usuario.</p>
            </div>
          </AlertPanel>
        )}

        {error && (
          <AlertPanel>
            <FiAlertTriangle />
            <div>
              <strong>Error</strong>
              <p>{error}</p>
            </div>
          </AlertPanel>
        )}

        {successMessage && (
          <SuccessBox>
            <FiCheckCircle /> {successMessage}
          </SuccessBox>
        )}

        <Tabs>
          <FilterChip $active>Cuenta</FilterChip>
          <FilterChip>Privacidad</FilterChip>
          <FilterChip>Apariencia</FilterChip>
          <FilterChip>Reproducción</FilterChip>
        </Tabs>

        <Label>Tema</Label>
        <Select
          value={tema}
          onChange={(event) => setTema(event.target.value as "claro" | "oscuro")}
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

        <ToggleLine>
          <span>Recibir notificaciones</span>
          <input
            type="checkbox"
            checked={recibirNotificaciones}
            disabled={loading || saving}
            onChange={(event) => setRecibirNotificaciones(event.target.checked)}
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
