import { useEffect, useMemo, useRef, useState } from "react";
import { FiHeart, FiMonitor, FiStar, FiZap } from "react-icons/fi";
import {
  getStreamDonationAlerts,
  markDonationAlertShown,
  type DonationAlert,
} from "../services/donationsService";

type Props = {
  idStream: number;
};

function getIcon(type: DonationAlert["alert_type"]) {
  if (type === "flash") return <FiZap />;
  if (type === "screen") return <FiMonitor />;
  return <FiStar />;
}

function getTheme(type: DonationAlert["alert_type"]) {
  if (type === "flash") {
    return {
      label: "DONACIÓN FLASH",
      gradient: "linear-gradient(135deg, rgba(34,211,238,.94), rgba(59,130,246,.92))",
      shadow: "0 0 50px rgba(34,211,238,.40)",
      size: "small",
    };
  }

  if (type === "screen") {
    return {
      label: "DONACIÓN EN PANTALLA",
      gradient: "linear-gradient(135deg, rgba(168,85,247,.95), rgba(236,72,153,.92))",
      shadow: "0 0 70px rgba(168,85,247,.45)",
      size: "medium",
    };
  }

  return {
    label: "DONACIÓN ÉPICA",
    gradient: "linear-gradient(135deg, rgba(250,204,21,.98), rgba(244,63,94,.94), rgba(168,85,247,.95))",
    shadow: "0 0 95px rgba(250,204,21,.46)",
    size: "large",
  };
}

function getAmount(alert: DonationAlert) {
  const monto = alert.donation?.monto;

  if (typeof monto === "number") {
    return `${monto.toFixed(2)} Bs`;
  }

  return "";
}

