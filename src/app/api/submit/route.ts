import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmitBody = {
  url?: unknown;
  founder_name?: unknown;
  founder_handle?: unknown;
  tagline?: unknown;
};

type OEmbedResponse = {
  title?: string;
  thumbnail_url?: string;
  author_name?: string;
  author_url?: string;
};

function isYouTubeUrl(raw: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  return (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be"
  );
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: SubmitBody;
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url = asTrimmedString(body.url);
  const founderName = asTrimmedString(body.founder_name);
  const founderHandle = asTrimmedString(body.founder_handle);
  const tagline = asTrimmedString(body.tagline);

  if (!url) {
    return Response.json({ error: "A video URL is required" }, { status: 400 });
  }

  if (!isYouTubeUrl(url)) {
    return Response.json(
      { error: "Only youtube.com or youtu.be links are supported right now" },
      { status: 400 },
    );
  }

  // Resolve title + thumbnail via YouTube's public oEmbed endpoint.
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    url,
  )}&format=json`;

  let oembedRes: Response;
  try {
    oembedRes = await fetch(oembedUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { error: "Could not reach YouTube. Try again in a moment." },
      { status: 502 },
    );
  }

  if (oembedRes.status === 404) {
    return Response.json({ error: "Video not found" }, { status: 400 });
  }

  if (!oembedRes.ok) {
    return Response.json(
      { error: "Could not read that YouTube video" },
      { status: 400 },
    );
  }

  let oembed: OEmbedResponse;
  try {
    oembed = (await oembedRes.json()) as OEmbedResponse;
  } catch {
    return Response.json(
      { error: "YouTube returned an unexpected response" },
      { status: 502 },
    );
  }

  const title = asTrimmedString(oembed.title) || "Untitled demo";
  const thumbnailUrl = asTrimmedString(oembed.thumbnail_url);

  const record = {
    url,
    title,
    thumbnail_url: thumbnailUrl,
    tagline,
    founder_name: founderName || asTrimmedString(oembed.author_name),
    founder_handle: founderHandle,
    author_name: asTrimmedString(oembed.author_name),
    submitted_at: new Date().toISOString(),
  };

  // Persist for moderation. This is best-effort: on read-only runtimes
  // (e.g. Vercel) writing to disk throws — that's expected for v1, so we
  // swallow the error and just log the submission instead.
  try {
    const dataDir = path.join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    await appendFile(
      path.join(dataDir, "pending-submissions.jsonl"),
      JSON.stringify(record) + "\n",
      "utf8",
    );
  } catch {
    console.log("[submit] pending submission (not persisted):", record);
  }

  return Response.json(
    {
      ok: true,
      title,
      thumbnail_url: thumbnailUrl,
      tagline,
    },
    { status: 201 },
  );
}
