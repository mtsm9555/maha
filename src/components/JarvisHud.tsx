/**
 * Decorative JARVIS-style HUD:
 * concentric rotating rings, tick marks, hex core, corner brackets, telemetry.
 * Purely visual — pointer-events: none.
 */
export function JarvisHud({ speaking = false }: { speaking?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* corner brackets */}
      <Corners />

      {/* scanline */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background: "linear-gradient(90deg, transparent, #00e5ff, transparent)",
          animation: "hud-scan 6s linear infinite",
        }}
      />

      {/* central reactor */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ArcReactor speaking={speaking} />
      </div>

      {/* side telemetry */}
      <Telemetry side="left" />
      <Telemetry side="right" />

      <style>{`
        @keyframes hud-scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes hud-blink {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ArcReactor({ speaking }: { speaking: boolean }) {
  const dur = speaking ? "6s" : "20s";
  return (
    <svg
      width="520"
      height="520"
      viewBox="-260 -260 520 520"
      className="opacity-40"
      style={{ filter: "drop-shadow(0 0 18px rgba(0,229,255,0.35))" }}
    >
      {/* outer dashed ring */}
      <g style={{ transformOrigin: "center", animation: `hud-rot ${dur} linear infinite` }}>
        <circle r="240" fill="none" stroke="#00e5ff" strokeWidth="1" strokeDasharray="2 6" />
        <circle r="240" cx="0" cy="0" fill="#00e5ff" r-attr="4">
          <animate attributeName="cx" values="240;-240;240" dur="12s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* mid ring with tick marks */}
      <g style={{ transformOrigin: "center", animation: `hud-rot-rev 30s linear infinite` }}>
        <circle r="200" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
        {Array.from({ length: 60 }).map((_, i) => {
          const long = i % 5 === 0;
          return (
            <line
              key={i}
              x1="0"
              y1={long ? -210 : -204}
              x2="0"
              y2="-200"
              stroke="#00e5ff"
              strokeWidth={long ? 1.5 : 0.8}
              opacity={long ? 0.9 : 0.5}
              transform={`rotate(${i * 6})`}
            />
          );
        })}
      </g>

      {/* segmented arcs */}
      <g style={{ transformOrigin: "center", animation: `hud-rot 40s linear infinite` }}>
        <path d="M -160 0 A 160 160 0 0 1 -40 -155" fill="none" stroke="#00e5ff" strokeWidth="2" opacity="0.7" />
        <path d="M 160 0 A 160 160 0 0 1 40 155" fill="none" stroke="#00e5ff" strokeWidth="2" opacity="0.7" />
        <path d="M 40 -155 A 160 160 0 0 1 160 0" fill="none" stroke="#00e5ff" strokeWidth="0.6" opacity="0.5" strokeDasharray="4 4" />
        <path d="M -40 155 A 160 160 0 0 1 -160 0" fill="none" stroke="#00e5ff" strokeWidth="0.6" opacity="0.5" strokeDasharray="4 4" />
      </g>

      {/* hex core */}
      <g style={{ transformOrigin: "center", animation: `hud-rot-rev 18s linear infinite` }}>
        <polygon
          points="0,-110 95,-55 95,55 0,110 -95,55 -95,-55"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="1.5"
          opacity="0.85"
        />
        <polygon
          points="0,-70 60,-35 60,35 0,70 -60,35 -60,-35"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="1"
          opacity="0.6"
        />
      </g>

      {/* inner glow core */}
      <circle r="42" fill="url(#core)" />
      <circle r="42" fill="none" stroke="#00e5ff" strokeWidth="1.5" />
      <circle r="8" fill="#e6fbff" opacity="0.9">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
      </circle>

      <defs>
        <radialGradient id="core">
          <stop offset="0%" stopColor="#e6fbff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#00e5ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <style>{`
        @keyframes hud-rot { to { transform: rotate(360deg); } }
        @keyframes hud-rot-rev { to { transform: rotate(-360deg); } }
      `}</style>
    </svg>
  );
}

function Corners() {
  const base =
    "absolute h-6 w-6 border-primary/70";
  return (
    <>
      <span className={`${base} top-3 left-3 border-t border-l`} />
      <span className={`${base} top-3 right-3 border-t border-r`} />
      <span className={`${base} bottom-3 left-3 border-b border-l`} />
      <span className={`${base} bottom-3 right-3 border-b border-r`} />
    </>
  );
}

function Telemetry({ side }: { side: "left" | "right" }) {
  const items = side === "left"
    ? ["SYS.CORE 98.2%", "NET LINK OK", "AI ▲ HERMES", "VOX ENC 256"]
    : ["LAT 12ms", "MEM 41%", "TASKS 7", "TOOLS 5"];
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-2 label-mono text-[10px] ${
        side === "left" ? "left-4 items-start" : "right-4 items-end"
      }`}
    >
      {items.map((t, i) => (
        <div key={t} className="flex items-center gap-2">
          {side === "right" && (
            <span className="h-1 w-1 rounded-full bg-primary" style={{ animation: `hud-blink 1.6s ${i * 0.2}s infinite` }} />
          )}
          <span className="text-primary/80">{t}</span>
          {side === "left" && (
            <span className="h-1 w-1 rounded-full bg-primary" style={{ animation: `hud-blink 1.6s ${i * 0.2}s infinite` }} />
          )}
        </div>
      ))}
    </div>
  );
}
