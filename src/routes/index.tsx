import { createFileRoute, redirect } from "@tanstack/react-router";
import { Chat } from "@/components/Chat";
import { Toaster } from "@/components/ui/sonner";
import { PageShell } from "@/components/PageShell";
import { checkUnlocked } from "@/lib/gate.functions";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location }) => {
    const { unlocked } = await checkUnlocked();
    if (!unlocked) throw redirect({ to: "/unlock", search: { redirect: location.href } });
  },
  head: () => ({
    meta: [
      { title: "Maha — Talk to your Agentic AI" },
      {
        name: "description",
        content:
          "Maha 3.0 — voice-first agentic AI command deck. Talk, delegate, and orchestrate autonomous agents in real time.",
      },
      { property: "og:title", content: "Maha — Talk to your Agentic AI" },
      {
        property: "og:description",
        content: "Voice-first agentic AI. Talk, delegate, and orchestrate autonomous agents.",
      },
    ],
  }),
  component: MahaHome,
});

function MahaHome() {
  return (
    <>
      <Toaster position="bottom-right" theme="dark" />
      <PageShell
        eyebrow="Conversation"
        title="Talk to Maha"
        subtitle="Voice + text. Ask, delegate, or dictate a task."
        actions={
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Ready
          </div>
        }
      >
        <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[#0d0e14] shadow-[0_25px_50px_-20px_rgba(0,0,0,0.8)]">
          <div className="h-[calc(100vh-260px)] min-h-[520px]">
            <Chat />
          </div>
        </div>
      </PageShell>
    </>
  );
}
