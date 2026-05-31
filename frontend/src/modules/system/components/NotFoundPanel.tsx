//frontend/src/modules/system/components/NotFoundPanel.tsx
import { Link } from "react-router-dom";
import "./NotFoundPanel.css";

export function NotFoundPanel() {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <div className="not-found-badges">
          <span>ERROR 404</span>
          <span>ROUTE_NOT_FOUND</span>
          <span>ROOTBLEND</span>
        </div>

        <div className="not-found-visual">
          <div className="not-found-orbit">
            <span className="not-found-dot dot-one" />
            <span className="not-found-dot dot-two" />
          </div>

          <div className="not-found-orbit orbit-two" />

          <NotFoundIllustration />
        </div>

        <div className="not-found-copy">
          <p className="not-found-kicker">Ruta desaparecida</p>

          <h1>
            Esta página se perdió
            <span>entre streams</span>
          </h1>

          <p>
            La página que buscas no existe, fue movida o el enlace apunta a una
            coordenada que ROOTBLEND ya no reconoce.
          </p>
        </div>

        <NotFoundConsole />

        <div className="not-found-actions">
          <Link className="not-found-primary" to="/">
            Volver al inicio
          </Link>

          <Link className="not-found-secondary" to="/streams">
            Explorar contenido
          </Link>
        </div>
      </section>
    </main>
  );
}

function NotFoundConsole() {
  return (
    <div className="not-found-console">
      <div className="not-found-console-top">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function NotFoundIllustration() {
  return (
    <svg
      className="not-found-svg"
      viewBox="0 0 380 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Página no encontrada"
    >
      <circle
        cx="190"
        cy="150"
        r="96"
        fill="var(--rb-accent-2)"
        fillOpacity="0.20"
      />

      <circle
        cx="190"
        cy="150"
        r="70"
        fill="var(--rb-panel)"
        fillOpacity="0.94"
        stroke="var(--rb-accent)"
        strokeOpacity="0.45"
        strokeWidth="5"
      />

      <path
        d="M138 150C151 119 166 104 190 104C214 104 229 119 242 150C229 181 214 196 190 196C166 196 151 181 138 150Z"
        fill="var(--rb-accent)"
        fillOpacity="0.14"
        stroke="var(--rb-accent)"
        strokeWidth="5"
      />

      <circle cx="190" cy="150" r="22" fill="var(--rb-accent)" />
      <circle cx="190" cy="150" r="10" fill="var(--rb-bg-deep)" />

      <path
        d="M109 76L77 44M77 76L109 44"
        stroke="var(--rb-danger)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <path
        d="M303 246L271 214M271 246L303 214"
        stroke="var(--rb-danger)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <rect
        x="78"
        y="238"
        width="224"
        height="48"
        rx="24"
        fill="var(--rb-panel)"
        fillOpacity="0.92"
        stroke="var(--rb-danger)"
        strokeOpacity="0.46"
        strokeWidth="3"
      />

      <text
        x="190"
        y="269"
        textAnchor="middle"
        fill="var(--rb-danger)"
        fontSize="22"
        fontWeight="900"
        fontFamily="Arial, sans-serif"
      >
        404
      </text>

      <path
        d="M54 126H98M282 126H326M52 176H108M272 176H332"
        stroke="var(--rb-accent)"
        strokeOpacity="0.42"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M124 42H171M209 42H256"
        stroke="var(--rb-danger)"
        strokeOpacity="0.44"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}