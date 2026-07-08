import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { lockSite } from "@/lib/gate.functions";

const NAV = [
  { to: "/", label: "Deck" },
  { to: "/chat", label: "Chat" },
  { to: "/tools", label: "Tools" },
  { to: "/agency", label: "Agency" },
  { to: "/logs", label: "Logs" },
  { to: "/settings", label: "Settings" },
] as const;

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const time = useClock();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b border-white/[0.04] bg-[#030307]/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative flex h-6 w-6 items-center justify-center">
              <div className="absolute inset-0 rotate-45 animate-pulse rounded-md bg-gradient-to-tr from-cyan-400 to-purple-500" />
              <div className="absolute h-4 w-4 rotate-45 rounded-sm bg-[#030307]" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-white">
              Maha <span className="text-white/40">3.0</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-wider text-slate-400 md:flex">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`transition-colors ${active ? "text-cyan-400" : "hover:text-cyan-400"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden font-mono text-[11px] tracking-widest text-slate-500 tabular-nums md:block">
              {time || "--:--:--"}
            </div>
            <LockButton />
            <Link
              to="/chat"
              className="group relative overflow-hidden rounded-full p-[1px] focus:outline-none"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
              <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-[#030307] px-4 py-2 text-xs font-semibold text-white transition-all group-hover:bg-transparent">
                Deploy Agent
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen px-6 pt-24 pb-16 md:px-12 md:pt-28">
        <section className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-widest text-cyan-400">
                <span className="h-1 w-1 animate-ping rounded-full bg-cyan-400" />
                {eyebrow}
              </div>
            )}
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gradient-soft md:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-slate-400 md:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </section>

        <div className="mx-auto mt-10 max-w-7xl">{children}</div>
      </main>
    </>
  );
}

function LockButton() {
  const router = useRouter();
  const lock = useServerFn(lockSite);
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={async () => {
        setBusy(true);
        try {
          await lock();
          await router.navigate({ to: "/unlock" });
        } finally {
          setBusy(false);
        }
      }}
      disabled={busy}
      title="Lock site"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-widest text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:opacity-50"
    >
      <Lock className="h-3 w-3" />
      Lock
    </button>
  );
}
