import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiToggleRight,
  FiUser,
} from "react-icons/fi";
import { RootShell } from "../../../../shared/layout";
import {
  AlertPanel,
  ButtonRow,
  CreatorLayout,
  CreatorMain,
  Eyebrow,
  Field,
  FormCard,
  GhostLink,
  Label,
  MetricGrid,
  PageHeading,
  PrimaryButton,
  SuccessBox,
} from "../../../../shared/styles/legacyStyled";
import { CreatorNav } from "../../shared/creatorLegacy";
import { StatCard } from "../../../public/utils/publicLegacyHelpers";
import {
  getMyChannel,
  type Canal,
} from "../../../streams/services/streamsService";
import {
  getCreatorPaymentConfig,
  saveCreatorPaymentConfig,
} from "../services/paymentsService";

type Provider = "mock" | "bcp" | "bnb" | "libelula";

function parseAmount(value: string) {
  const parsed = Number(value.replace(",", "."));

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
}

function formatAmount(value: number | string) {
  const parsed = typeof value === "number" ? value : parseAmount(value);

  if (!parsed) {
    return "0.00";
  }

  return parsed.toFixed(2);
}

export default function CreatorPaymentsPage() {
  const [channel, setChannel] = useState<Canal | null>(null);

  const [provider, setProvider] = useState<Provider>("mock");
  const [nombreTitular, setNombreTitular] = useState("");
  const [banco, setBanco] = useState("BCP");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [telefonoPago, setTelefonoPago] = useState("");
  const [commerceId, setCommerceId] = useState("");

  const [flashAmount, setFlashAmount] = useState("5");
  const [screenAmount, setScreenAmount] = useState("8");
  const [epicAmount, setEpicAmount] = useState("20");
  const [activo, setActivo] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalPreview = useMemo(() => {
    return (
      parseAmount(flashAmount) +
      parseAmount(screenAmount) +
      parseAmount(epicAmount)
    );
  }, [flashAmount, screenAmount, epicAmount]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const channelResult = await getMyChannel();

        if (!active) {
          return;
        }

        if (!channelResult.canal) {
          setError("No tienes un canal activo para configurar pagos.");
          return;
        }

        setChannel(channelResult.canal);

        try {
          const config = await getCreatorPaymentConfig(
            channelResult.canal.id_canal
          );

          if (!active) {
            return;
          }

          setProvider(config.provider || "mock");
          setNombreTitular(config.nombre_titular || "");
          setBanco(config.banco || "BCP");
          setNumeroCuenta(config.numero_cuenta || "");
          setTelefonoPago(config.telefono_pago || "");
          setCommerceId(config.commerce_id || "");
          setFlashAmount(String(config.flash_amount ?? 5));
          setScreenAmount(String(config.screen_amount ?? 8));
          setEpicAmount(String(config.epic_amount ?? 20));
          setActivo(Boolean(config.activo));
        } catch {
          if (!active) {
            return;
          }

          setProvider("mock");
          setNombreTitular("");
          setBanco("BCP");
          setNumeroCuenta("");
          setTelefonoPago("");
          setCommerceId("");
          setFlashAmount("5");
          setScreenAmount("8");
          setEpicAmount("20");
          setActivo(true);
        }
      } catch (loadError) {
        console.error("CREATOR_PAYMENTS_LOAD_ERROR", loadError);

        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar la configuración de pagos."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  function validateForm() {
    const flash = parseAmount(flashAmount);
    const screen = parseAmount(screenAmount);
    const epic = parseAmount(epicAmount);

    if (!channel) {
      return "No se encontró el canal del streamer.";
    }

    if (!nombreTitular.trim()) {
      return "El nombre del titular es obligatorio.";
    }

    if (!banco.trim()) {
      return "El banco o proveedor de pago es obligatorio.";
    }

    if (!numeroCuenta.trim() && !telefonoPago.trim() && !commerceId.trim()) {
      return "Debes registrar al menos una cuenta, teléfono de pago o commerce ID.";
    }

    if (flash < 1 || flash > 5) {
      return "La donación Flash debe estar entre 1 y 5 Bs.";
    }

    if (screen < 6 || screen > 10) {
      return "La donación Pantalla debe estar entre 6 y 10 Bs.";
    }

    if (epic < 11 || epic > 150) {
      return "La donación Épica debe estar entre 11 y 150 Bs.";
    }

    return "";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    if (!channel) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const config = await saveCreatorPaymentConfig({
        id_canal: channel.id_canal,
        id_usuario_creador: channel.id_usuario_propietario,
        provider,
        nombre_titular: nombreTitular.trim(),
        banco: banco.trim(),
        numero_cuenta: numeroCuenta.trim(),
        telefono_pago: telefonoPago.trim(),
        commerce_id: commerceId.trim(),
        flash_amount: parseAmount(flashAmount),
        screen_amount: parseAmount(screenAmount),
        epic_amount: parseAmount(epicAmount),
        moneda: "BOB",
        activo,
      });

      setProvider(config.provider);
      setNombreTitular(config.nombre_titular || "");
      setBanco(config.banco || "");
      setNumeroCuenta(config.numero_cuenta || "");
      setTelefonoPago(config.telefono_pago || "");
      setCommerceId(config.commerce_id || "");
      setFlashAmount(String(config.flash_amount));
      setScreenAmount(String(config.screen_amount));
      setEpicAmount(String(config.epic_amount));
      setActivo(config.activo);

      setSuccess("Configuración de pagos guardada correctamente.");
    } catch (saveError) {
      console.error("CREATOR_PAYMENTS_SAVE_ERROR", saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la configuración de pagos."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <RootShell active="creator">
      <CreatorLayout>
        <CreatorNav />

        <CreatorMain>
          <FormCard onSubmit={submit}>
            <PageHeading>
              <Eyebrow>Monetización del stream</Eyebrow>
              <h1>Configurar pagos y donaciones</h1>
              <p>
                Define cómo recibirá pagos tu canal y cuánto costará cada tipo
                de donación del directo. Por ahora se usa provider mock; luego
                se conectará con BCP QR.
              </p>
            </PageHeading>

            {loading ? (
              <AlertPanel>
                <FiRefreshCw />
                <div>
                  <strong>Cargando pagos</strong>
                  <p>Consultando canal y configuración actual.</p>
                </div>
              </AlertPanel>
            ) : null}

            {error ? (
              <AlertPanel>
                <FiAlertTriangle />
                <div>
                  <strong>Revisa la configuración</strong>
                  <p>{error}</p>
                </div>
              </AlertPanel>
            ) : null}

            {success ? (
              <SuccessBox>
                <FiCheckCircle />
                {success}
              </SuccessBox>
            ) : null}

            <MetricGrid>
              <StatCard
                label="Flash"
                value={`${formatAmount(flashAmount)} Bs`}
                trend="Chat destacado"
              />
              <StatCard
                label="Pantalla"
                value={`${formatAmount(screenAmount)} Bs`}
                trend="Overlay en vivo"
              />
              <StatCard
                label="Épica"
                value={`${formatAmount(epicAmount)} Bs`}
                trend="Confeti + ranking"
              />
              <StatCard
                label="Total demo"
                value={`${totalPreview.toFixed(2)} Bs`}
                trend={activo ? "Pagos activos" : "Pagos pausados"}
              />
            </MetricGrid>

            <Label>Proveedor de pago</Label>
            <Field>
              <FiCreditCard />
              <select
                value={provider}
                onChange={(event) => setProvider(event.target.value as Provider)}
                disabled={loading || saving}
                style={{
                  width: "100%",
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  color: "var(--rb-text)",
                  font: "inherit",
                  fontWeight: 800,
                }}
              >
                <option value="mock">Mock QR para desarrollo</option>
                <option value="bcp">BCP QR</option>
                <option value="bnb">BNB QR</option>
                <option value="libelula">Libélula</option>
              </select>
            </Field>

            <Label>Nombre del titular</Label>
            <Field>
              <FiUser />
              <input
                value={nombreTitular}
                onChange={(event) => setNombreTitular(event.target.value)}
                placeholder="Ej. Denilson Saavedra"
                disabled={loading || saving}
                maxLength={150}
              />
            </Field>

            <Label>Banco o método de cobro</Label>
            <Field>
              <FiCreditCard />
              <input
                value={banco}
                onChange={(event) => setBanco(event.target.value)}
                placeholder="Ej. BCP"
                disabled={loading || saving}
                maxLength={100}
              />
            </Field>

            <Label>Número de cuenta</Label>
            <Field>
              <FiCreditCard />
              <input
                value={numeroCuenta}
                onChange={(event) => setNumeroCuenta(event.target.value)}
                placeholder="Ej. 123456789"
                disabled={loading || saving}
                maxLength={100}
              />
            </Field>

            <Label>Teléfono asociado al pago</Label>
            <Field>
              <FiCreditCard />
              <input
                value={telefonoPago}
                onChange={(event) => setTelefonoPago(event.target.value)}
                placeholder="Ej. 70000000"
                disabled={loading || saving}
                maxLength={30}
              />
            </Field>

            <Label>Commerce ID / identificador de comercio</Label>
            <Field>
              <FiShield />
              <input
                value={commerceId}
                onChange={(event) => setCommerceId(event.target.value)}
                placeholder="Opcional por ahora. BCP lo dará luego."
                disabled={loading || saving}
                maxLength={150}
              />
            </Field>

            <Label>Donación Flash: 1 a 5 Bs</Label>
            <Field>
              <FiDollarSign />
              <input
                type="number"
                min={1}
                max={5}
                step="0.01"
                value={flashAmount}
                onChange={(event) => setFlashAmount(event.target.value)}
                disabled={loading || saving}
              />
            </Field>

            <Label>Donación Pantalla: 6 a 10 Bs</Label>
            <Field>
              <FiDollarSign />
              <input
                type="number"
                min={6}
                max={10}
                step="0.01"
                value={screenAmount}
                onChange={(event) => setScreenAmount(event.target.value)}
                disabled={loading || saving}
              />
            </Field>

            <Label>Donación Épica: 11 a 150 Bs</Label>
            <Field>
              <FiDollarSign />
              <input
                type="number"
                min={11}
                max={150}
                step="0.01"
                value={epicAmount}
                onChange={(event) => setEpicAmount(event.target.value)}
                disabled={loading || saving}
              />
            </Field>

            <Label>Estado de pagos</Label>
            <Field>
              <FiToggleRight />
              <select
                value={activo ? "activo" : "inactivo"}
                onChange={(event) => setActivo(event.target.value === "activo")}
                disabled={loading || saving}
                style={{
                  width: "100%",
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  color: "var(--rb-text)",
                  font: "inherit",
                  fontWeight: 800,
                }}
              >
                <option value="activo">Pagos activos</option>
                <option value="inactivo">Pagos pausados</option>
              </select>
            </Field>

            <AlertPanel>
              <FiShield />
              <div>
                <strong>Importante</strong>
                <p>
                  No guardes contraseña bancaria, PIN ni claves de banca móvil.
                  Aquí solo se configura el método de cobro. La confirmación
                  real se hará por API QR cuando BCP habilite las credenciales.
                </p>
              </div>
            </AlertPanel>

            <ButtonRow>
              <GhostLink to="/creator/streamer/dashboard">Cancelar</GhostLink>

              <PrimaryButton type="submit" disabled={loading || saving}>
                <FiSave /> {saving ? "Guardando..." : "Guardar pagos"}
              </PrimaryButton>
            </ButtonRow>
          </FormCard>
        </CreatorMain>
      </CreatorLayout>
    </RootShell>
  );
}