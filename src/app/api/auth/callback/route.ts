import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";
import { upsertUser } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OAUTH_STATE_COOKIE = "demohunt_oauth_state";

type TokenResponse = {
  access_token?: string;
  error?: string;
};

type VercelUser = {
  user?: { id?: string; uid?: string; name?: string; username?: string; email?: string };
  id?: string;
  uid?: string;
  name?: string;
  username?: string;
  email?: string;
};

function redirectHome(origin: string): Response {
  return Response.redirect(`${origin}/`, 302);
}

/**
 * OAuth callback. Exchanges the `?code` for an access token, looks up the
 * Vercel user, upserts a local user row (best-effort — works without a DB),
 * then sets the httpOnly session cookie and redirects home.
 *
 * Any failure degrades gracefully: we just redirect home without a session, so
 * the user keeps their localStorage-backed experience.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();

  // Validate CSRF state.
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);
  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectHome(origin);
  }

  const clientId = process.env.VERCEL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.VERCEL_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return redirectHome(origin);
  }

  const redirectUri =
    process.env.VERCEL_OAUTH_REDIRECT_URI ?? `${origin}/api/auth/callback`;

  // Exchange the authorization code for an access token.
  let accessToken: string | undefined;
  try {
    const tokenRes = await fetch("https://api.vercel.com/v2/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }).toString(),
      cache: "no-store",
    });
    const token = (await tokenRes.json()) as TokenResponse;
    accessToken = token.access_token;
  } catch {
    return redirectHome(origin);
  }

  if (!accessToken) {
    return redirectHome(origin);
  }

  // Look up the authenticated Vercel user.
  let vercelId: string | undefined;
  let name: string | null = null;
  let email: string | null = null;
  try {
    const userRes = await fetch("https://api.vercel.com/v2/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const data = (await userRes.json()) as VercelUser;
    const u = data.user ?? data;
    vercelId = u.id ?? u.uid;
    name = u.name ?? u.username ?? null;
    email = u.email ?? null;
  } catch {
    return redirectHome(origin);
  }

  if (!vercelId) {
    return redirectHome(origin);
  }

  // Upsert the user (no-op/null when no DB) and resolve the session id.
  const userId = (await upsertUser({ vercelId, name, email })) ?? `u_${vercelId}`;

  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return redirectHome(origin);
}
