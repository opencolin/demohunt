import type { cookies } from "next/headers";

export const SESSION_COOKIE = "demohunt_session";

type Session = { userId: string };

/**
 * Read the demohunt session from a Next.js cookie store.
 *
 * Pass the *resolved* cookie store, e.g.:
 *
 *   import { cookies } from "next/headers";
 *   const session = readSession(await cookies());
 *
 * Returns `null` when there is no session, so callers fall back to
 * localStorage-only behaviour. Never throws.
 */
export function readSession(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Session | null {
  try {
    const value = cookieStore.get(SESSION_COOKIE)?.value;
    if (!value) return null;
    return { userId: value };
  } catch {
    return null;
  }
}
