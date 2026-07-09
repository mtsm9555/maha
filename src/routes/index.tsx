import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maha — Agentic AI Command Deck" },
      {
        name: "description",
        content:
          "Maha 3.0 — production-grade agentic AI command deck. Orchestrate tools, agents, and tasks with sub-second latency.",
      },
      { property: "og:title", content: "Maha — Agentic AI Command Deck" },
      {
        property: "og:description",
        content:
          "Production-grade agentic AI. Orchestrate tools, agents, and tasks in real time.",
      },
    ],
  }),
  component: MahaHome,
});

function MahaHome() {
  return (
    <PageShell
      eyebrow="Flash Latency & Multi-Agent Swarms"
      title={
        <>
          Master production grade{" "}
          <span className="gemini-gradient font-bold">Agentic AI Ecosystems.</span>
        </>
      }
      subtitle="Transition from standard LLM prompting to building autonomous, stateful, event-driven multi-agent systems using enterprise protocols and sub-second execution layers."
    >
      <TerminalHero />
      <FrameworkGrid />
      <MetricsBlock />
      <QuickActions />

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-6 font-mono text-[11px] text-slate-400">
        <span>© 2026 Maha Agentic OS · v0.4</span>
        <span className="tracking-widest uppercase">Status · Online</span>
      </footer>

    </PageShell>
  );
}

/* ============ Terminal Hero Mockup ============ */
function TerminalHero() {
  return (
    <div className="relative mx-auto mt-4 max-w-4xl rounded-2xl border border-white/[0.06] bg-white/[0.01] p-2 shadow-2xl backdrop-blur-sm">
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-60 blur-xl" />
      <div className="relative space-y-2 overflow-x-auto rounded-xl border border-white/[0.04] bg-[#06060c] p-4 text-left font-mono text-xs text-slate-400 sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.05] pb-3">
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/40" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-600">
            maha-agentic-stream
          </span>
        </div>
        <p className="text-purple-400">
          <span className="text-slate-600">$</span> maha deploy --agent orchestrator
        </p>
        <p className="text-slate-500">// Activating multi-agent workflow pipeline...</p>
        <p className="text-cyan-400">
          <span className="text-slate-600">&gt;</span> [Agent Initialized] Supervisor routing online.
        </p>
        <p className="text-pink-400">
          <span className="text-slate-600">&gt;</span> [Tool] genspark.search invoked (8ms)
        </p>
        <p className="text-emerald-400">
          <span className="text-slate-600">&gt;</span> [Status] Convergence achieved. Response streamed.
        </p>
      </div>
    </div>
  );
}

/* ============ Framework Grid ============ */
function FrameworkGrid() {
  const items = [
    {
      idx: "[01]",
      tag: "Framework Architecture",
      title: "Orchestrator & Router",
      body: "Cyclic workflows, supervisor states, and parallel multi-agent loops.",
      accent: "text-cyan-400",
      border: "hover:border-cyan-500/30",
    },
    {
      idx: "[02]",
      tag: "Protocol Integration",
      title: "Tools & Connectors",
      body: "Expose tools safely with unified schemas and typed contracts.",
      accent: "text-purple-400",
      border: "hover:border-purple-500/30",
    },
    {
      idx: "[03]",
      tag: "Context Engineering",
      title: "Memory & RAG",
      body: "Self-improving long-term memories that scale across agents.",
      accent: "text-pink-400",
      border: "hover:border-pink-500/30",
    },
    {
      idx: "[04]",
      tag: "Observability",
      title: "Logs & Traces",
      body: "Track cost, evaluate traces, and monitor guardrails live.",
      accent: "text-emerald-400",
      border: "hover:border-emerald-500/30",
    },
  ];
  return (
    <section id="frameworks" className="mt-20" aria-labelledby="stack-heading">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2
          id="stack-heading"
          className="mb-3 text-2xl font-semibold tracking-tight text-white md:text-4xl"
        >
          Enterprise Agentic Stack
        </h2>
        <p className="text-sm font-light text-slate-300">
          Engineered for real-world autonomy and low-latency deployment.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <article
            key={it.idx}
            className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 ${it.border}`}
          >
            <div className={`mb-3 font-mono text-xs ${it.accent}`}>
              {it.idx} {it.tag}
            </div>
            <h3 className="mb-2 text-base font-medium text-white">{it.title}</h3>
            <p className="text-sm font-light leading-relaxed text-slate-300">{it.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}


/* ============ Metrics Block ============ */
function MetricsBlock() {
  const bars = [
    { label: "Routing Delay", val: "0.04 ms", w: "12%", color: "bg-cyan-400" },
    { label: "Tool Execution", val: "14.2 ms", w: "34%", color: "bg-purple-400" },
    { label: "Context Recalibration", val: "4.1 ms", w: "19%", color: "bg-pink-400" },
  ];
  return (
    <section className="mt-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="mb-3 block font-mono text-xs tracking-wider text-purple-400">
            // ARCHITECTURAL SPEED
          </span>
          <h2 className="mb-6 text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            Built for sub-second agent processing loops.
          </h2>
          <p className="mb-6 font-light leading-relaxed text-slate-400">
            Structured multi-agent loops and streaming schemas keep execution
            timelines in the sub-second range.
          </p>
          <ul className="space-y-3 font-mono text-xs text-slate-400">
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Async event loops
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> Human-in-the-loop checkpoints
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400" /> Pre-compiled context pipes
            </li>
          </ul>
        </div>
        <div className="space-y-6 rounded-2xl border border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent p-8">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 font-mono text-xs">
            <span className="text-white">CONCURRENT METRIC MONITOR</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
          {bars.map((b) => (
            <div key={b.label} className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span className="font-mono">{b.label}</span>
                <span>{b.val}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.03]">
                <div className={`h-full ${b.color}`} style={{ width: b.w }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Quick Actions ============ */
function QuickActions() {
  const actions = [
    { to: "/chat" as const, label: "Talk to Maha", sub: "Voice + chat", accent: "cyan" },
    { to: "/tools" as const, label: "Tools", sub: "Connect & run", accent: "purple" },
    { to: "/agency" as const, label: "Agency", sub: "Multi-agent swarm", accent: "pink" },
    { to: "/logs" as const, label: "Logs", sub: "Session history", accent: "emerald" },
  ];
  const map: Record<string, string> = {
    cyan: "hover:border-cyan-500/30 group-hover:text-cyan-400",
    purple: "hover:border-purple-500/30 group-hover:text-purple-400",
    pink: "hover:border-pink-500/30 group-hover:text-pink-400",
    emerald: "hover:border-emerald-500/30 group-hover:text-emerald-400",
  };
  return (
    <section
      aria-label="Quick actions"
      className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {actions.map((a) => (
        <Link
          key={a.to}
          to={a.to}
          className={`group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030307] ${map[a.accent]}`}
        >
          <div className="text-base font-medium text-white">{a.label}</div>
          <div className="mt-1 text-sm font-light text-slate-300">{a.sub}</div>
          <div className={`mt-6 font-mono text-xs text-slate-400 transition ${map[a.accent]}`}>
            Open →
          </div>
        </Link>
      ))}
    </section>
  );
}

