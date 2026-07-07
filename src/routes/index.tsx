import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maha — AI Agent Command Deck" },
      {
        name: "description",
        content:
          "Maha AI agent dashboard — reasoning rings, token gauge, and skill radar for a voice-first assistant.",
      },
      { property: "og:title", content: "Maha — AI Agent Command Deck" },
      {
        property: "og:description",
        content:
          "Maha AI agent dashboard — reasoning rings, token gauge, and skill radar.",
      },
    ],
  }),
  component: MahaHome,
});


function useAnimatedValue(target: number, duration = 1400) {
  const [v, setV] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return v;
}

function MahaHome() {
  return (
    <PageShell
      eyebrow="Overview"
      title="Command Deck"
      subtitle="Live pulse of Maha — reasoning cycles, token budget and skill matrix."
      actions={
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          ● Agent online
        </span>
      }
    >
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ActivityRingsCard />
        <TokenGaugeCard />
        <SkillRadarCard />
      </section>

      <QuickActions />

      <footer className="mt-12 flex items-center justify-between text-xs text-white/40">
        <span>Maha OS · v0.4</span>
        <span className="font-mono">STATUS · ONLINE</span>
      </footer>
    </PageShell>
  );
}



function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/5 bg-[#0d0e14] p-6 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.8)] ${className}`}
      style={{ minHeight: 380 }}
    >
      {children}
    </div>
  );
}

