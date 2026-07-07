import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexusAI Agent OS — Maha" },
      { name: "description", content: "Agent orchestrator dashboard: task concurrency, compute load, and model vector alignment." },
      { property: "og:title", content: "NexusAI Agent OS — Maha" },
      { property: "og:description", content: "Agent orchestrator dashboard: task concurrency, compute load, and model vector alignment." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 md:p-12 text-gray-100" style={{ backgroundColor: "#0b0c10", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Toaster position="bottom-right" theme="dark" />

      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold tracking-tighter text-sm">N⚡</div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">NexusAI Agent OS</h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex gap-4 text-xs font-mono text-gray-500">
            <Link to="/chat" className="hover:text-white transition">CHAT</Link>
            <Link to="/tools" className="hover:text-white transition">TOOLS</Link>
            <Link to="/logs" className="hover:text-white transition">LOGS</Link>
          </nav>
          <div className="flex items-center gap-2 bg-[#161922] px-3 py-1.5 rounded-full border border-gray-800 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Agent Cluster Active
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl flex-grow">
        <TaskEngineCard />
        <ComputeGaugeCard />
        <VectorAlignmentCard />
      </main>

      <footer className="w-full max-w-6xl mt-8 pt-4 border-t border-gray-900 flex justify-between items-center text-[11px] font-mono text-gray-600">
        <span>Systems Operations Matrix v4.5</span>
        <span>Secure Quantum Layer</span>
      </footer>
    </div>
  );
}

/* Reusable card shell */
function AgentCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`p-6 flex flex-col justify-between relative overflow-hidden h-[460px] rounded-[28px] ${className}`}
      style={{
        background: "linear-gradient(145deg, #12141c, #1a1d29)",
        border: "1px solid rgba(255,255,255,0.03)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.15)",
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </div>
  );
}

