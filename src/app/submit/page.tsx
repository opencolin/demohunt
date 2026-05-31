"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Mic,
  Video,
  Sparkles,
  Loader2,
  Share2,
  ArrowLeft,
} from "lucide-react";

type SubmitResult = {
  title: string;
  thumbnail_url: string;
  tagline: string;
};

export default function SubmitPage() {
  const [url, setUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [founderName, setFounderName] = useState("");
  const [founderHandle, setFounderHandle] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          founder_name: founderName,
          founder_handle: founderHandle,
          tagline,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | (SubmitResult & { ok?: boolean; error?: string })
        | null;

      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setResult({
        title: data.title,
        thumbnail_url: data.thumbnail_url,
        tagline: data.tagline,
      });
      setStatus("idle");
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("idle");
    }
  }

  if (result) {
    return <ThanksScreen result={result} />;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.18em] text-accent">Submit</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Post your demo
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          15 to 30 seconds. No slides. Show the product, say one true thing, give
          us a way to reach you. We&apos;ll handle the rest.
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

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-border bg-surface p-6"
      >
        <Field
          label="YouTube link"
          hint="Paste a youtube.com or youtu.be URL. We'll pull the title and thumbnail."
          placeholder="https://youtube.com/watch?v=…"
          value={url}
          onChange={setUrl}
          required
          autoFocus
        />
        <Field
          label="Tagline"
          hint="The one true sentence."
          placeholder="Customer hangs up happy. Owner gets a CSV in the morning."
          value={tagline}
          onChange={setTagline}
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Founder name"
            hint="Who's behind this."
            placeholder="Ada Lovelace"
            value={founderName}
            onChange={setFounderName}
          />
          <Field
            label="Founder handle"
            hint="So people can find you. Public on your profile."
            placeholder="@adalovelace"
            value={founderHandle}
            onChange={setFounderHandle}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-300"
          >
            {error}
          </p>
        )}

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
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-black transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {status === "submitting" ? "Submitting…" : "Submit demo"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

function ThanksScreen({ result }: { result: SubmitResult }) {
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">(
    "idle",
  );

  // Placeholder share URL until per-submission pages exist.
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/submit`
      : "https://demohunt.app/submit";

  async function handleShare() {
    const shareData = {
      title: result.title,
      text: result.tagline || result.title,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        setShareState("shared");
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareState("copied");
      }
    } catch {
      // User dismissed the share sheet — leave the button as-is.
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        {result.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.thumbnail_url}
            alt={result.title}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-background">
            <Video className="h-8 w-8 text-muted" />
          </div>
        )}

        <div className="p-6">
          <p className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-accent">
            <CheckCircle2 className="h-4 w-4" />
            Thanks!
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {result.title}
          </h1>
          {result.tagline && (
            <p className="mt-2 text-sm text-muted">{result.tagline}</p>
          )}

          <p className="mt-4 text-[13px] text-muted">
            Your demo is in the queue. A human reviews every submission before it
            goes live — usually within 2 hours. We&apos;ll be in touch.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-black transition hover:bg-accent-soft"
            >
              <Share2 className="h-3.5 w-3.5" />
              {shareState === "shared"
                ? "Shared!"
                : shareState === "copied"
                  ? "Link copied!"
                  : "Share this submission"}
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] text-foreground hover:border-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to the feed
            </Link>
          </div>
        </div>
      </div>
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
        accent ? "border-accent/50 bg-accent/5" : "border-border bg-surface"
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
  value,
  onChange,
  required,
  autoFocus,
}: {
  label: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-medium text-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoFocus={autoFocus}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {hint && <span className="block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}
