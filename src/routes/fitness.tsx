import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/fitness")({
  head: () => ({
    meta: [
      { title: "Fitness Dashboard — M.A.H.A" },
      { name: "description", content: "Daily calorie gauge and activity radar comparison inside Maha." },
    ],
  }),
  component: FitnessPage,
});

function FitnessPage() {
  return (
    <div style={{ backgroundColor: "#1e202b", minHeight: "100vh" }} className="text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Fitness</h1>
          <Link to="/" className="text-sm text-white/60 hover:text-white underline">← back to HUD</Link>
        </div>
        <div className="flex flex-wrap gap-10 justify-center items-center">
          <CalorieCard />
          <RadarCard />
        </div>
      </div>
    </div>
  );
}

function CalorieCard() {
  return (
    <div className="fit-card">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-[0.85rem] font-medium" style={{ color: "#676a77" }}>Monday</div>
          <div className="text-[1.3rem] font-bold mt-1">25 October</div>
        </div>
        <div className="relative">
          <div
            className="w-11 h-11 rounded-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=33')" }}
          />
          <span className="absolute -right-0.5 top-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#ff5252", border: "1.5px solid #0d0e12" }} />
        </div>
      </div>

      <div className="relative w-full flex justify-center mt-2">
        <svg viewBox="0 0 100 60" className="w-full max-h-[180px]">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f65c78" />
              <stop offset="50%" stopColor="#9bf4d5" />
              <stop offset="100%" stopColor="#4deeea" />
            </linearGradient>
          </defs>
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#22252a" strokeWidth="7" strokeLinecap="round" />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="126"
            strokeDashoffset="44"
          />
        </svg>
        <div className="absolute bottom-6 flex flex-col items-center">
          <span className="text-[0.8rem]" style={{ color: "#676a77" }}>Today</span>
          <span className="text-[1.5rem] font-bold">210 Cal</span>
        </div>
      </div>

      <div className="flex justify-between items-center rounded-2xl px-5 py-4 text-[0.9rem] font-semibold" style={{ backgroundColor: "#191622" }}>
        <span style={{ color: "#a3a5b3" }}>Your goal</span>
        <span style={{ color: "#f17c6a" }}>340 Cal</span>
      </div>
    </div>
  );
}

function RadarCard() {
  const labels: Array<{ pos: string; val: string; label: string; color: "cyan" | "orange" }> = [
    { pos: "top-[12%] left-[16%] text-center", val: "143", label: "Running", color: "cyan" },
    { pos: "top-[10%] right-[16%] text-center", val: "215", label: "Walking", color: "orange" },
    { pos: "right-[8%] top-[40%] text-left", val: "130", label: "Lift", color: "cyan" },
    { pos: "bottom-[18%] right-[10%] text-left", val: "180", label: "Weight", color: "orange" },
    { pos: "bottom-[6%] left-1/2 -translate-x-1/2 text-center", val: "132", label: "Weight", color: "cyan" },
    { pos: "bottom-[18%] left-[10%] text-right", val: "112", label: "Weight", color: "orange" },
    { pos: "left-[4%] top-[52%] text-right", val: "180", label: "Boxing", color: "cyan" },
  ];
  return (
    <div className="fit-card">
      <div className="flex flex-col items-center gap-3">
        <div className="flex">
          <div
            className="w-11 h-11 rounded-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=12')", border: "2px solid #e06237" }}
          />
          <div
            className="w-11 h-11 rounded-full bg-cover bg-center -ml-3"
            style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=26')", border: "2px solid #3fcbb4" }}
          />
        </div>
        <div className="text-base font-semibold">You and Nick</div>
      </div>

      <div className="relative w-full h-[240px] flex justify-center items-center">
        {labels.map((l, i) => (
          <div
            key={i}
            className={`absolute text-[0.65rem] font-semibold leading-tight ${l.pos}`}
            style={{ color: "#676a77" }}
          >
            <span className="text-[0.85rem] font-bold" style={{ color: l.color === "cyan" ? "#3fcbb4" : "#f6724a" }}>{l.val}</span>
            <br />
            {l.label}
          </div>
        ))}
        <svg viewBox="0 0 120 120" className="w-[170px] h-[170px]" style={{ overflow: "visible" }}>
          <polygon points="60,15 102,46 86,96 34,96 18,46" fill="none" stroke="#22252a" strokeWidth="1" strokeDasharray="2 2" />
          <polygon points="60,35 83,52 74,79 46,79 37,52" fill="none" stroke="#22252a" strokeWidth="1" strokeDasharray="2 2" />
          <polygon points="60,20 95,43 80,85 40,92 22,50" fill="rgba(63,203,180,0.15)" stroke="#3fcbb4" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="60,28 100,50 72,90 30,82 25,35" fill="rgba(224,98,55,0.15)" stroke="#e06237" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
