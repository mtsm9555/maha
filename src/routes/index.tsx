import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Trash2, Plus, CalendarIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Task Manager — Organize your day" },
      {
        name: "description",
        content: "A simple task manager to track your to-dos with priorities and due dates.",
      },
      { property: "og:title", content: "Task Manager" },
      { property: "og:description", content: "Track your to-dos with priorities and due dates." },
    ],
  }),
  component: Index,
});

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: number;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

const PRIORITY_LABEL: Record<number, string> = { 1: "Low", 2: "Medium", 3: "High" };
const PRIORITY_VARIANT: Record<number, "secondary" | "default" | "destructive"> = {
  1: "secondary",
  2: "default",
  3: "destructive",
};

function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("1");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("completed", { ascending: true })
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
    } else {
      setTasks(data as Task[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("tasks").insert({
      title: title.trim(),
      description: description.trim() || null,
      priority: Number(priority),
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setTitle("");
    setDescription("");
    setPriority("1");
    setDueDate("");
    toast.success("Task added");
    loadTasks();
  }

  async function toggleTask(task: Task) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    loadTasks();
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Task deleted");
    loadTasks();
  }

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <Toaster />
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground">
            {activeCount} active {activeCount === 1 ? "task" : "tasks"} · {tasks.length} total
          </p>
        </header>

        <Card className="p-6">
          <form onSubmit={addTask} className="space-y-4">
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low priority</SelectItem>
                  <SelectItem value="2">Medium priority</SelectItem>
                  <SelectItem value="3">High priority</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </form>
        </Card>

        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading…</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No tasks yet. Add one above.
            </p>
          ) : (
            tasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 transition-opacity ${task.completed ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`font-medium ${
                          task.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      <Badge variant={PRIORITY_VARIANT[task.priority]}>
                        {PRIORITY_LABEL[task.priority]}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                    {task.due_date && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(task.due_date).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
