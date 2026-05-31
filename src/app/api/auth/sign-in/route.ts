import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OAUTH_STATE_COOKIE = "demohunt_oauth_state";

/**
 * Kick off "Sign in with Vercel".
 *
 * Redirects the browser to Vercel's OAuth authorize endpoint. If the OAuth
 * client isn't configured (no VERCEL_OAUTH_CLIENT_ID), we return a friendly
 * 503 JSON payload instead of crashing — the rest of the app keeps working on
 * localStorage.
 */
export async function GET(request: Request) {
  const clientId = process.env.VERCEL_OAUTH_CLIENT_ID;
  if (!clientId) {
    return Response.json({ error: "auth not configured" }, { status: 503 });
  }

  const origin = new URL(request.url).origin;
  const redirectUri =
    process.env.VERCEL_OAUTH_REDIRECT_URI ?? `${origin}/api/auth/callback`;

  // CSRF protection: random state echoed back on the callback.
  const state = randomBytes(16).toString("hex");

  const authorizeUrl = new URL("https://vercel.com/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "user");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("response_type", "code");

  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  return Response.redirect(authorizeUrl.toString(), 302);
}
