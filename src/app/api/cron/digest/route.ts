import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { demos, type Demo } from "@/lib/data";

// Never statically optimize — this must run on every cron invocation.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://demohunt.vercel.app";
const FROM_ADDRESS = process.env.DIGEST_FROM ?? "Demo Hunt <digest@demohunt.vercel.app>";

type Subscriber = {
  email: string;
  frequency?: string;
};

/**
 * Fetch the subscriber list.
 *
 * v2 scaffold: there is no database wired up yet. When DATABASE_URL is absent
 * we return an empty list so the cron is a safe no-op (no mail is ever sent).
 * Once a DB is connected, replace the body of the `if (DATABASE_URL)` branch
 * with the real `subscribers` query (e.g. SELECT email, frequency FROM
 * digest_opt_in WHERE frequency = 'daily').
 */
async function getSubscribers(): Promise<Subscriber[]> {
  if (!process.env.DATABASE_URL) {
    // No DB in this environment — fall back to an empty recipient list.
    return [];
  }

  // TODO(v2): run the real subscribers query against DATABASE_URL.
  // Intentionally returns [] until a DB client is added so we never send
  // mail from an unconfigured environment.
  return [];
}

/** Build a single demo card row for the HTML email. */
function renderDemoCard(demo: Demo, rank: number): string {
  // The /demo/[id] route resolves its segment via getDemoBySlug, so the
  // public URL uses the slug, not the numeric id.
  const watchUrl = `${SITE_URL}/demo/${encodeURIComponent(demo.slug)}`;
  // youtube provides a stable thumbnail when the demo doesn't carry its own.
  const thumbnail =
    demo.thumbnailUrl ||
    (demo.videoProvider === "youtube"
      ? `https://i.ytimg.com/vi/${demo.videoId}/hqdefault.jpg`
      : `${SITE_URL}/og-default.png`);
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #1f1f1f;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="120" valign="top" style="padding-right:16px;">
              <a href="${watchUrl}" style="text-decoration:none;">
                <img src="${thumbnail}" alt="${demo.title}" width="120" height="68" style="display:block;width:120px;height:68px;object-fit:cover;border-radius:8px;background:#1f1f1f;" />
              </a>
            </td>
            <td valign="top">
              <div style="font-size:12px;color:#a1a1aa;margin-bottom:4px;">#${rank} · ${demo.upvotes} upvotes</div>
              <a href="${watchUrl}" style="font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">${demo.title}</a>
              <div style="font-size:14px;color:#d4d4d8;margin:4px 0 8px;">${demo.tagline}</div>
              <a href="${watchUrl}" style="display:inline-block;font-size:13px;font-weight:600;color:#ec4899;text-decoration:none;">Watch on Demo Hunt &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

/** Render the full HTML email for the daily digest. */
function renderDigestHtml(demos: Demo[]): string {
  const rows = demos.map((demo, i) => renderDemoCard(demo, i + 1)).join("");
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding-bottom:24px;">
                <span style="font-size:22px;font-weight:700;color:#ffffff;">Demo Hunt</span>
                <span style="font-size:14px;color:#a1a1aa;"> · Today's top demos</span>
              </td>
            </tr>
            ${rows}
            <tr>
              <td style="padding-top:24px;font-size:12px;color:#71717a;">
                You're receiving this because you subscribed to the Demo Hunt digest.
                <a href="${SITE_URL}/subscribe" style="color:#a1a1aa;">Manage your subscription</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;

  // If no secret is configured, only allow outside of production so local
  // testing works but a misconfigured prod deploy can't be triggered openly.
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Top demos by score. v0 mock data has no real timestamps, so we skip the
  // 24h window for now and rank by (upvotes + views/100), tie-broken by upvotes.
  const score = (d: Demo) => d.upvotes + d.views / 100;
  const topDemos = [...demos]
    .sort((a, b) => score(b) - score(a) || b.upvotes - a.upvotes)
    .slice(0, 10);

  const subscribers = await getSubscribers();

  // Without a recipient list there is nothing to send.
  if (subscribers.length === 0) {
    console.log("[cron/digest] would send to 0 subscribers");
    return NextResponse.json({ sent: 0 });
  }

  const html = renderDigestHtml(topDemos);
  const subject = "Today's top hackathon demos — Demo Hunt";

  // Gracefully no-op when Resend isn't configured: log what would happen.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(
      `[cron/digest] RESEND_API_KEY unset — would send "${subject}" to ${subscribers.length} subscriber(s)`,
    );
    return NextResponse.json({ sent: 0, skipped: subscribers.length });
  }

  const resend = new Resend(apiKey);
  let sent = 0;
  const errors: { email: string; error: string }[] = [];

  for (const subscriber of subscribers) {
    try {
      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: subscriber.email,
        subject,
        html,
      });
      if (error) {
        throw new Error(error.message ?? "Unknown Resend error");
      }
      sent += 1;
    }
    catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[cron/digest] failed to send to ${subscriber.email}:`, message);
      errors.push({ email: subscriber.email, error: message });
    }
  }

  return NextResponse.json({ sent, failed: errors.length, errors });
}
