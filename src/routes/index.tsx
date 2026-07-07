import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maha — Fitness Dashboard" },
      { name: "description", content: "Track your daily activity rings, calorie goals, and workouts with Maha." },
      { property: "og:title", content: "Maha — Fitness Dashboard" },
      { property: "og:description", content: "Track your daily activity rings, calorie goals, and workouts with Maha." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen text-white p-4 sm:p-8 font-sans" style={{ backgroundColor: "#12131a" }}>
      <Toaster position="bottom-right" theme="dark" />
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Fitness</h1>
            <p className="text-sm text-gray-400">Monday · 25 October</p>
          </div>
          <nav className="flex gap-6 text-sm text-gray-400">
            <Link to="/tools" className="hover:text-white transition">Tools</Link>
            <Link to="/logs" className="hover:text-white transition">Logs</Link>
          </nav>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ActivityRingsCard />
          <CalorieGaugeCard />
          <MahaCard />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Card 1: Activity Rings ---------------- */

function ActivityRingsCard() {
  const ringOuter = useRef<SVGCircleElement>(null);
  const ringMid = useRef<SVGCircleElement>(null);
  const ringInner = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const rings: Array<[SVGCircleElement | null, number, number]> = [
      [ringOuter.current, 251.2, 60],
      [ringMid.current, 188.4, 47],
      [ringInner.current, 125.6, 25],
    ];
    rings.forEach(([el, dash, target], i) => {
      if (!el) return;
      const start = performance.now();
      const duration = 1400;
      const from = dash;
      const to = target;
      const step = (now: number) => {
        const p = Math.min(1, (now - start - i * 150) / duration);
        if (p < 0) { requestAnimationFrame(step); return; }
        const eased = 1 - Math.pow(1 - p, 3);
        el.setAttribute("stroke-dashoffset", String(from + (to - from) * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, []);

  const days = [23, 24, 25, 26, 27, 28];
  return (
    <div className="dashboard-card p-6 flex flex-col justify-between items-center relative overflow-hidden h-[450px]">
      <div className="w-full flex justify-between items-center mb-2">
        <span className="text-gray-400 font-medium">Activity</span>
        <span className="text-gray-500 text-sm">10:45</span>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="absolute text-2xl opacity-80">👟</div>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="gradient-outer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="gradient-mid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="gradient-inner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="40" stroke="#252632" strokeWidth="6" fill="transparent" />
          <circle ref={ringOuter} cx="50" cy="50" r="40" stroke="url(#gradient-outer)" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset="251.2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="30" stroke="#252632" strokeWidth="6" fill="transparent" />
          <circle ref={ringMid} cx="50" cy="50" r="30" stroke="url(#gradient-mid)" strokeWidth="6" fill="transparent" strokeDasharray="188.4" strokeDashoffset="188.4" strokeLinecap="round" />
          <circle cx="50" cy="50" r="20" stroke="#252632" strokeWidth="6" fill="transparent" />
          <circle ref={ringInner} cx="50" cy="50" r="20" stroke="url(#gradient-inner)" strokeWidth="6" fill="transparent" strokeDasharray="125.6" strokeDashoffset="125.6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex gap-3 text-xs text-gray-500 w-full justify-between items-center mt-4">
        {days.map((d) =>
          d === 25 ? (
            <div key={d} className="bg-white text-black font-bold px-3 py-2 rounded-xl text-center shadow-lg scale-110">
              <p className="text-[10px] uppercase tracking-wide">Mon</p>
              <p className="text-sm font-black">{d}</p>
            </div>
          ) : (
            <span key={d}>{d}</span>
          ),
        )}
      </div>
    </div>
  );
}

/* ---------------- Card 2: Calorie Gauge ---------------- */

function CalorieGaugeCard() {
  const [cals, setCals] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      setCals(Math.round(p * 210));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  return (
    <div className="dashboard-card p-6 flex flex-col justify-between h-[450px]">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Monday</p>
          <h3 className="text-lg font-bold">25 October</h3>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 p-0.5">
          <img src="https://i.pravatar.cc/100?img=33" alt="Profile" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <svg className="w-56 h-36" viewBox="0 0 100 60">
          <defs>
            <linearGradient id="calGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f65c78" />
              <stop offset="50%" stopColor="#9bf4d5" />
              <stop offset="100%" stopColor="#4deeea" />
            </linearGradient>
          </defs>
          <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="#252632" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="url(#calGrad)" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="126" strokeDashoffset="44" />
        </svg>
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-[0.75rem] text-gray-500">Today</span>
          <span className="text-2xl font-bold">{cals} Cal</span>
        </div>
      </div>

      <div className="flex justify-between items-center rounded-2xl px-5 py-4 text-sm font-semibold" style={{ backgroundColor: "#191622" }}>
        <span className="text-gray-400">Your goal</span>
        <span style={{ color: "#f17c6a" }}>340 Cal</span>
      </div>
    </div>
  );
}

/* ---------------- Card 3: Maha shortcut ---------------- */

function MahaCard() {
  return (
    <div className="dashboard-card p-6 flex flex-col justify-between h-[450px]">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Assistant</p>
          <h3 className="text-lg font-bold">M.A.H.A</h3>
        </div>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 grid place-items-center shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-[#1c1d26] grid place-items-center text-4xl">🤖</div>
        </div>
        <p className="text-center text-sm text-gray-400 max-w-[220px]">
          Voice-first assistant — task planning, tool routing, and coaching.
        </p>
      </div>

      <Link
        to="/chat"
        className="block text-center bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition"
      >
        Open chat
      </Link>
    </div>
  );
}
