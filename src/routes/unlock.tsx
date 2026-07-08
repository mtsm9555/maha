import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { unlockSite } from "@/lib/gate.functions";
import { Lock } from "lucide-react";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/unlock")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Unlock — Maha" },
      { name: "description", content: "Enter the site password to unlock Maha." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnlockPage,
});

function UnlockPage() {
  const router = useRouter();
  const { redirect } = useSearch({ from: "/unlock" });
  const unlock = useServerFn(unlockSite);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setBusy(true);
    setError(null);
    try {
      const res = await unlock({ data: { password } });
      if (res.ok) {
        const dest = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/chat";
        await router.navigate({ to: dest });
      } else {
        setError(res.reason ?? "Incorrect password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlock");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0b10] px-6 text-white">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d0e14] p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full border border-violet-400/40 bg-violet-500/10 p-2 text-violet-300">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Maha is locked</h1>
            <p className="text-xs text-white/50">Enter the site password to continue.</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm placeholder:text-white/30 focus:border-violet-400/60 focus:outline-none"
          />
          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-xl bg-violet-500 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Unlocking…" : "Unlock"}
          </button>
        </form>
      </div>
    </main>
  );
}
