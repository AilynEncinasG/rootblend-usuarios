import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiGift,
  FiHeart,
  FiLoader,
  FiMessageCircle,
  FiMonitor,
  FiStar,
  FiX,
  FiZap,
} from "react-icons/fi";
import { getStoredUser } from "../../auth/utils/authStorage";
import {
  createDonationOrder,
  getChannelDonationConfig,
  simulatePaidOrder,
  type ChannelDonationConfig,
  type DonationOrder,
  type DonationOption,
  type DonationType,
  type DonationAlert,
  type StreamDonation,
} from "../services/donationsService";

type Props = {
  idStream: number;
  idCanal: number;
};

function getUserDisplayData() {
  const storedUser = getStoredUser() as
    | {
        id_usuario?: number;
        id?: number;
        user_id?: number;
        nombre_visible?: string;
        nombre?: string;
        username?: string;
        correo?: string;
        email?: string;
      }
    | null;

  const idUsuario =
    storedUser?.id_usuario ?? storedUser?.id ?? storedUser?.user_id ?? null;

  const nombre =
    storedUser?.nombre_visible ||
    storedUser?.nombre ||
    storedUser?.username ||
    storedUser?.correo ||
    storedUser?.email ||
    "Viewer ROOTBLEND";

  return {
    idUsuario,
    nombre,
  };
}

function getDonationIcon(type: DonationType) {
  if (type === "flash") return <FiZap />;
  if (type === "screen") return <FiMonitor />;
  return <FiStar />;
}

function getDonationGradient(type: DonationType) {
  if (type === "flash") {
    return "linear-gradient(135deg, rgba(34,211,238,.24), rgba(59,130,246,.12))";
  }

  if (type === "screen") {
    return "linear-gradient(135deg, rgba(168,85,247,.24), rgba(236,72,153,.12))";
  }

  return "linear-gradient(135deg, rgba(251,191,36,.28), rgba(244,63,94,.13))";
}

function formatAmount(value: number) {
  return `${Number(value || 0).toFixed(2)} Bs`;
}

