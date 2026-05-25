import { Link } from "react-router-dom";
import "./StreamErrorPanel.css";

type StreamErrorPanelProps = {
  message: string;
  streamId?: string;
  onRetry: () => void;
};

export function StreamErrorPanel({
  onRetry,
}: StreamErrorPanelProps) {
  return (
    <section className="stream-error-shell">
      <div className="stream-error-card">
        <div className="stream-error-badges">
          <span>STREAM_SERVICE</span>
          <span>SIGNAL_LOST</span>
          <span>ROOTBLEND LIVE</span>
        </div>

        <div className="stream-error-visual">
          <div className="stream-error-signal-ring" />
          <div className="stream-error-signal-ring two" />

          <StreamErrorIllustration />
        </div>

        <div className="stream-error-copy">
          <p className="stream-error-kicker">Transmisión no disponible</p>

          <h1>
            La señal del stream
            <span>se perdió</span>
          </h1>

          <p>
            Intentamos conectar con la transmisión, pero el stream no respondió.
            Puede que haya finalizado, que no exista o que el servicio de canales
            no esté disponible en este momento.
          </p>
        </div>

        <div className="stream-error-console">
          <div className="stream-error-console-top">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="stream-error-actions">
          <button type="button" onClick={onRetry}>
            Reintentar señal
          </button>

          <Link to="/streams">Volver a transmisiones</Link>

          <Link to="/">Ir al inicio</Link>
        </div>
      </div>
    </section>
  );
}

function StreamErrorIllustration() {
  return (
    <svg
      className="stream-error-svg"
      viewBox="0 0 390 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Stream no disponible"
    >
      <circle cx="195" cy="152" r="108" fill="rgba(0, 234, 255, 0.12)" />

      <rect
        x="88"
        y="78"
        width="214"
        height="142"
        rx="30"
        fill="rgba(15, 23, 42, 0.96)"
        stroke="rgba(0, 234, 255, 0.42)"
        strokeWidth="5"
      />

      <rect
        x="110"
        y="100"
        width="170"
        height="92"
        rx="20"
        fill="rgba(2, 6, 23, 0.94)"
        stroke="rgba(251, 113, 133, 0.34)"
        strokeWidth="4"
      />

      <path
        d="M137 147H253"
        stroke="#fb7185"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="14 14"
      />

      <path
        d="M148 126L242 168"
        stroke="#00eaff"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M242 126L148 168"
        stroke="#00eaff"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M156 226H234"
        stroke="rgba(226, 232, 240, 0.78)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <path
        d="M195 220V248"
        stroke="rgba(226, 232, 240, 0.78)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <circle
        cx="292"
        cy="72"
        r="38"
        fill="rgba(127, 29, 29, 0.88)"
        stroke="#fb7185"
        strokeWidth="5"
      />

      <path
        d="M276 56L308 88M308 56L276 88"
        stroke="#fecaca"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M66 136H46M68 168H34M322 138H350M316 172H358"
        stroke="rgba(0, 234, 255, 0.42)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M84 260H306"
        stroke="rgba(251, 113, 133, 0.36)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <text
        x="195"
        y="286"
        textAnchor="middle"
        fill="#fecaca"
        fontSize="17"
        fontWeight="900"
        fontFamily="Arial, sans-serif"
      >
        señal no disponible
      </text>
    </svg>
  );
}