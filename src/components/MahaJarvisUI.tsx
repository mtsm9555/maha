import { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";

const DEMO_SCRIPT = [
  { role: "user", content: "Status report." },
  { role: "assistant", content: "All systems nominal. Two items pending before noon." },
  { role: "user", content: "Push them to one o'clock." },
  { role: "assistant", content: "Rescheduled. I'll notify you at thirteen-hundred." },
];

const TOOLS = [
  { id: "memory", label: "MEMORY", y: 40 },
  { id: "calendar", label: "CALENDAR", y: 110 },
  { id: "search", label: "SEARCH", y: 180 },
  { id: "tasks", label: "TASKS", y: 250 },
  { id: "voice", label: "VOICE I/O", y: 320 },
];

// which tools light up per demo step, to simulate real lookups
const ACTIVE_MAP = [["calendar", "memory"], [], ["tasks", "calendar"], []];

type Msg = { role: "user" | "assistant"; content: string };

export default function MahaJarvisUI() {
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [clock, setClock] = useState("");
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().slice(0, 8));
    tick();
    const iv = setInterval(tick, 1000);
    return () => {
      clearInterval(iv);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleMicPress() {
    if (status !== "idle") return;
    if (stepIndex >= DEMO_SCRIPT.length) {
      setMessages([]);
      setStepIndex(0);
      return;
    }
    const userTurn = DEMO_SCRIPT[stepIndex];
    setStatus("listening");
    setActiveTools(["voice"]);

    timeoutRef.current = setTimeout(() => {
      setMessages((m) => [...m, userTurn]);
      setStatus("thinking");
      setActiveTools(ACTIVE_MAP[stepIndex] || []);

      timeoutRef.current = setTimeout(() => {
        const assistantTurn = DEMO_SCRIPT[stepIndex + 1];
        setStatus("speaking");
        setActiveTools(["voice"]);
        setMessages((m) => [...m, assistantTurn]);

        timeoutRef.current = setTimeout(() => {
          setStatus("idle");
          setActiveTools([]);
          setStepIndex(stepIndex + 2);
        }, 1700);
      }, 1200);
    }, 1300);
  }

  const statusLabel = {
    idle: "STANDBY",
    listening: "LISTENING",
    thinking: "PROCESSING",
    speaking: "RESPONDING",
  }[status];

  const ringColor = status === "thinking" ? "#FF9F45" : "#4FD8FF";

  return (
    <div
      style={{
        minHeight: 700,
        background: "#05080C",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 16,
        padding: 20,
        fontFamily: "'Share Tech Mono', monospace",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Share+Tech+Mono&display=swap');
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes spin-fast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-core { 0%,100% { opacity:0.8; transform:scale(1);} 50% { opacity:1; transform:scale(1.06);} }
        @keyframes radar-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scanline { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
        @keyframes flicker { 0%,100% {opacity:1;} 92% {opacity:1;} 93% {opacity:0.4;} 94% {opacity:1;} }
        @keyframes bar-bounce { 0%,100% { height:6px; } 50% { height:26px; } }
        @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
        @keyframes node-pulse { 0%,100% { r: 4; opacity: 1; } 50% { r: 6; opacity: 0.6; } }
        @keyframes dash-flow { to { stroke-dashoffset: -20; } }
        .maha-log::-webkit-scrollbar { width: 3px; }
        .maha-log::-webkit-scrollbar-thumb { background: #16232E; }
      `}</style>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", opacity: 0.06 }}>
        <div style={{ width: "100%", height: "40%", background: "linear-gradient(180deg, transparent, #4FD8FF, transparent)", animation: "scanline 5s linear infinite" }} />
      </div>

      {/* MAIN HUD */}
      <div style={{ width: 380, position: "relative", zIndex: 1 }}>
        {[
          { top: 0, left: 0, borderTop: "2px solid #4FD8FF", borderLeft: "2px solid #4FD8FF" },
          { top: 0, right: 0, borderTop: "2px solid #4FD8FF", borderRight: "2px solid #4FD8FF" },
          { bottom: 0, left: 0, borderBottom: "2px solid #4FD8FF", borderLeft: "2px solid #4FD8FF" },
          { bottom: 0, right: 0, borderBottom: "2px solid #4FD8FF", borderRight: "2px solid #4FD8FF" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 22, height: 22, opacity: 0.6, ...s }} />
        ))}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 6, padding: "0 4px" }}>
          <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: 20, color: "#E8F6FF", letterSpacing: 4 }}>M.A.H.A</span>
          <span style={{ fontSize: 11, color: "#4C6270", letterSpacing: 1 }}>{clock}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#4C6270", marginBottom: 8, letterSpacing: 1, padding: "0 4px" }}>
          <span>SYS.ONLINE</span>
          <span style={{ color: ringColor, animation: status !== "idle" ? "flicker 2s infinite" : "none" }}>[{statusLabel}]</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 240, height: 240, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", border: `1px solid ${ringColor}33`, borderTop: `1px solid ${ringColor}`, animation: "spin-slow 8s linear infinite" }} />
            <div style={{ position: "absolute", width: 190, height: 190, borderRadius: "50%", border: `1px dashed ${ringColor}55`, animation: "spin-rev 12s linear infinite" }} />
            <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", border: `1.5px solid ${ringColor}`, borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", animation: `spin-fast ${status === "thinking" ? 1.2 : status === "listening" ? 3 : 6}s linear infinite` }} />

            {status === "listening" && (
              <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", overflow: "hidden", animation: "radar-sweep 2s linear infinite" }}>
                <div style={{ width: "50%", height: "50%", background: `linear-gradient(90deg, transparent, ${ringColor}55)`, transformOrigin: "bottom right" }} />
              </div>
            )}

            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", width: 2, height: i % 6 === 0 ? 10 : 5, background: `${ringColor}66`, top: 6, left: "50%", transformOrigin: "50% 114px", transform: `translateX(-50%) rotate(${i * 15}deg)` }} />
            ))}

            <div style={{ width: 78, height: 78, borderRadius: "50%", background: `radial-gradient(circle, ${ringColor}dd, ${ringColor}22 70%)`, boxShadow: `0 0 ${status === "idle" ? 20 : 42}px ${ringColor}88`, animation: "pulse-core 2.4s ease-in-out infinite" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28, marginBottom: 20 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ width: 2, background: ringColor, opacity: status === "speaking" ? 0.9 : 0.25, height: status === "speaking" ? undefined : 4, animation: status === "speaking" ? `bar-bounce ${0.5 + (i % 5) * 0.08}s ease-in-out infinite` : "none", animationDelay: `${i * 0.03}s` }} />
            ))}
          </div>

          <div className="maha-log" style={{ width: "100%", flex: 1, minHeight: 130, maxHeight: 170, overflowY: "auto", border: "1px solid #16232E", background: "rgba(79,216,255,0.02)", padding: "10px 12px", fontSize: 12.5, lineHeight: 1.7, marginBottom: 22 }}>
            {messages.length === 0 && <div style={{ color: "#2E3D48" }}>{"// awaiting input"}</div>}
            {messages.map((m, i) => (
              <div key={i} style={{ animation: "fade-in 0.3s ease", color: m.role === "user" ? "#8FA5B0" : "#4FD8FF" }}>
                <span style={{ color: m.role === "user" ? "#4C6270" : "#FF9F45" }}>{m.role === "user" ? "> " : "» "}</span>
                {m.content}
              </div>
            ))}
          </div>

          <button
            onClick={handleMicPress}
            aria-label="Talk to Maha"
            style={{ width: 60, height: 60, borderRadius: "50%", border: `1px solid ${status === "idle" ? "#16232E" : ringColor}`, background: "#0A0F14", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.3s, transform 0.15s" }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Mic size={20} color={status === "idle" ? "#4C6270" : ringColor} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* TOOL GRAPH SIDE PANEL */}
      <div style={{ width: 200, position: "relative", zIndex: 1, paddingTop: 6 }}>
        <div style={{ fontSize: 10, color: "#4C6270", letterSpacing: 1, marginBottom: 14, borderBottom: "1px solid #16232E", paddingBottom: 8 }}>
          CONNECTED SYSTEMS
        </div>

        <svg width="200" height="380" style={{ overflow: "visible" }}>
          {/* spine */}
          <line x1="18" y1="40" x2="18" y2="320" stroke="#16232E" strokeWidth="1" />
          {TOOLS.map((t) => {
            const isActive = activeTools.includes(t.id);
            const color = isActive ? ringColor : "#3A4B57";
            return (
              <g key={t.id}>
                <path
                  d={`M18,${t.y} C50,${t.y} 40,${t.y} 60,${t.y}`}
                  stroke={color}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray={isActive ? "4 3" : "none"}
                  style={isActive ? { animation: "dash-flow 0.6s linear infinite" } : undefined}
                />
                <circle cx="18" cy={t.y} r="4" fill={color} style={isActive ? { animation: "node-pulse 1s ease-in-out infinite" } : undefined} />
              </g>
            );
          })}
        </svg>

        <div style={{ marginTop: -380, marginLeft: 60 }}>
          {TOOLS.map((t) => {
            const isActive = activeTools.includes(t.id);
            return (
              <div key={t.id} style={{ position: "relative", top: t.y - 6, display: "flex", flexDirection: "column", gap: 1 }}>
                <span style={{ fontSize: 11, letterSpacing: 1, color: isActive ? "#E8F6FF" : "#5C7A8C", animation: isActive ? "flicker 1.5s infinite" : "none" }}>
                  {t.label}
                </span>
                <span style={{ fontSize: 9, color: isActive ? ringColor : "#2E3D48" }}>
                  {isActive ? "ACTIVE" : "READY"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
