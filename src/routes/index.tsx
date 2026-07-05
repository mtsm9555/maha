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
      <header className="border-b px-6 py-3 flex items-center justify-between shrink-0">
        <h1 className="text-lg font-semibold tracking-tight">Maha</h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/tools" className="hover:text-foreground">Tools</Link>
          <Link to="/logs" className="hover:text-foreground">Logs</Link>
        </div>
      </header>
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[7fr_3fr]">
        <section className="min-h-0 border-r border-border p-6 overflow-hidden">
          <Chat />
        </section>
        <section className="min-h-0 bg-task-panel p-6 overflow-hidden">
          <TaskList />
        </section>
      </div>
    </div>
  );
}
