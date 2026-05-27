import Link from "next/link";
import { CheckCircle2, Mic, Video, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

export default function SubmitPage() {
  return (
    <>
    <main className="mx-auto w-full max-w-4xl px-5 py-8">
      <header className="border-b-2 border-ink pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          Section IV · Submissions
        </p>
        <h1 className="mt-1 font-display text-[64px] leading-[0.92] tracking-[-0.02em] sm:text-[96px]">
          Submit your
          <span className="italic font-light"> demo.</span>
        </h1>
        <p className="mt-3 max-w-xl text-[14px] text-ink/80">
          Fifteen to thirty seconds. No slides. Show the product. Say one true
          thing. Leave a way to reach you. We do the rest.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-0 border-2 border-ink md:grid-cols-3">
        <PathCard
          icon={<Video className="h-4 w-4" />}
          kicker="Path A"
          title="I have a video."
          body="Paste a YouTube link or upload an mp4. Live in thirty seconds."
        />
        <PathCard
          icon={<Mic className="h-4 w-4" />}
          kicker="Path B"
          title="I have a pitch."
          body="Paste your script. We coach the cuts before you record."
          accent
          border
        />
        <PathCard
          icon={<Sparkles className="h-4 w-4" />}
          kicker="Path C"
          title="Walk into the studio."
          body="SF only. Thirty-minute slot. One take. Polished cut by Friday."
        />
      </div>

      <form className="mt-10 space-y-0 border-2 border-ink bg-paper-elev">
        <div className="border-b-2 border-ink bg-ink px-5 py-3 text-paper">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Form DH-21 · Demo Submission
          </p>
          <p className="mt-1 font-display text-[18px] leading-none">
            Submitter information
          </p>
        </div>
        <div className="space-y-6 p-6">
          <Field
            label="Demo title"
            hint="What is this thing in eight words or fewer."
            placeholder="DialPie — voice agents that take 14k restaurant calls a day"
          />
          <Field
            label="Tagline"
            hint="The one true sentence."
            placeholder="Customer hangs up happy. Owner gets a CSV in the morning."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Category" placeholder="AI · Devtools · Bio · Climate · Hardware…" />
            <Field
              label="Captured at"
              hint="Demo day, hackathon, founder upload, or AI-generated."
              placeholder="SF AI Demo Day"
            />
          </div>

          <div className="border-2 border-dashed border-ink bg-paper p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Optional — pitch coaching
            </p>
            <p className="mt-2 font-display text-[18px] leading-snug">
              Want our AI to tighten this for you before you record?
            </p>
            <textarea
              rows={3}
              placeholder="Paste your current pitch script…"
              className="mt-3 w-full border-2 border-ink bg-paper-elev px-3 py-2 text-[13px] focus:bg-accent/30 focus:outline-none"
            />
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-accent"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Tighten my pitch
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-5">
            <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              <CheckCircle2 className="h-3.5 w-3.5 text-ink" />
              A human reviews every submission. Usually within two hours.
            </p>
            <div className="flex gap-2">
              <Link
                href="/"
                className="border-2 border-ink bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-accent"
              >
                Cancel
              </Link>
              <button className="border-2 border-ink bg-ink px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:bg-accent hover:text-ink">
                File submission →
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
    <SiteFooter />
    </>
  );
}

function PathCard({
  kicker,
  title,
  body,
  icon,
  accent,
  border,
}: {
  kicker: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  accent?: boolean;
  border?: boolean;
}) {
  return (
    <div
      className={`p-5 ${accent ? "bg-accent" : "bg-paper-elev"} ${border ? "border-y-2 border-ink md:border-x-2 md:border-y-0" : ""}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/70">
          {kicker}
        </p>
        <span className="inline-grid h-7 w-7 place-items-center border-2 border-ink bg-paper">
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-[24px] leading-tight tracking-tight">
        {title}
      </p>
      <p className="mt-2 text-[13px] text-ink/80">{body}</p>
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
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2.5 text-[14px] placeholder:text-ink/35 focus:bg-accent/30 focus:outline-none"
      />
      {hint && (
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {hint}
        </span>
      )}
    </label>
  );
}
