import Link from "next/link";
import { CheckCircle2, Mic, Video, Sparkles } from "lucide-react";

export default function SubmitPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.18em] text-accent">Submit</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Post your demo
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          15 to 30 seconds. No slides. Show the product, say one true thing, give
          us a way to reach you. We'll handle the rest.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <PathCard
          icon={<Video className="h-4 w-4" />}
          title="I have a video"
          body="Upload it or paste a YouTube link. Live in 30s."
        />
        <PathCard
          icon={<Mic className="h-4 w-4" />}
          title="I have a pitch"
          body="Paste your script. We'll coach the cuts before you record."
          accent
        />
        <PathCard
          icon={<Sparkles className="h-4 w-4" />}
          title="Book the studio"
          body="Walk into our SF studio. 30-min slot, 1 take, polished cut."
        />
      </div>

      <form className="space-y-5 rounded-3xl border border-border bg-surface p-6">
        <Field
          label="Demo title"
          hint="What is this thing in 8 words or fewer."
          placeholder="DialPie — voice agents that take 14k restaurant calls a day"
        />
        <Field
          label="Tagline"
          hint="The one true sentence."
          placeholder="Customer hangs up happy. Owner gets a CSV in the morning."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="YouTube link or upload"
            hint="MP4 up to 200MB or a YouTube URL."
            placeholder="https://youtube.com/watch?v=…"
          />
          <Field
            label="Founder email"
            hint="Public on your profile so VCs can reach you."
            placeholder="you@startup.com"
            type="email"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Category" placeholder="AI · Devtools · Bio · Climate · Hardware…" />
          <Field
            label="Captured at"
            hint="Demo day, hackathon, founder upload, or AI-generated."
            placeholder="SF AI Demo Day"
          />
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-background p-4">
          <p className="text-[12px] font-medium text-foreground">
            Want pitch coaching before you upload?
          </p>
          <p className="mt-1 text-[12px] text-muted">
            Paste your current pitch and our AI will suggest cuts to hit the
            15-second mark without losing the punch.
          </p>
          <textarea
            rows={3}
            placeholder="Paste your current pitch script…"
            className="mt-3 w-full rounded-xl border border-border bg-surface px-3 py-2 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] text-foreground hover:border-accent"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Tighten my pitch
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <p className="flex items-center gap-2 text-[12px] text-muted">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
            Reviewed by a human before going live. Usually within 2 hours.
          </p>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-full border border-border px-4 py-2 text-[13px] text-foreground hover:border-accent"
            >
              Cancel
            </Link>
            <button className="rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-black hover:bg-accent-soft">
              Submit demo
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

function PathCard({
  icon,
  title,
  body,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-accent/50 bg-accent/5"
          : "border-border bg-surface"
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${
          accent ? "bg-accent text-black" : "bg-background text-accent"
        }`}
      >
        {icon}
      </span>
      <p className="mt-2 text-[13px] font-medium">{title}</p>
      <p className="mt-0.5 text-[12px] text-muted">{body}</p>
    </div>
  );
}

function Field({
  label,
  hint,
  placeholder,
  type = "text",
}: {
  label: string;
  hint?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-medium text-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {hint && <span className="block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}
