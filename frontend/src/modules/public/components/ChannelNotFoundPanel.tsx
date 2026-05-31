//frontend/src/modules/public/components/ChannelNotFoundPanel.tsx
import { Link } from "react-router-dom";
import "./ChannelNotFoundPanel.css";

type ChannelNotFoundPanelProps = {
  error: string;
};

export function ChannelNotFoundPanel({ error }: ChannelNotFoundPanelProps) {
  return (
    <section
      className="error-shell"
      aria-label={error || "No se encontró la cuenta"}
    >
      <div className="error-card">
        <div className="error-badges">
            <span className="error-badge">ERROR 404</span>
            <span className="error-badge">ACCOUNT_NOT_FOUND</span>
            <span className="error-badge">ROOTBLEND ALERT</span>
        </div>

        <div className="error-visual">
            <div className="error-orbit">
                <span className="error-dot one" />
                <span className="error-dot two" />
            </div>

            <div className="error-orbit two" />

            <svg
                className="error-svg"
                viewBox="0 0 360 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="No se encontró la cuenta"
            >
            <path
                d="M69 246C78 193 116 160 180 160C244 160 282 193 291 246C293 260 282 272 268 272H92C78 272 67 260 69 246Z"
                fill="var(--rb-panel-strong)"
            />
            <circle cx="180" cy="126" r="66" fill="var(--rb-panel-strong)" />
            <path
                d="M109 128C91 113 82 94 85 74C111 73 131 83 145 102"
                fill="var(--rb-danger)"
                fillOpacity="0.92"
            />
            <path
                d="M251 128C269 113 278 94 275 74C249 73 229 83 215 102"
                fill="var(--rb-danger)"
                fillOpacity="0.92"
            />
            <circle cx="155" cy="121" r="7" fill="var(--rb-bg-deep)" />
            <circle cx="205" cy="121" r="7" fill="var(--rb-bg-deep)" />
            <path
                d="M158 150C171 140 189 140 202 150"
                stroke="var(--rb-bg-deep)"
                strokeWidth="7"
                strokeLinecap="round"
            />
            <circle
                cx="272"
                cy="72"
                r="38"
                fill="var(--rb-danger)"
                fillOpacity="0.20"
                stroke="var(--rb-danger)"
                strokeWidth="5"
            />
            <path
                d="M256 56L288 88M288 56L256 88"
                stroke="var(--rb-danger)"
                strokeWidth="8"
                strokeLinecap="round"
            />
            <rect
                x="52"
                y="248"
                width="256"
                height="44"
                rx="22"
                fill="var(--rb-panel)"
                stroke="var(--rb-danger)"
                strokeOpacity="0.42"
            />
            <text
                x="180"
                y="276"
                textAnchor="middle"
                fill="var(--rb-danger)"
                fontSize="15"
                fontWeight="900"
                fontFamily="Arial, sans-serif"
            >
                cuenta no encontrada
            </text>
          </svg>
        </div>

        <h1 className="error-title">
            Esta cuenta se perdió
            <span>en el multiverso</span>
        </h1>

        <p className="error-text">
            Intentamos buscar el canal, revisar las coordenadas y hasta preguntarle
            al gateway, pero esta cuenta no apareció. Puede que haya sido eliminada,
            aún no esté activa o el enlace esté apuntando a otro universo.
        </p>

        <div className="error-actions">
            <Link className="error-primary" to="/creators">
                Ver cuentas registradas
            </Link>

            <Link className="error-secondary" to="/">
                Volver al inicio
            </Link>
        </div>
      </div>
    </section>
  );
}
