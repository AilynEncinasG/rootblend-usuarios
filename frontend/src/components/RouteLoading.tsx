import "./RouteLoading.css";

export default function RouteLoading() {
  return (
    <main className="route-loading-page">
        <section className="route-loading-card">
            <div className="route-loading-badges">
            <span>ROOTBLEND</span>
            <span>LOADING_ROUTE</span>
            <span>PLEASE WAIT</span>
            </div>

            <div className="route-loading-visual">
            <div className="route-loading-orbit">
                <span className="route-loading-dot dot-one" />
                <span className="route-loading-dot dot-two" />
                <span className="route-loading-dot dot-three" />
            </div>

            <div className="route-loading-orbit orbit-two" />

            <RouteLoadingIllustration />
            </div>

            <div className="route-loading-copy">
            <p className="route-loading-kicker">Preparando experiencia</p>

            <h1>
                Cargando
                <span>ROOTBLEND</span>
            </h1>

            <p>
                Estamos conectando rutas, servicios y pantallas para dejar todo listo.
            </p>
            </div>

            <RouteLoadingBar />
        </section>
    </main>
  );
}

function RouteLoadingBar() {
  return (
    <div className="route-loading-progress" aria-label="Cargando ROOTBLEND">
      <span />
    </div>
  );
}

function RouteLoadingIllustration() {
  return (
    <svg
      className="route-loading-svg"
      viewBox="0 0 390 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cargando ROOTBLEND"
    >
      <circle cx="195" cy="152" r="110" fill="rgba(0, 234, 255, 0.12)" />

      <rect
        x="92"
        y="78"
        width="206"
        height="142"
        rx="34"
        fill="rgba(15, 23, 42, 0.96)"
        stroke="rgba(0, 234, 255, 0.42)"
        strokeWidth="5"
      />

      <path
        d="M130 124H260"
        stroke="rgba(248, 250, 252, 0.20)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M130 154H226"
        stroke="rgba(248, 250, 252, 0.20)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M130 184H250"
        stroke="rgba(248, 250, 252, 0.20)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <circle cx="268" cy="114" r="12" fill="#00eaff" />
      <circle cx="246" cy="154" r="12" fill="#fb7185" />
      <circle cx="270" cy="184" r="12" fill="#a855f7" />

      <path
        d="M152 236H238"
        stroke="rgba(226, 232, 240, 0.78)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <path
        d="M195 220V250"
        stroke="rgba(226, 232, 240, 0.78)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <path
        d="M74 264H316"
        stroke="rgba(0, 234, 255, 0.34)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M104 264C112 242 126 242 134 264C142 286 156 286 164 264C172 242 186 242 194 264C202 286 216 286 224 264C232 242 246 242 254 264"
        stroke="#fb7185"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <text
        x="195"
        y="294"
        textAnchor="middle"
        fill="#bae6fd"
        fontSize="17"
        fontWeight="900"
        fontFamily="Arial, sans-serif"
      >
        cargando ruta
      </text>
    </svg>
  );
}