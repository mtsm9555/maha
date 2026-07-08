import { redirect } from "@tanstack/react-router";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

export type GateSession = { unlocked?: boolean };

export const gateSessionConfig = {
  password: process.env.SESSION_SECRET ?? "dev-only-insecure-session-secret-change-me-please-32b",
  name: "maha-gate",
  maxAge: 60 * 60 * 24 * 30, // 30 days
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  },
};

/** Timing-safe equality on hashed digests (avoids length leaks + mismatch throws). */
export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

/** Read the gate session; returns { unlocked: boolean }. */
export async function readGateSession() {
  const session = await useSession<GateSession>(gateSessionConfig);
  return { unlocked: session.data.unlocked === true, session };
}

/**
 * Throws a redirect to /unlock if the caller has not unlocked the site.
 * Call at the top of every protected server-fn handler.
 */
export async function requireUnlocked(): Promise<void> {
  const { unlocked } = await readGateSession();
  if (!unlocked) throw redirect({ to: "/unlock" });
}
