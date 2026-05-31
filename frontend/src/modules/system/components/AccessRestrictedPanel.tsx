//frontend/src/modules/system/components/AccessRestrictedPanel.tsx
import { Link } from "react-router-dom";
import "./AccessRestrictedPanel.css";

export function AccessRestrictedPanel() {
  return (
    <main className="access-restricted-page">
      <section className="access-restricted-card">
        <div className="access-restricted-badges">
          <span>ACCESS_DENIED</span>
          <span>PRIVATE_ZONE</span>
          <span>ROOTBLEND SECURITY</span>
        </div>

        <div className="access-restricted-visual">
          <div className="access-restricted-orbit">
            <span className="access-restricted-dot dot-one" />
            <span className="access-restricted-dot dot-two" />
          </div>

          <div className="access-restricted-orbit orbit-two" />

          <AccessRestrictedIllustration />
        </div>

        <div className="access-restricted-copy">
          <p className="access-restricted-kicker">Zona bloqueada</p>

          <h1>
            Esta puerta está
            <span>cerrada para ti</span>
          </h1>

          <p>
            Esta sección pertenece a herramientas privadas de creador o moderador.
            Para entrar necesitas tener un canal activo, permisos especiales o una
            sesión con el rol correcto.
          </p>
        </div>

        <div className="access-restricted-actions">
          <Link className="access-restricted-primary" to="/creator/activate">
            Activar canal
          </Link>

          <Link className="access-restricted-secondary" to="/">
            Ir al inicio
          </Link>

          <Link className="access-restricted-secondary" to="/streams">
            Explorar streams
          </Link>
        </div>
      </section>
    </main>
  );
}

function AccessRestrictedIllustration() {
  return (
    <svg
      className="access-restricted-svg"
      viewBox="0 0 390 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Acceso restringido"
    >
      <circle
        cx="195"
        cy="152"
        r="110"
        fill="var(--rb-accent-secondary, #a855f7)"
        fillOpacity="0.18"
      />

      <rect
        x="104"
        y="122"
        width="182"
        height="128"
        rx="30"
        fill="var(--rb-panel, #0f172a)"
        fillOpacity="0.96"
        stroke="var(--rb-danger, #fb7185)"
        strokeOpacity="0.48"
        strokeWidth="5"
      />

      <path
        d="M145 122V94C145 66 166 46 195 46C224 46 245 66 245 94V122"
        stroke="var(--rb-accent, #00eaff)"
        strokeWidth="15"
        strokeLinecap="round"
      />

      <circle cx="195" cy="176" r="22" fill="var(--rb-danger, #fb7185)" />

      <path
        d="M195 196V224"
        stroke="var(--rb-danger, #fb7185)"
        strokeWidth="13"
        strokeLinecap="round"
      />

      <path
        d="M136 154H254"
        stroke="var(--rb-text, #e2e8f0)"
        strokeOpacity="0.20"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M138 232H252"
        stroke="var(--rb-accent, #00eaff)"
        strokeOpacity="0.30"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <circle
        cx="284"
        cy="72"
        r="38"
        fill="var(--rb-danger, #fb7185)"
        fillOpacity="0.20"
        stroke="var(--rb-danger, #fb7185)"
        strokeWidth="5"
      />

      <path
        d="M268 56L300 88M300 56L268 88"
        stroke="var(--rb-danger, #fecaca)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M64 124H34M74 162H46M312 134H352M304 176H360"
        stroke="var(--rb-accent, #00eaff)"
        strokeOpacity="0.42"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M74 270H316"
        stroke="var(--rb-danger, #fb7185)"
        strokeOpacity="0.36"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <text
        x="195"
        y="294"
        textAnchor="middle"
        fill="var(--rb-danger, #fecaca)"
        fontSize="17"
        fontWeight="900"
        fontFamily="Arial, sans-serif"
      >
        permisos insuficientes
      </text>
    </svg>
  );
}
