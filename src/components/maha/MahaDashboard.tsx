import ReactorCore from "./ReactorCore";
import LiveToolGraph from "./LiveToolGraph";
import MemoryGraph from "./MemoryGraph";
import PlannerAgentPanel from "./PlannerAgentPanel";
import NotificationCenter from "./NotificationCenter";
import VisionPanel from "./VisionPanel";
import { useHudStore } from "@/stores/hudStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useEffect } from "react";

export default function MahaDashboard() {
  const status = useHudStore((state) => state.status);
  const activeTools = useHudStore((state) => state.activeTools);
  const notifications = useNotificationStore((state) => state.notifications);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (notifications.length > 0) return;
    const seed = [
      { title: "Memory Retrieved", message: "Loaded project context", type: "memory" as const },
      { title: "Planner Completed", message: "Generated 4-step plan", type: "success" as const },
      { title: "Vision", message: "Laptop detected on screen", type: "vision" as const },
      { title: "Voice", message: "Microphone standby", type: "info" as const },
    ];
    seed.forEach((n) =>
      addNotification({
        id: crypto.randomUUID(),
        time: new Date().toLocaleTimeString(),
        ...n,
      }),
    );
  }, [notifications.length, addNotification]);

  return (
    <div className="h-screen bg-[#05080C] text-white overflow-hidden">
      {/* TOP BAR */}
      <div className="h-14 border-b border-[#152533] flex items-center justify-between px-6">
        <div className="tracking-[0.4em] text-cyan-300 font-bold">MAHA OS</div>
        <div className="flex gap-6 text-xs text-cyan-300">
          <span>VOICE ONLINE</span>
          <span>MEMORY ONLINE</span>
          <span>TOOLS READY</span>
          <span>{status.toUpperCase()}</span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-56px)]">
        {/* LEFT */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <div className="h-[40%]">
            <LiveToolGraph activeTools={activeTools} />
          </div>
          <div className="flex-1 min-h-0">
            <NotificationCenter notifications={notifications} />
          </div>
        </div>

        {/* CENTER */}
        <div className="col-span-6 flex flex-col gap-4 min-h-0">
          <div className="h-[420px] flex items-center justify-center border border-[#152533] rounded-xl bg-[#0B1118]">
            <ReactorCore state={status} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <PlannerAgentPanel
              goal="Build Maha OS"
              steps={[
                { id: "1", title: "Load memory", tool: "memory", status: "completed" },
                { id: "2", title: "Analyze request", tool: "planner", status: "completed" },
                { id: "3", title: "Generate solution", tool: "llm", status: "running" },
                { id: "4", title: "Return response", tool: "speech", status: "pending" },
              ]}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <div className="h-[45%]">
            <MemoryGraph />
          </div>
          <div className="flex-1 overflow-y-auto">
            <VisionPanel
              status="idle"
              detections={[
                { id: "1", label: "Monitor", confidence: 98 },
                { id: "2", label: "Laptop", confidence: 96 },
              ]}
              ocrText={"MAHA OS\nVOICE READY\nMEMORY ONLINE"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
