import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "Activity logs" },
      { name: "description", content: "Recent activity across tasks and tools." },
      { property: "og:title", content: "Activity logs" },
      { property: "og:description", content: "Recent activity across tasks and tools." },
    ],
  }),
  component: LogsPage,
});

type LogRow = {
  id: string;
  task_id: string | null;
  tool_id: string | null;
  status: string | null;
  message: string | null;
  created_at: string;
  tasks: { title: string } | null;
  tools: { name: string } | null;
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  success: "default",
  running: "secondary",
  error: "destructive",
};

function LogsPage() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("logs")
        .select("*, tasks(title), tools(name)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) toast.error(error.message);
      else setLogs((data ?? []) as LogRow[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <Toaster />
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Logs</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Tasks</Link>
              <Link to="/tools" className="hover:text-foreground">Tools</Link>
            </div>
          </div>
          <p className="text-muted-foreground">
            {logs.length} recent {logs.length === 1 ? "entry" : "entries"}
          </p>
        </header>

        <div className="space-y-2">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading…</p>
          ) : logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No logs yet.</p>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {log.status && (
                        <Badge variant={STATUS_VARIANT[log.status] ?? "secondary"}>
                          {log.status}
                        </Badge>
                      )}
                      {log.tools?.name && (
                        <span className="text-sm font-medium">{log.tools.name}</span>
                      )}
                      {log.tasks?.title && (
                        <span className="text-sm text-muted-foreground truncate">
                          → {log.tasks.title}
                        </span>
                      )}
                    </div>
                    {log.message && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {log.message}
                      </p>
                    )}
                  </div>
                  <time className="text-xs text-muted-foreground shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </time>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
