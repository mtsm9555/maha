import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "@/components/Chat";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat — Maha" }] }),
  component: () => (
    <div className="min-h-screen" style={{ backgroundColor: "#12131a" }}>
      <Toaster position="bottom-right" theme="dark" />
      <div className="max-w-3xl mx-auto h-screen">
        <Chat />
      </div>
    </div>
  ),
});