export default function StreamDonationOverlay({ idStream }: Props) {
  const [queue, setQueue] = useState<DonationAlert[]>([]);
  const [current, setCurrent] = useState<DonationAlert | null>(null);
  const seenRef = useRef<Set<number>>(new Set());

  const theme = useMemo(() => {
    return current ? getTheme(current.alert_type) : null;
  }, [current]);

  function enqueueAlerts(alerts: DonationAlert[]) {
    const freshAlerts = alerts.filter((alert) => {
      if (seenRef.current.has(alert.id_alert)) {
        return false;
      }

      seenRef.current.add(alert.id_alert);
      return true;
    });

    if (freshAlerts.length > 0) {
      setQueue((oldQueue) => [...oldQueue, ...freshAlerts]);
    }
  }

  useEffect(() => {
    function handleDonationPaid(event: Event) {
      const customEvent = event as CustomEvent<{
        alert?: DonationAlert;
      }>;

      if (customEvent.detail?.alert) {
        enqueueAlerts([customEvent.detail.alert]);
      }
    }

    window.addEventListener("rootblend-donation-paid", handleDonationPaid);

    return () => {
      window.removeEventListener("rootblend-donation-paid", handleDonationPaid);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function pollAlerts() {
      try {
        const alerts = await getStreamDonationAlerts(idStream, {
          onlyUnshown: true,
          limit: 5,
        });

        if (!active) return;

        enqueueAlerts(alerts);
      } catch (error) {
        console.error("DONATION_ALERTS_POLL_ERROR", error);
      }
    }

    pollAlerts();

    const intervalId = window.setInterval(pollAlerts, 3500);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [idStream]);

  useEffect(() => {
    if (current || queue.length === 0) {
      return;
    }

    const [nextAlert, ...rest] = queue;

    setCurrent(nextAlert);
    setQueue(rest);
  }, [current, queue]);

  useEffect(() => {
    if (!current) {
      return;
    }

    const duration =
      current.alert_type === "epic"
        ? 9000
        : current.alert_type === "screen"
          ? 7000
          : 5200;

    const timeoutId = window.setTimeout(async () => {
      const alertToMark = current;

      setCurrent(null);

      try {
        await markDonationAlertShown(alertToMark.id_alert);
      } catch (error) {
        console.error("DONATION_ALERT_MARK_SHOWN_ERROR", error);
      }
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [current]);

  if (!current || !theme) {
    return null;
  }

  const isEpic = current.alert_type === "epic";
  const isFlash = current.alert_type === "flash";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 7000,
        pointerEvents: "none",
        display: "grid",
        placeItems: isFlash ? "end center" : "center",
        padding: isFlash ? "0 20px 84px" : 24,
      }}
    >
      {isEpic ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(250,204,21,.22), transparent 22%), radial-gradient(circle at 80% 18%, rgba(34,211,238,.18), transparent 22%), radial-gradient(circle at 50% 85%, rgba(236,72,153,.20), transparent 24%)",
            animation: "rootblendDonationPulse 1.6s ease-in-out infinite alternate",
          }}
        />
      ) : null}

      <style>
        {`
          @keyframes rootblendDonationEnter {
            0% { transform: translateY(26px) scale(.88); opacity: 0; filter: blur(10px); }
            55% { transform: translateY(-4px) scale(1.04); opacity: 1; filter: blur(0); }
            100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
          }

          @keyframes rootblendDonationPulse {
            from { opacity: .55; transform: scale(1); }
            to { opacity: 1; transform: scale(1.04); }
          }

          @keyframes rootblendDonationGlow {
            0%, 100% { box-shadow: ${theme.shadow}; }
            50% { box-shadow: ${theme.shadow}, 0 0 120px rgba(255,255,255,.25); }
          }

          @keyframes rootblendDonationShine {
            from { transform: translateX(-130%) rotate(12deg); }
            to { transform: translateX(160%) rotate(12deg); }
          }
        `}
      </style>

      <div
        style={{
          position: "relative",
          width: isEpic ? "min(820px, 94vw)" : isFlash ? "min(520px, 92vw)" : "min(680px, 92vw)",
          borderRadius: isEpic ? 34 : 26,
          padding: isEpic ? 28 : 22,
          color: "#06111f",
          background: theme.gradient,
          boxShadow: theme.shadow,
          overflow: "hidden",
          animation:
            "rootblendDonationEnter .55s cubic-bezier(.2,.9,.2,1), rootblendDonationGlow 1.7s ease-in-out infinite",
          border: "1px solid rgba(255,255,255,.45)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40%",
            bottom: "-40%",
            left: 0,
            width: "38%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.50), transparent)",
            animation: "rootblendDonationShine 1.7s ease-in-out infinite",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: isEpic ? 20 : 14,
          }}
        >
          <div
            style={{
              width: isEpic ? 74 : 58,
              height: isEpic ? 74 : 58,
              borderRadius: 22,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,.38)",
              color: "#06111f",
              fontSize: isEpic ? 36 : 28,
              flex: "0 0 auto",
            }}
          >
            {getIcon(current.alert_type)}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontWeight: 1000,
                  fontSize: isEpic ? 15 : 12,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                }}
              >
                {theme.label}
              </span>

              {getAmount(current) ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 999,
                    padding: "5px 10px",
                    background: "rgba(6,17,31,.18)",
                    fontWeight: 1000,
                  }}
                >
                  <FiHeart />
                  {getAmount(current)}
                </span>
              ) : null}
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: isEpic ? "clamp(30px, 5vw, 58px)" : "clamp(22px, 3vw, 34px)",
                lineHeight: 1,
                fontWeight: 1000,
                letterSpacing: "-.04em",
              }}
            >
              {current.title}
            </h2>

            <p
              style={{
                margin: "10px 0 0",
                fontSize: isEpic ? "clamp(18px, 2.5vw, 28px)" : "clamp(15px, 2vw, 20px)",
                fontWeight: 850,
                color: "rgba(6,17,31,.82)",
              }}
            >
              {current.message || "Gracias por apoyar el directo."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}