import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Deck" },
  { to: "/chat", label: "Chat" },
  { to: "/tools", label: "Tools" },
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
    <main className="relative z-10 min-h-screen px-6 py-8 md:px-12 md:py-12">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.7)]">
            <span className="font-bold">M</span>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold tracking-wide text-white">
              Maha <span className="text-white/40">· AI Agent</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-white/40">
              Command Deck
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-white/5 bg-[#0d0e14]/80 p-1 backdrop-blur">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[0_6px_20px_-6px_rgba(139,92,246,0.8)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden font-mono text-sm text-white/60 tabular-nums md:block">
          {time || "--:--:--"}
        </div>
      </header>

      <section className="mx-auto mt-10 flex max-w-7xl flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/40">
              {eyebrow}
            </div>
          )}
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-xl text-sm text-white/50">{subtitle}</p>
          )}
        </div>
        {actions}
      </section>

      <div className="mx-auto mt-8 max-w-7xl">{children}</div>
    </main>
  );
}
