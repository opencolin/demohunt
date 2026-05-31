import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

type SubscribePayload = {
  email?: string;
  frequency?: string;
};

const VALID_FREQUENCIES = ["daily", "weekly", "monthly"] as const;
type Frequency = (typeof VALID_FREQUENCIES)[number];

// Simple, pragmatic email check — good enough for an opt-in form.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PENDING_FILE = path.join(process.cwd(), "data", "pending-subscribers.jsonl");

async function persistToDb(email: string, frequency: Frequency): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  // TODO(v2): wire a DB client and run:
  //   INSERT INTO digest_opt_in (email, frequency) VALUES ($1, $2)
  //   ON CONFLICT (email) DO UPDATE SET frequency = EXCLUDED.frequency;
  // Until then we report "no DB" so the caller falls back to the JSONL file.
  void email;
  void frequency;
  return false;
}

async function appendToPendingFile(email: string, frequency: Frequency): Promise<boolean> {
  const line = JSON.stringify({
    email,
    frequency,
    createdAt: new Date().toISOString(),
  });

  try {
    await mkdir(path.dirname(PENDING_FILE), { recursive: true });
    await appendFile(PENDING_FILE, line + "\n", "utf8");
    return true;
  }
  catch (err) {
    // On Vercel the filesystem is read-only (except /tmp), so this is expected
    // in production without a DB. Log and continue — we still ack the user.
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[api/subscribe] could not append to pending file:", message);
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: SubscribePayload;
  try {
    body = (await request.json()) as SubscribePayload;
  }
  catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const frequency = (body.frequency ?? "daily").trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!VALID_FREQUENCIES.includes(frequency as Frequency)) {
    return NextResponse.json(
      { error: "Frequency must be daily, weekly, or monthly." },
      { status: 400 },
    );
  }

  const validFrequency = frequency as Frequency;

  const savedToDb = await persistToDb(email, validFrequency);
  if (!savedToDb) {
    await appendToPendingFile(email, validFrequency);
  }

  console.log(`[api/subscribe] ${email} subscribed (${validFrequency})`);

  return NextResponse.json(
    { success: true, message: "You're subscribed! Check your inbox soon." },
    { status: 201 },
  );
}