/* Card 1: Task concurrency rings */
function TaskEngineCard() {
  const vision = useRef<SVGCircleElement>(null);
  const lang = useRef<SVGCircleElement>(null);
  const exec = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const anims: Array<[SVGCircleElement | null, number, number, number, number]> = [
      [vision.current, 251.2, 60, 100, 1800],
      [lang.current, 194.7, 35, 300, 1500],
      [exec.current, 138.2, 20, 500, 1300],
    ];
    anims.forEach(([el, from, to, delay, dur]) => {
      if (!el) return;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start - delay) / dur);
        if (p < 0) { requestAnimationFrame(step); return; }
        const eased = 1 - Math.pow(1 - p, 4);
        el.setAttribute("stroke-dashoffset", String(from + (to - from) * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, []);

  return (
    <AgentCard className="items-center">
      <div className="w-full flex justify-between items-center mb-2">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold block">Task Engine</span>
          <span className="text-sm text-gray-400 font-medium">Pipeline Concurrency</span>
        </div>
        <span className="bg-[#1b1e2b] text-gray-400 text-[10px] font-mono px-2 py-1 rounded border border-gray-800">NODE_01</span>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="absolute flex flex-col items-center justify-center text-center z-10 animate-[float_1.8s_ease-in-out_infinite_alternate]">
          <span className="text-2xl">🧠</span>
          <span className="text-[10px] font-mono tracking-wider text-gray-500 mt-1">OPTIMIZED</span>
        </div>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="grad-vision" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="grad-lang" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="grad-exec" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="40" stroke="#1c1f2e" strokeWidth="5.5" fill="transparent" />
          <circle ref={vision} cx="50" cy="50" r="40" stroke="url(#grad-vision)" strokeWidth="5.5" fill="transparent" strokeDasharray="251.2" strokeDashoffset="251.2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="31" stroke="#1c1f2e" strokeWidth="5.5" fill="transparent" />
          <circle ref={lang} cx="50" cy="50" r="31" stroke="url(#grad-lang)" strokeWidth="5.5" fill="transparent" strokeDasharray="194.7" strokeDashoffset="194.7" strokeLinecap="round" />
          <circle cx="50" cy="50" r="22" stroke="#1c1f2e" strokeWidth="5.5" fill="transparent" />
          <circle ref={exec} cx="50" cy="50" r="22" stroke="url(#grad-exec)" strokeWidth="5.5" fill="transparent" strokeDasharray="138.2" strokeDashoffset="138.2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex gap-2 text-xs font-mono w-full justify-between items-center mt-4 text-gray-600">
        <span>v4.1</span><span>v4.2</span>
        <div className="bg-gradient-to-b from-indigo-600 to-indigo-700 text-white font-bold px-4 py-1.5 rounded-xl text-center shadow-lg scale-105 border border-indigo-400">
          <p className="text-[9px] uppercase tracking-widest opacity-80">Active</p>
          <p className="text-xs font-black">v4.5-Pro</p>
        </div>
        <span>v4.6</span><span>v4.7</span>
      </div>

      <style>{`@keyframes float { to { transform: translateY(-5px); } }`}</style>
    </AgentCard>
  );
}

/* Card 2: Compute load gauge */
function ComputeGaugeCard() {
  const gauge = useRef<SVGPathElement>(null);
  const [load, setLoad] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 2000;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setLoad(Math.floor(eased * 74));
      if (gauge.current) gauge.current.setAttribute("stroke-dashoffset", String(126 + (32 - 126) * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  return (
    <AgentCard>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Resource Monitor</p>
          <h3 className="text-base font-bold text-gray-200">Cluster Infrastructure</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center text-lg shadow-inner">🤖</div>
      </div>

      <div className="relative flex flex-col items-center justify-center mt-6">
        <svg className="w-56 h-36" viewBox="0 0 100 60">
          <defs>
            <linearGradient id="compute-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
          <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="#1c1f2e" strokeWidth="7" fill="transparent" strokeLinecap="round" />
          <path ref={gauge} d="M 10 50 A 40 40 0 0 1 90 50" stroke="url(#compute-gradient)" strokeWidth="7" fill="transparent" strokeLinecap="round" strokeDasharray="126" strokeDashoffset="126" />
        </svg>
        <div className="absolute bottom-5 text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Compute Load</p>
          <h2 className="text-3xl font-black text-white mt-0.5">{load}<span className="text-sm font-normal text-emerald-400">%</span></h2>
        </div>
      </div>

      <div className="bg-[#151722] border border-gray-900 p-4 rounded-2xl flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Token Quota</span>
          <span className="text-[10px] text-gray-600 font-mono">Max capability capacity</span>
        </div>
        <span className="text-sm font-mono font-bold text-emerald-400">850k / sec</span>
      </div>
    </AgentCard>
  );
}

/* Card 3: Vector alignment polygons */
function VectorAlignmentCard() {
  return (
    <AgentCard className="items-center">
      <div className="text-center w-full">
        <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">Vector Alignment</p>
        <h4 className="text-sm font-medium text-gray-300">Agent Cross-Specialization Model</h4>
      </div>

      <div className="relative w-48 h-48 my-auto flex items-center justify-center">
        <div className="absolute w-24 h-24 opacity-10 border border-dashed border-indigo-400 rounded-2xl" style={{ transform: "rotate(45deg)" }} />
        <div className="absolute w-36 h-36 border-[3px] border-indigo-500/70 opacity-40 rounded-[24px] animate-[poly1_6s_ease-in-out_infinite]" />
        <div className="absolute w-36 h-36 border-[3px] border-amber-500/80 opacity-60 rounded-[32px] animate-[poly2_6s_ease-in-out_infinite]" />
        <div className="absolute w-36 h-36 border-[3px] border-cyan-500/70 opacity-50 rounded-[20px] animate-[poly3_6s_ease-in-out_infinite]" />
        <style>{`
          @keyframes poly1 { 0%,100% { transform: rotate(12deg) scale(0.9); } 50% { transform: rotate(24deg) scale(0.95); } }
          @keyframes poly2 { 0%,100% { transform: rotate(42deg) scale(1); } 50% { transform: rotate(54deg) scale(1.05); } }
          @keyframes poly3 { 0%,100% { transform: rotate(68deg) scale(0.95); } 50% { transform: rotate(80deg) scale(1); } }
        `}</style>
      </div>

      <div className="w-full grid grid-cols-2 gap-y-2 text-[10px] font-mono text-gray-400 border-t border-gray-900 pt-4 px-1">
        <div className="flex justify-start items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> NLP Engine</div>
        <div className="flex justify-end items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Reasoning</div>
        <div className="flex justify-start items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Tools Array</div>
        <div className="flex justify-end items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Code Synthesis</div>
      </div>
    </AgentCard>
  );
}
