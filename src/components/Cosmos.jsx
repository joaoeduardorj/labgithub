// Cenário astronômico decorativo que aparece atrás dos resultados depois do primeiro cálculo.
export default function Cosmos() {
  return (
    <div className="cosmos" aria-hidden="true">
      <div className="nebula" />
      <div className="nebula b" />

      <svg className="constellation" viewBox="0 0 220 120">
        <g stroke="rgba(200, 210, 255, .45)" strokeWidth="1" fill="none">
          <polyline points="10,70 48,58 84,64 112,48 150,30 186,40 206,18"/>
          <polyline points="112,48 120,86 160,96 150,30"/>
        </g>
        <g fill="#fff">
          <circle cx="10" cy="70" r="2"/><circle cx="48" cy="58" r="2.4"/><circle cx="84" cy="64" r="1.8"/>
          <circle cx="112" cy="48" r="2.6"/><circle cx="150" cy="30" r="2.2"/><circle cx="186" cy="40" r="2"/>
          <circle cx="206" cy="18" r="2.8"/><circle cx="120" cy="86" r="2"/><circle cx="160" cy="96" r="2.2"/>
        </g>
      </svg>

      <svg className="planet-small" viewBox="0 0 60 60">
        <defs>
          <radialGradient id="pg-azul" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#bfe9ff"/><stop offset=".5" stopColor="#3f8fe0"/><stop offset="1" stopColor="#14224d"/>
          </radialGradient>
        </defs>
        <circle cx="30" cy="30" r="26" fill="url(#pg-azul)"/>
        <path d="M8 26 Q30 20 52 28" stroke="rgba(255,255,255,.25)" strokeWidth="3" fill="none"/>
        <path d="M10 38 Q30 33 50 40" stroke="rgba(255,255,255,.15)" strokeWidth="2" fill="none"/>
      </svg>

      <svg className="planet-red" viewBox="0 0 40 40">
        <defs>
          <radialGradient id="pg-verm" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#ffc2a1"/><stop offset=".55" stopColor="#d4572f"/><stop offset="1" stopColor="#3a1310"/>
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="17" fill="url(#pg-verm)"/>
      </svg>

      <svg className="planet-ring" viewBox="0 0 200 140">
        <defs>
          <radialGradient id="pg-saturno" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#fff0c9"/><stop offset=".5" stopColor="#e0a85e"/><stop offset="1" stopColor="#4a2a17"/>
          </radialGradient>
          <linearGradient id="pg-anel" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(255,226,170,0)"/><stop offset=".25" stopColor="rgba(255,226,170,.8)"/>
            <stop offset=".75" stopColor="rgba(220,170,255,.7)"/><stop offset="1" stopColor="rgba(220,170,255,0)"/>
          </linearGradient>
        </defs>
        <g transform="rotate(-18 100 70)">
          <path d="M14 70 A86 22 0 0 1 186 70" stroke="url(#pg-anel)" strokeWidth="7" fill="none" opacity=".6"/>
          <circle cx="100" cy="70" r="44" fill="url(#pg-saturno)"/>
          <path d="M60 60 Q100 52 140 62" stroke="rgba(120,60,20,.25)" strokeWidth="5" fill="none"/>
          <path d="M58 78 Q100 72 142 80" stroke="rgba(120,60,20,.2)" strokeWidth="4" fill="none"/>
          <path d="M14 70 A86 22 0 0 0 186 70" stroke="url(#pg-anel)" strokeWidth="7" fill="none"/>
        </g>
      </svg>

      <svg className="galaxy" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="pg-nucleo">
            <stop offset="0" stopColor="#fff"/><stop offset=".25" stopColor="#ffe6f5"/>
            <stop offset=".6" stopColor="rgba(181,171,252,.35)"/><stop offset="1" stopColor="rgba(181,171,252,0)"/>
          </radialGradient>
        </defs>
        <g>
          <ellipse cx="100" cy="100" rx="90" ry="34" fill="url(#pg-nucleo)" opacity=".5"/>
          <path d="M100 100 C130 70 175 85 170 110 C165 135 120 140 100 130" stroke="rgba(200,190,255,.55)" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M100 100 C70 130 25 115 30 90 C35 65 80 60 100 70" stroke="rgba(255,170,220,.5)" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <circle cx="100" cy="100" r="16" fill="url(#pg-nucleo)"/>
        </g>
      </svg>

      <div className="shooting" />
      <div className="shooting b" />
    </div>
  );
}
