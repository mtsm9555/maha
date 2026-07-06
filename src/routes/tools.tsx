import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ExternalLink, Search } from "lucide-react";
import { TOOL_RUNNERS } from "@/lib/toolRunners";
import { ToolRunnerCard } from "@/components/ToolRunnerCard";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Tools catalog" },
      { name: "description", content: "Browse available tools by category." },
      { property: "og:title", content: "Tools catalog" },
      { property: "og:description", content: "Browse available tools by category." },
    ],
  }),
  component: ToolsPage,
});

import type { Tool } from "@/types";


function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("enabled", true)
        .order("category", { ascending: true })
        .order("name", { ascending: true });
      if (error) toast.error(error.message);
      else setTools(data as Tool[]);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(tools.map((t) => t.category).filter(Boolean))) as string[],
    [tools],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (activeCategory && t.category !== activeCategory) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q) ||
        (t.command_example ?? "").toLowerCase().includes(q)
      );
    });
  }, [tools, query, activeCategory]);

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <Toaster />
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Tools</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Tasks</Link>
              <Link to="/logs" className="hover:text-foreground">Logs</Link>
            </div>
          </div>
          <p className="text-muted-foreground">
            {tools.length} {tools.length === 1 ? "tool" : "tools"} available
          </p>
        </header>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Run a tool</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TOOL_RUNNERS.map((r) => (
              <ToolRunnerCard key={r.key} runner={r} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Catalog</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? (
              <p className="text-muted-foreground col-span-full text-center py-8">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-center py-8">
                {tools.length === 0 ? "No tools yet." : "No tools match your search."}
              </p>
            ) : (
              filtered.map((tool) => (
                <Card key={tool.id} className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{tool.name}</h3>
                    {tool.category && <Badge variant="secondary">{tool.category}</Badge>}
                  </div>
                  {tool.description && (
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  )}
                  {tool.command_example && (
                    <pre className="text-xs bg-muted rounded p-2 overflow-x-auto font-mono">
                      {tool.command_example}
                    </pre>
                  )}
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-auto"
                    >
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
