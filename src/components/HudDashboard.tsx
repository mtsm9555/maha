import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { TOOL_RUNNERS, type ToolRunner } from "@/lib/toolRunners";

function useClock() {
  const [t, setT] = useState(() => new Date().toTimeString().split(" ")[0]);
  useEffect(() => {
    const id = setInterval(() => setT(new Date().toTimeString().split(" ")[0]), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function useMatrix(total = 32) {
  const [cells, setCells] = useState<boolean[]>(() => Array(total).fill(false));
  useEffect(() => {
    const id = setInterval(() => {
      setCells((prev) => prev.map((c) => (Math.random() > 0.75 ? !c : c)));
    }, 400);
    return () => clearInterval(id);
  }, []);
  return cells;
}

function RadarPanel() {
  return (
    <section className="hud-panel flex flex-col">
      <div className="hud-panel-header">
        <span>🎯 TARGETING SYSTEM</span>
        <span className="hud-text-glow">34%</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="radar-display">
          <div className="radar-sweep" />
          <div className="radar-circle radar-ring-1" />
          <div className="radar-circle radar-ring-2" />
          <div className="radar-circle radar-ring-3" />
          <div className="radar-crosshair-h" />
          <div className="radar-crosshair-v" />
          <div className="radar-blip" style={{ top: "30%", left: "40%" }} />
          <div className="radar-blip" style={{ top: "65%", left: "70%" }} />
        </div>
      </div>
      <div className="flex justify-between text-[0.7rem] px-3 py-2 border-t border-[var(--hud-border)] opacity-70">
        <span>LAT: 42.3601° N</span>
        <span>LONG: 71.0589° W</span>
      </div>
    </section>
  );
}

function ControlPanel() {
  const [gravity, setGravity] = useState(7.605);
  const [target, setTarget] = useState(657);
  const [velocity, setVelocity] = useState(140);
  return (
    <section className="hud-panel flex flex-col">
      <div className="hud-panel-header"><span>⚙️ CONTROL PANEL</span></div>
      <div className="p-4 space-y-4 text-[0.8rem]">
        <div>
          <label className="block mb-1">GRAVITY [m/s²]: <span className="hud-text-glow">{gravity.toFixed(3)}</span></label>
          <input type="range" min={0} max={20} step={0.001} value={gravity} onChange={(e) => setGravity(+e.target.value)} className="hud-slider" />
        </div>
        <div>
          <label className="block mb-1">TARGET MODE H2: <span className="hud-text-glow">{target}</span></label>
          <input type="range" min={100} max={999} value={target} onChange={(e) => setTarget(+e.target.value)} className="hud-slider" />
        </div>
        <div>
          <label className="block mb-1">IGNITION VELOCITY: <span className="hud-text-glow">{velocity}</span></label>
          <input type="range" min={0} max={300} value={velocity} onChange={(e) => setVelocity(+e.target.value)} className="hud-slider accent-red" />
        </div>
        <button className="hud-btn" onClick={() => toast.success(`⚡ SETTINGS LOCKED — G:${gravity.toFixed(2)} T:${target} V:${velocity}`)}>UPDATE SETTINGS</button>
      </div>
    </section>
  );
}

function ToolsPanel() {
  const [busy, setBusy] = useState<string | null>(null);
  async function fire(runner: ToolRunner) {
    setBusy(runner.key);
    try {
      const out = await runner.run(runner.sampleInput);
      toast.success(`[${runner.label}] ${out.slice(0, 140)}`);
    } catch (err) {
      toast.error(`[${runner.label}] ${err instanceof Error ? err.message : "failed"}`);
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="hud-panel flex flex-col">
      <div className="hud-panel-header">
        <span>🛰 TOOL LINKS</span>
        <Link to="/tools" className="text-[0.7rem] underline opacity-70 hover:opacity-100">MANAGE</Link>
      </div>
      <div className="p-3 grid grid-cols-1 gap-2">
        {TOOL_RUNNERS.map((r) => (
          <button key={r.key} className="hud-btn" disabled={busy === r.key} onClick={() => fire(r)}>
            {busy === r.key ? "// LINKING…" : `▶ ${r.label.toUpperCase()}`}
          </button>
        ))}
      </div>
    </section>
  );
}

function DiagnosticsPanel() {
  const cells = useMatrix(32);
  const bars = useMemo(() => [40, 65, 85, 50, 30], []);
  return (
    <section className="hud-panel flex flex-col">
      <div className="hud-panel-header"><span>📊 DIAGNOSTICS MATRIX</span></div>
      <div className="p-4 space-y-3">
        <div className="matrix-grid">
          {cells.map((on, i) => <div key={i} className={`matrix-cell ${on ? "active" : ""}`} />)}
        </div>
        <div>
          <div className="text-[0.7rem] opacity-70 mb-1">ATMO PRESSURE</div>
          <div className="atmo-bars">
            {bars.map((h, i) => <div key={i} className="atmo-bar" style={{ height: `${h}%` }} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HudDashboard({ center, right }: { center: ReactNode; right: ReactNode }) {
  const clock = useClock();
  const rootRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={rootRef} className="hud-root min-h-screen p-3">
      <div className="hud-frame p-3 min-h-[calc(100vh-1.5rem)] flex flex-col">
        <header className="flex items-center justify-between border-b-2 border-[var(--hud-cyan)] pb-2 mb-3">
          <div className="hud-brand text-xl">⚡ M.A.H.A · REVOLUTIO</div>
          <div className="flex gap-6 text-[0.8rem]">
            <span>SYSTEM STATUS: <span className="hud-text-glow">ONLINE</span></span>
            <Link to="/tools" className="hover:text-white transition-colors">[01] TOOLS</Link>
            <Link to="/logs" className="hover:text-white transition-colors">[02] LOGS</Link>
            <span className="hud-text-glow">{clock}</span>
          </div>
        </header>
        <main className="flex-1 grid gap-3 grid-cols-1 lg:grid-cols-[280px_1fr_320px] min-h-0">
          <div className="flex flex-col gap-3 min-h-0">
            <RadarPanel />
            <ControlPanel />
          </div>
          <section className="hud-panel flex flex-col min-h-0 overflow-hidden">
            <div className="hud-panel-header">
              <span>💬 COMMAND CHANNEL — M.A.H.A</span>
              <span className="opacity-70 text-[0.7rem]">LINK: SECURE</span>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">{center}</div>
          </section>
          <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
            <ToolsPanel />
            <section className="hud-panel flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="hud-panel-header"><span>📋 MISSION LOG</span></div>
              <div className="flex-1 min-h-0 overflow-auto p-3">{right}</div>
            </section>
            <DiagnosticsPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
