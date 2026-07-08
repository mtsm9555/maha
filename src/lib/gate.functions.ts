import { createServerFn } from "@tanstack/react-start";

/**
 * Shared-password site gate. Encrypts an `unlocked` flag into a signed cookie.
 * The password lives in SITE_PASSWORD (server-only); the cookie is encrypted
 * with SESSION_SECRET. Neither ever reaches the browser bundle.
 */

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => {
    if (typeof data?.password !== "string" || data.password.length === 0 || data.password.length > 512) {
      throw new Error("Invalid password");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const { readGateSession, passwordMatches } = await import("./gate.server");
    const expected = process.env.SITE_PASSWORD;
    if (!expected) return { ok: false as const, reason: "SITE_PASSWORD not configured" };
    if (!passwordMatches(data.password, expected)) {
      return { ok: false as const };
    }
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
