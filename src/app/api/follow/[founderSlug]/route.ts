import { cookies } from "next/headers";
import { readSession } from "@/lib/session";
import { addFollow, removeFollow } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ founderSlug: string }> };

/**
 * POST /api/follow/:founderSlug — follow a founder as the signed-in user.
 *
 * Mirrors the upvote endpoint: always 200 with `{ persisted: boolean }`. Only
 * persists when there is a session and a working DB; otherwise the client
 * stays on localStorage.
 */
export async function POST(_request: Request, ctx: RouteContext) {
  const { founderSlug } = await ctx.params;
  const session = readSession(await cookies());
  if (!session) {
    return Response.json({ persisted: false });
  }
  const persisted = await addFollow(session.userId, founderSlug);
  return Response.json({ persisted });
}

/** DELETE /api/follow/:founderSlug — unfollow a founder. */
export async function DELETE(_request: Request, ctx: RouteContext) {
  const { founderSlug } = await ctx.params;
  const session = readSession(await cookies());
  if (!session) {
    return Response.json({ persisted: false });
  }
  const persisted = await removeFollow(session.userId, founderSlug);
  return Response.json({ persisted });
}
