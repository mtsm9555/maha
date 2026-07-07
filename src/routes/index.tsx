import { createFileRoute, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Chat } from "@/components/Chat";
import { TaskList } from "@/components/TaskList";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maha — Chat & Tasks" },
      {
        name: "description",
        content: "Chat with Maha on the left, manage your tasks on the right.",
      },
      { property: "og:title", content: "Maha — Chat & Tasks" },
      {
        property: "og:description",
        content: "Chat with Maha on the left, manage your tasks on the right.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Toaster position="bottom-right" />
      <header className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-baseline gap-3">
          <span className="label-mono">[00]</span>
          <h1 className="text-xl font-display font-bold tracking-tight text-primary text-glow">
            MAHA
          </h1>
          <span className="label-mono hidden sm:inline">/ voice agent</span>
        </div>
        <nav className="flex gap-6 label-mono">
          <Link to="/tools" className="hover:text-primary transition-colors">[01] Tools</Link>
          <Link to="/logs" className="hover:text-primary transition-colors">[02] Logs</Link>
        </nav>
      </header>
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[7fr_3fr]">
        <section className="min-h-0 border-r border-border overflow-hidden">
          <Chat />
        </section>
        <section className="min-h-0 bg-task-panel p-6 overflow-hidden">
          <TaskList />
        </section>
      </div>
    </div>
  );
}
