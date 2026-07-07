import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Chat } from "@/components/Chat";
import { TaskList } from "@/components/TaskList";
import { HudDashboard } from "@/components/HudDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "M.A.H.A — JARVIS-style Command Deck" },
      { name: "description", content: "Talk to Maha inside a live futuristic HUD: radar, controls, diagnostics, and connected tools." },
      { property: "og:title", content: "M.A.H.A — JARVIS-style Command Deck" },
      { property: "og:description", content: "Talk to Maha inside a live futuristic HUD: radar, controls, diagnostics, and connected tools." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Toaster position="bottom-right" theme="dark" />
      <HudDashboard center={<Chat />} right={<TaskList />} />
    </>
  );
}
