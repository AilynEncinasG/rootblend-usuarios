//frontend/src/modules/podcasts/components/PodcastErrorPanel.tsx
import { Link } from "react-router-dom";
import "./PodcastErrorPanel.css";

type PodcastErrorPanelProps = {
  message: string;
  podcastId?: string;
  onRetry: () => void;
};

export function PodcastErrorPanel({
  onRetry,
}: PodcastErrorPanelProps) {
  return (
    <section className="podcast-error-shell">
      <div className="podcast-error-card">
        <div className="podcast-error-badges">
          <span>PODCAST_SERVICE</span>
          <span>PODCAST_NOT_FOUND</span>
          <span>ROOTBLEND</span>
        </div>

        <div className="podcast-error-visual">
          <div className="podcast-error-pulse" />
          <div className="podcast-error-orbit">
            <span className="podcast-error-dot one" />
            <span className="podcast-error-dot two" />
          </div>

          <PodcastErrorIllustration />
        </div>

        <div className="podcast-error-copy">
          <p className="podcast-error-kicker">Podcast perdido</p>

          <h1>
            No pudimos abrir
            <span>este podcast</span>
          </h1>

          <p>
            El episodio o podcast que intentas escuchar no respondió desde el
            servicio. Puede que haya sido eliminado, esté inactivo o que
            podcasts-service no esté disponible en este momento.
          </p>
        </div>

        <div className="podcast-error-actions">
          <button type="button" onClick={onRetry}>
            Reintentar carga
          </button>

          <Link to="/podcasts">Volver a podcasts</Link>

          <Link to="/">Ir al inicio</Link>
        </div>
      </div>
    </section>
  );
}

function PodcastErrorIllustration() {
  return (
    <svg
      className="podcast-error-svg"
      viewBox="0 0 380 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Podcast no disponible"
    >
      <circle cx="190" cy="150" r="104" fill="var(--rb-accent-2)" opacity="0.18" />

      <rect
        x="116"
        y="76"
        width="148"
        height="148"
        rx="42"
        fill="var(--rb-panel)"
        stroke="var(--rb-danger)"
        strokeOpacity="0.48"
        strokeWidth="5"
      />

      <path
        d="M142 158C142 130 162 108 190 108C218 108 238 130 238 158"
        stroke="var(--rb-accent)"
        strokeWidth="13"
        strokeLinecap="round"
      />

      <rect x="126" y="152" width="28" height="58" rx="14" fill="var(--rb-danger)" />
      <rect x="226" y="152" width="28" height="58" rx="14" fill="var(--rb-danger)" />

      <path
        d="M172 164V198M190 150V212M208 164V198"
        stroke="var(--rb-text-strong)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      <path
        d="M104 254H276"
        stroke="var(--rb-accent)"
        strokeOpacity="0.42"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M124 254C132 230 146 230 154 254C162 278 176 278 184 254C192 230 206 230 214 254C222 278 236 278 244 254"
        stroke="var(--rb-danger)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <circle
        cx="282"
        cy="78"
        r="36"
        fill="var(--rb-danger)"
        fillOpacity="0.20"
        stroke="var(--rb-danger)"
        strokeWidth="5"
      />

      <path
        d="M267 63L297 93M297 63L267 93"
        stroke="var(--rb-danger)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M62 118H98M60 158H88M284 178H326M292 214H336"
        stroke="var(--rb-danger)"
        strokeOpacity="0.46"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <text
        x="190"
        y="282"
        textAnchor="middle"
        fill="var(--rb-danger)"
        fontSize="17"
        fontWeight="900"
        fontFamily="Arial, sans-serif"
      >
        podcast no disponible
      </text>
    </svg>
  );
}