/* ============ Activity Rings ============ */
function ActivityRingsCard() {
  const rings = [
    { label: "Reasoning", value: 82, color: "url(#ringA)", r: 88 },
    { label: "Tools", value: 64, color: "url(#ringB)", r: 68 },
    { label: "Memory", value: 47, color: "url(#ringC)", r: 48 },
  ];
  const v0 = useAnimatedValue(rings[0].value);
  const v1 = useAnimatedValue(rings[1].value);
  const v2 = useAnimatedValue(rings[2].value);
  const vals = [v0, v1, v2];

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-white/40">
            Activity
          </div>
          <div className="mt-1 text-lg font-semibold text-white">
            Agent Cycles
          </div>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/60">
          Today
        </span>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <svg viewBox="0 0 240 240" className="h-56 w-56">
          <defs>
            <linearGradient id="ringA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f97316" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="ringB" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="ringC" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#10b981" />
              <stop offset="1" stopColor="#84cc16" />
            </linearGradient>
          </defs>
          {rings.map((ring, i) => {
            const c = 2 * Math.PI * ring.r;
            const off = c * (1 - vals[i] / 100);
            return (
              <g key={ring.label} transform="translate(120 120) rotate(-90)">
                <circle
                  r={ring.r}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={12}
                />
                <circle
                  r={ring.r}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={12}
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={off}
                />
              </g>
            );
          })}
          <g transform="translate(120 120)">
            <circle r={26} fill="#0d0e14" stroke="rgba(255,255,255,0.08)" />
            <text
              textAnchor="middle"
              dy="5"
              fill="#fff"
              fontSize="14"
              fontWeight="600"
            >
              ⚡
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {rings.map((r, i) => (
          <div key={r.label}>
            <div className="text-lg font-semibold text-white">
              {Math.round(vals[i])}%
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/40">
              {r.label}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ============ Token Gauge ============ */
function TokenGaugeCard() {
  const used = 210;
  const goal = 340;
  const pct = used / goal;
  const anim = useAnimatedValue(pct * 100);
  const radius = 90;
  const c = Math.PI * radius; // semicircle
  const off = c * (1 - anim / 100);

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-white/40">
            Session
          </div>
          <div className="mt-1 text-lg font-semibold text-white">
            Token Budget
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-xs font-bold text-white">
          M
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-center">
        <svg viewBox="0 0 240 140" className="w-full max-w-xs">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f472b6" />
              <stop offset="0.5" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#5eead4" />
            </linearGradient>
          </defs>
          <g transform="translate(120 120)">
            <path
              d={`M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0`}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={14}
              strokeLinecap="round"
            />
            <path
              d={`M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0`}
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={off}
              style={{
                filter: "drop-shadow(0 0 12px rgba(167,139,250,0.4))",
              }}
            />
          </g>
        </svg>
        <div className="absolute inset-x-0 top-16 text-center">
          <div className="text-xs text-white/50">Today</div>
          <div className="mt-1 text-3xl font-bold text-white tabular-nums">
            {Math.round((anim / 100) * used)}k
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-rose-500/20 to-transparent px-4 py-3">
        <span className="text-sm text-white/70">Your goal</span>
        <span className="text-sm font-semibold text-rose-300">{goal}k</span>
      </div>
    </Card>
  );
}

/* ============ Skill Radar (rotating squares) ============ */
function SkillRadarCard() {
  const skills = [
    { label: "Reasoning", value: 215, color: "text-orange-400" },
    { label: "Voice", value: 143, color: "text-emerald-400" },
    { label: "Tools", value: 130, color: "text-cyan-400" },
    { label: "Memory", value: 180, color: "text-emerald-400" },
    { label: "Vision", value: 112, color: "text-orange-400" },
    { label: "Code", value: 132, color: "text-cyan-400" },
  ];
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-white/40">
            Capabilities
          </div>
          <div className="mt-1 text-lg font-semibold text-white">
            Skill Matrix
          </div>
        </div>
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 ring-2 ring-[#0d0e14]" />
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 ring-2 ring-[#0d0e14]" />
        </div>
      </div>

      <div className="relative mx-auto mt-6 h-56 w-56">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <polygon
              points="100,20 180,80 150,180 50,180 20,80"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeDasharray="3 4"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div
          className="absolute inset-4 rounded-[22%] border-[3px] border-orange-500/70"
          style={{
            transform: "rotate(12deg)",
            animation: "mahaSpinA 18s linear infinite",
          }}
        />
        <div
          className="absolute inset-6 rounded-[22%] border-[3px] border-emerald-500/70"
          style={{
            transform: "rotate(-8deg)",
            animation: "mahaSpinB 24s linear infinite",
          }}
        />
        <div
          className="absolute inset-8 rounded-[22%] border-[3px] border-cyan-500/70"
          style={{
            transform: "rotate(24deg)",
            animation: "mahaSpinA 30s linear infinite reverse",
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-2 text-center text-[11px]">
        {skills.map((s) => (
          <div key={s.label}>
            <div className={`text-sm font-semibold ${s.color}`}>{s.value}</div>
            <div className="uppercase tracking-widest text-white/40">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes mahaSpinA { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes mahaSpinB { from { transform: rotate(0deg);} to { transform: rotate(-360deg);} }
      `}</style>
    </Card>
  );
}

/* ============ Quick Actions ============ */
function QuickActions() {
  const actions = [
    {
      to: "/chat",
      label: "Talk to Maha",
      sub: "Voice + chat",
      grad: "from-violet-500 to-fuchsia-500",
    },
    {
      to: "/tools",
      label: "Tools",
      sub: "Connect & run",
      grad: "from-cyan-500 to-blue-500",
    },
    {
      to: "/logs",
      label: "Logs",
      sub: "Session history",
      grad: "from-emerald-500 to-teal-500",
    },
  ] as const;

  return (
    <section className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
      {actions.map((a) => (
        <Link
          key={a.to}
          to={a.to}
          className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d0e14] p-5 transition hover:border-white/20"
        >
          <div
            className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${a.grad} opacity-20 blur-2xl transition group-hover:opacity-40`}
          />
          <div className="relative">
            <div className="text-sm font-semibold text-white">{a.label}</div>
            <div className="mt-1 text-xs text-white/50">{a.sub}</div>
            <div className="mt-4 text-xs text-white/40 group-hover:text-white/70">
              Open →
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
