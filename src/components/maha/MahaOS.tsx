import { useEffect, useState } from "react";
import { Mic, Brain, Search, Eye, Calendar, Cpu } from "lucide-react";
import ReactorCore from "./ReactorCore";
import MemoryGraph from "./MemoryGraph";
import PlannerAgentPanel from "./PlannerAgentPanel";
import RealWaveform from "./RealWaveform";

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
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-screen w-full bg-[#05080C] text-[#E8F6FF] overflow-hidden">
      {/* TOP BAR */}
      <div className="h-14 border-b border-[#152533] flex items-center justify-between px-6">
        <div className="font-bold tracking-[0.4em] text-cyan-300">MAHA OS</div>
        <div className="flex gap-8 text-xs text-cyan-200">
          <span>CPU 12%</span>
          <span>RAM 34%</span>
          <span>PING 24ms</span>
          <span>ONLINE</span>
          <span suppressHydrationWarning>{time || "--:--:--"}</span>
        </div>
      </div>

      <div className="grid grid-cols-[280px_1fr_360px] h-[calc(100vh-56px)]">
        {/* LEFT PANEL */}
        <div className="border-r border-[#152533] p-5 overflow-y-auto">
          <h2 className="text-cyan-300 text-sm mb-4 tracking-widest">SYSTEMS</h2>
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
                  <div className="text-[10px] text-cyan-300">{system.status}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <h2 className="text-cyan-300 text-sm mb-4 tracking-widest">AGENTS</h2>
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="flex justify-between py-2 border-b border-[#152533]"
              >
                <span>{agent.name}</span>
                <span className="text-cyan-300 text-xs">{agent.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center justify-center relative overflow-hidden p-6 gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle,#0c1f2d_0%,transparent_70%)]" />
          <ReactorCore state="idle" />
          <div className="w-full max-w-[700px] relative">
            <RealWaveform mode="circular" height={220} />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="border-l border-[#152533] p-5 overflow-y-auto">
          <h2 className="text-cyan-300 text-sm mb-4 tracking-widest">MEMORY GRAPH</h2>
          <MemoryGraph />

          <div className="mt-6">
            <PlannerAgentPanel
              goal="Build portfolio website"
              steps={[
                { id: "1", title: "Analyze requirements", tool: "memory", status: "completed" },
                { id: "2", title: "Research examples", tool: "search", status: "completed" },
                { id: "3", title: "Generate structure", tool: "planner", status: "running" },
                { id: "4", title: "Create implementation plan", tool: "executor", status: "pending" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
