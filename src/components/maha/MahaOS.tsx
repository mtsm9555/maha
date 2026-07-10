// src/components/maha/MahaOS.tsx

import { useMemo } from "react";
import { Mic, Brain, Search, Eye, Calendar, Cpu } from "lucide-react";

const systems = [
  { name: "Voice", icon: Mic, status: "ONLINE" },
  { name: "Memory", icon: Brain, status: "ONLINE" },
  { name: "Search", icon: Search, status: "ONLINE" },
  { name: "Vision", icon: Eye, status: "OFFLINE" },
  { name: "Calendar", icon: Calendar, status: "ONLINE" },
  { name: "Automation", icon: Cpu, status: "OFFLINE" },
];

const agents = [
  { name: "Planner", status: "ACTIVE" },
  { name: "Researcher", status: "WAITING" },
  { name: "Memory", status: "ACTIVE" },
  { name: "Executor", status: "WAITING" },
  { name: "Vision", status: "OFFLINE" },
];

export default function MahaOS() {
  const time = useMemo(() => {
    return new Date().toLocaleTimeString();
  }, []);

  return (
    <div className="h-screen w-full bg-[#05080C] text-[#E8F6FF] overflow-hidden">
      {/* TOP BAR */}
      <div className="h-14 border-b border-[#152533] flex items-center justify-between px-6">
        <div className="font-bold tracking-[0.4em] text-cyan-300">
          MAHA OS
        </div>

        <div className="flex gap-8 text-xs text-cyan-200">
          <span>CPU 12%</span>
          <span>RAM 34%</span>
          <span>PING 24ms</span>
          <span>ONLINE</span>
          <span>{time}</span>
        </div>
      </div>

      <div className="grid grid-cols-[280px_1fr_320px] h-[calc(100vh-56px)]">
        {/* LEFT PANEL */}
        <div className="border-r border-[#152533] p-5">
          <h2 className="text-cyan-300 text-sm mb-4 tracking-widest">
            SYSTEMS
          </h2>

          <div className="space-y-3">
            {systems.map((system) => {
              const Icon = system.icon;

              return (
                <div
                  key={system.name}
                  className="bg-[#0B1118] border border-[#152533] rounded-lg p-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{system.name}</span>
                  </div>

                  <div className="text-[10px] text-cyan-300">
                    {system.status}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <h2 className="text-cyan-300 text-sm mb-4 tracking-widest">
              AGENTS
            </h2>

            {agents.map((agent) => (
              <div
                key={agent.name}
                className="flex justify-between py-2 border-b border-[#152533]"
              >
                <span>{agent.name}</span>
                <span className="text-cyan-300 text-xs">
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle,#0c1f2d_0%,transparent_70%)]" />

          {/* REACTOR */}
          <div className="relative h-[380px] w-[380px]">
            <div className="absolute inset-0 rounded-full border border-cyan-500 animate-spin" />

            <div
              className="absolute inset-8 rounded-full border border-cyan-300 animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "12s",
              }}
            />

            <div
              className="absolute inset-16 rounded-full border border-cyan-400 animate-spin"
              style={{
                animationDuration: "8s",
              }}
            />

            <div className="absolute inset-[110px] rounded-full bg-cyan-400/20 backdrop-blur-xl flex items-center justify-center">
              <div className="text-3xl font-bold tracking-[0.4em] text-cyan-300">
                MAHA
              </div>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="w-[700px] mt-10 bg-[#0B1118] border border-[#152533] rounded-xl p-4">
            <div className="text-cyan-300 text-sm mb-3">
              LIVE ACTIVITY
            </div>

            <div className="space-y-2 font-mono text-sm">
              <div>[21:10:02] Wake word detected</div>
              <div>[21:10:03] Loading memory...</div>
              <div>[21:10:04] Search tool activated</div>
              <div>[21:10:05] Planner running...</div>
              <div>[21:10:06] Response generated</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="border-l border-[#152533] p-5">
          <h2 className="text-cyan-300 text-sm mb-4 tracking-widest">
            MEMORY GRAPH
          </h2>

          <div className="bg-[#0B1118] border border-[#152533] rounded-xl p-4 h-[300px] flex items-center justify-center">
            <pre className="text-cyan-200 text-sm">
{`        React
           |
           |
Startup - User - AI
           |
           |
         Maha`}
            </pre>
          </div>

          <div className="mt-6">
            <h2 className="text-cyan-300 text-sm mb-4 tracking-widest">
              WAVEFORM
            </h2>

            <div className="bg-[#0B1118] border border-[#152533] rounded-xl p-4">
              <div className="text-center text-cyan-300 text-xl tracking-widest">
                ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-cyan-300 text-sm mb-4 tracking-widest">
              NOTIFICATIONS
            </h2>

            <div className="space-y-2">
              <div className="bg-[#0B1118] p-3 rounded-lg border border-[#152533]">
                Meeting in 30 mins
              </div>

              <div className="bg-[#0B1118] p-3 rounded-lg border border-[#152533]">
                Weather Updated
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}