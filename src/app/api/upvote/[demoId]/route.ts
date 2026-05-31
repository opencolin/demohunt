import { cookies } from "next/headers";
import { readSession } from "@/lib/session";
import { addUpvote, removeUpvote } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ demoId: string }> };

/**
 * POST /api/upvote/:demoId — record an upvote for the signed-in user.
 *
 * Always returns 200 with `{ persisted: boolean }`. `persisted` is only true
 * when there is a session AND the write hit the database. When there's no
 * session (or no DB), `persisted` is false and the client keeps its
 * localStorage-only behaviour. This endpoint never blocks the optimistic UI.
 */
export async function POST(_request: Request, ctx: RouteContext) {
  const { demoId } = await ctx.params;
  const session = readSession(await cookies());
  if (!session) {
    return Response.json({ persisted: false });
  }
  const persisted = await addUpvote(session.userId, demoId);
  return Response.json({ persisted });
}

/** DELETE /api/upvote/:demoId — remove the signed-in user's upvote. */
export async function DELETE(_request: Request, ctx: RouteContext) {
  const { demoId } = await ctx.params;
  const session = readSession(await cookies());
  if (!session) {
    return Response.json({ persisted: false });
  }
  const persisted = await removeUpvote(session.userId, demoId);
  return Response.json({ persisted });
}
