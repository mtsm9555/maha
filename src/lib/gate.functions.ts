import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Site gate — Supabase-backed.
 * On successful Supabase login, `unlockForUser` verifies the bearer token
 * (via requireSupabaseAuth) and flips an encrypted `unlocked` cookie, which
 * is what every protected route/server-fn checks via `checkUnlocked` /
 * `requireUnlocked`. Signup/login UI lives in /unlock.
 */

/** Called by the client after a successful Supabase sign-in. */
export const unlockForUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { readGateSession } = await import("./gate.server");
    const { session } = await readGateSession();
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const { readGateSession } = await import("./gate.server");
  const { session } = await readGateSession();
  await session.clear();
  return { ok: true as const };
});

/** Cheap check for beforeLoad / UI — returns whether the current session is unlocked. */
export const checkUnlocked = createServerFn({ method: "GET" }).handler(async () => {
  const { readGateSession } = await import("./gate.server");
  const { unlocked } = await readGateSession();
  return { unlocked };
});