export default function StreamDonationWidget({ idStream, idCanal }: Props) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ChannelDonationConfig | null>(null);
  const [selectedType, setSelectedType] = useState<DonationType>("flash");
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState<DonationOrder | null>(null);
  const [donation, setDonation] = useState<StreamDonation | null>(null);
  const [alert, setAlert] = useState<DonationAlert | null>(null);

  const [loadingConfig, setLoadingConfig] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedOption = useMemo(() => {
    return config?.donation_types.find((item) => item.type === selectedType);
  }, [config, selectedType]);

  useEffect(() => {
    if (!open) return;

    let active = true;

    async function loadDonationConfig() {
      setLoadingConfig(true);
      setError("");
      setSuccess("");

      try {
        const result = await getChannelDonationConfig(idCanal);

        if (!active) return;

        setConfig(result);

        if (result.donation_types.length > 0) {
          setSelectedType(result.donation_types[0].type);
        }
      } catch (loadError) {
        console.error("DONATION_CONFIG_LOAD_ERROR", loadError);

        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar la configuración de donaciones."
          );
        }
      } finally {
        if (active) {
          setLoadingConfig(false);
        }
      }
    }

    loadDonationConfig();

    return () => {
      active = false;
    };
  }, [open, idCanal]);

  function resetModalState() {
    setOrder(null);
    setDonation(null);
    setAlert(null);
    setMessage("");
    setError("");
    setSuccess("");
    setCreatingOrder(false);
    setConfirmingPayment(false);
  }

  function closeModal() {
    setOpen(false);
    resetModalState();
  }

  async function submitDonation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!config) {
      setError("El canal no tiene configuración de donaciones activa.");
      return;
    }

    if (!message.trim()) {
      setError("Escribe un mensaje para acompañar tu donación.");
      return;
    }

    const viewer = getUserDisplayData();

    setCreatingOrder(true);
    setError("");
    setSuccess("");
    setDonation(null);
    setAlert(null);

    try {
      const result = await createDonationOrder({
        idStream,
        idCanal,
        idUsuarioViewer: viewer.idUsuario,
        nombreViewer: viewer.nombre,
        donationType: selectedType,
        mensaje: message.trim(),
      });

      setOrder(result.order);
      setSuccess("Orden creada. Escanea el QR para completar la donación.");
    } catch (createError) {
      console.error("DONATION_ORDER_CREATE_ERROR", createError);

      setError(
        createError instanceof Error
          ? createError.message
          : "No se pudo crear la orden de donación."
      );
    } finally {
      setCreatingOrder(false);
    }
  }

  async function confirmMockPayment() {
    if (!order) {
      return;
    }

    setConfirmingPayment(true);
    setError("");
    setSuccess("");

    try {
      const result = await simulatePaidOrder(order.id_order);

      setOrder(result.order);
      setDonation(result.donation);
      setAlert(result.alert);
      setSuccess("Pago confirmado. La alerta de donación ya fue creada.");

      window.dispatchEvent(
        new CustomEvent("rootblend-donation-paid", {
          detail: {
            order: result.order,
            donation: result.donation,
            alert: result.alert,
          },
        })
      );
    } catch (confirmError) {
      console.error("DONATION_CONFIRM_ERROR", confirmError);

      setError(
        confirmError instanceof Error
          ? confirmError.message
          : "No se pudo confirmar el pago mock."
      );
    } finally {
      setConfirmingPayment(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid rgba(34,211,238,.45)",
          borderRadius: 999,
          padding: "10px 16px",
          background:
            "linear-gradient(135deg, rgba(34,211,238,.20), rgba(168,85,247,.18))",
          color: "var(--rb-text, #e5f7ff)",
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 18px 40px rgba(34,211,238,.14)",
        }}
      >
        <FiGift /> Donar
      </button>

      {open ? (
        <div
          role="presentation"
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: 18,
            background: "rgba(2,6,23,.72)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(780px, 100%)",
              maxHeight: "92vh",
              overflow: "auto",
              borderRadius: 24,
              border: "1px solid rgba(148,163,184,.25)",
              background:
                "radial-gradient(circle at top left, rgba(34,211,238,.12), transparent 36%), radial-gradient(circle at top right, rgba(168,85,247,.14), transparent 38%), #07111f",
              color: "#e5f7ff",
              boxShadow: "0 30px 90px rgba(0,0,0,.55)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                padding: 22,
                borderBottom: "1px solid rgba(148,163,184,.18)",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#22d3ee",
                    fontWeight: 900,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    fontSize: 12,
                  }}
                >
                  Apoya el directo
                </p>
                <h2 style={{ margin: "6px 0 0", fontSize: 26 }}>
                  Donación por QR
                </h2>
                <p style={{ margin: "6px 0 0", color: "#9fb6c8" }}>
                  Elige un tipo de donación, escribe tu mensaje y genera el QR.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  border: "1px solid rgba(148,163,184,.25)",
                  borderRadius: 14,
                  width: 42,
                  height: 42,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(15,23,42,.85)",
                  color: "#e5f7ff",
                  cursor: "pointer",
                }}
              >
                <FiX />
              </button>
            </div>

            <div style={{ padding: 22 }}>
              {loadingConfig ? (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    padding: 14,
                    borderRadius: 16,
                    background: "rgba(15,23,42,.72)",
                    border: "1px solid rgba(148,163,184,.20)",
                  }}
                >
                  <FiLoader /> Cargando configuración de donaciones...
                </div>
              ) : null}

              {error ? (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: 14,
                    borderRadius: 16,
                    background: "rgba(239,68,68,.12)",
                    border: "1px solid rgba(248,113,113,.35)",
                    color: "#fecaca",
                    marginBottom: 14,
                  }}
                >
                  <FiAlertTriangle />
                  <span>{error}</span>
                </div>
              ) : null}

              {success ? (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    padding: 14,
                    borderRadius: 16,
                    background: "rgba(34,197,94,.12)",
                    border: "1px solid rgba(74,222,128,.35)",
                    color: "#bbf7d0",
                    marginBottom: 14,
                  }}
                >
                  <FiCheckCircle />
                  <span>{success}</span>
                </div>
              ) : null}

              {!order ? (
                <form onSubmit={submitDonation}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 12,
                      marginBottom: 18,
                    }}
                  >
                    {(config?.donation_types || []).map((option: DonationOption) => {
                      const active = selectedType === option.type;

                      return (
                        <button
                          key={option.type}
                          type="button"
                          onClick={() => setSelectedType(option.type)}
                          style={{
                            textAlign: "left",
                            border: active
                              ? "1px solid rgba(34,211,238,.7)"
                              : "1px solid rgba(148,163,184,.22)",
                            borderRadius: 18,
                            padding: 16,
                            background: active
                              ? getDonationGradient(option.type)
                              : "rgba(15,23,42,.62)",
                            color: "#e5f7ff",
                            cursor: "pointer",
                            boxShadow: active
                              ? "0 20px 50px rgba(34,211,238,.14)"
                              : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 10,
                            }}
                          >
                            <strong
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              {getDonationIcon(option.type)}
                              {option.label}
                            </strong>
                            <strong style={{ color: "#67e8f9" }}>
                              {formatAmount(option.amount)}
                            </strong>
                          </div>

                          <p
                            style={{
                              margin: 0,
                              color: "#9fb6c8",
                              lineHeight: 1.45,
                              fontSize: 13,
                            }}
                          >
                            {option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 900,
                    }}
                  >
                    Mensaje para el stream
                  </label>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      border: "1px solid rgba(148,163,184,.24)",
                      borderRadius: 18,
                      padding: 12,
                      background: "rgba(15,23,42,.68)",
                      marginBottom: 16,
                    }}
                  >
                    <FiMessageCircle style={{ marginTop: 5, color: "#22d3ee" }} />
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Ej. Hola crack, buen stream 🔥"
                      maxLength={180}
                      rows={4}
                      style={{
                        width: "100%",
                        resize: "vertical",
                        border: 0,
                        outline: 0,
                        background: "transparent",
                        color: "#e5f7ff",
                        font: "inherit",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ color: "#9fb6c8", fontSize: 14 }}>
                      {selectedOption ? (
                        <>
                          Seleccionado:{" "}
                          <strong style={{ color: "#e5f7ff" }}>
                            {selectedOption.label} -{" "}
                            {formatAmount(selectedOption.amount)}
                          </strong>
                        </>
                      ) : (
                        "Selecciona una donación."
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={creatingOrder || loadingConfig || !config}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        border: 0,
                        borderRadius: 999,
                        padding: "12px 18px",
                        background:
                          "linear-gradient(135deg, #22d3ee, #a855f7)",
                        color: "#06111f",
                        fontWeight: 950,
                        cursor: creatingOrder ? "not-allowed" : "pointer",
                        opacity: creatingOrder ? 0.72 : 1,
                      }}
                    >
                      <FiCreditCard />
                      {creatingOrder ? "Generando QR..." : "Generar QR"}
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(230px, 320px) 1fr",
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 22,
                      border: "1px solid rgba(148,163,184,.24)",
                      background: "rgba(255,255,255,.96)",
                      padding: 14,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {order.qr_image_base64 ? (
                      <img
                        src={order.qr_image_base64}
                        alt="QR de donación"
                        style={{
                          width: "100%",
                          maxWidth: 280,
                          display: "block",
                        }}
                      />
                    ) : (
                      <FiCreditCard size={80} color="#0f172a" />
                    )}
                  </div>

                  <div>
                    <p
                      style={{
                        margin: "0 0 8px",
                        color: "#22d3ee",
                        fontWeight: 900,
                        letterSpacing: ".10em",
                        textTransform: "uppercase",
                        fontSize: 12,
                      }}
                    >
                      Orden #{order.id_order}
                    </p>

                    <h3 style={{ margin: "0 0 10px", fontSize: 24 }}>
                      {formatAmount(order.monto)} · {order.donation_type}
                    </h3>

                    <p style={{ margin: "0 0 14px", color: "#9fb6c8" }}>
                      Escanea este QR con tu app bancaria. En modo mock, presiona
                      confirmar pago para simular el webhook del banco.
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gap: 8,
                        padding: 14,
                        borderRadius: 18,
                        background: "rgba(15,23,42,.70)",
                        border: "1px solid rgba(148,163,184,.20)",
                        marginBottom: 14,
                      }}
                    >
                      <span>
                        Estado:{" "}
                        <strong style={{ color: "#67e8f9" }}>
                          {order.status}
                        </strong>
                      </span>
                      <span>
                        Referencia:{" "}
                        <strong>{order.provider_reference}</strong>
                      </span>
                      <span>
                        Mensaje: <strong>{order.mensaje}</strong>
                      </span>
                    </div>

                    {donation && alert ? (
                      <div
                        style={{
                          padding: 14,
                          borderRadius: 18,
                          background: "rgba(34,197,94,.12)",
                          border: "1px solid rgba(74,222,128,.35)",
                          color: "#bbf7d0",
                          marginBottom: 14,
                        }}
                      >
                        <strong>
                          <FiHeart /> Donación confirmada
                        </strong>
                        <p style={{ margin: "8px 0 0" }}>
                          Se creó la alerta: {alert.title}
                        </p>
                      </div>
                    ) : null}

                    {order.status === "pending" ? (
                      <button
                        type="button"
                        onClick={confirmMockPayment}
                        disabled={confirmingPayment}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          border: 0,
                          borderRadius: 999,
                          padding: "12px 18px",
                          background:
                            "linear-gradient(135deg, #22c55e, #22d3ee)",
                          color: "#06111f",
                          fontWeight: 950,
                          cursor: confirmingPayment ? "not-allowed" : "pointer",
                          opacity: confirmingPayment ? 0.72 : 1,
                        }}
                      >
                        <FiCheckCircle />
                        {confirmingPayment
                          ? "Confirmando..."
                          : "Simular pago confirmado"}
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}