import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, Sparkles } from "lucide-react";
import { chatWithMaha } from "@/lib/chat.functions";

type Message = { role: "user" | "assistant"; content: string };

export function Chat() {
  const call = useServerFn(chatWithMaha);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi, I'm Maha. What are you working on today?" },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const { reply } = await call({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Chat failed");
      setMessages(messages);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Maha</h2>
          <p className="text-xs text-muted-foreground">Your productivity assistant</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card
              className={`p-3 max-w-[85%] text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {m.content}
            </Card>
          </div>
        ))}
        {pending && (
          <div className="flex justify-start">
            <Card className="p-3 text-sm text-muted-foreground">Thinking…</Card>
          </div>
        )}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <Input
          placeholder="Message Maha…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={pending}
        />
        <Button type="submit" size="icon" disabled={pending || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
