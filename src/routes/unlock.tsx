import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { unlockForUser } from "@/lib/gate.functions";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/unlock")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — Maha" },
      { name: "description", content: "Sign in to Maha." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnlockPage,
});

type Mode = "login" | "signup";

function UnlockPage() {
  const router = useRouter();
  const { redirect } = useSearch({ from: "/unlock" });
  const unlock = useServerFn(unlockForUser);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    setError(null);
    try {
      const { error: authErr } =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: window.location.origin },
            });
      if (authErr) throw new Error(authErr.message);

      // Flip the site-gate cookie server-side (requires valid Supabase bearer).
      const res = await unlock();
      if (!res.ok) throw new Error("Sign-in succeeded but gate failed to unlock.");

      const dest =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
      await router.navigate({ to: dest });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
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
            <h1 className="text-lg font-semibold">
              {mode === "login" ? "Sign in to Maha" : "Create your Maha account"}
            </h1>
            <p className="text-xs text-white/50">
              {mode === "login" ? "Use your email and password." : "One account, personal use."}
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm placeholder:text-white/30 focus:border-violet-400/60 focus:outline-none"
          />
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={8}
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
            disabled={busy || !email || !password}
            className="w-full rounded-xl bg-violet-500 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode(mode === "login" ? "signup" : "login");
          }}
          className="mt-4 w-full text-center text-xs text-white/50 hover:text-white/80"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already registered? Sign in"}
        </button>
      </div>
    </main>
  );
}
