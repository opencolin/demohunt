"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

type Props = {
  id: string;
  title: string;
  tagline: string;
};

export function DemoShareButton({ id, title, tagline }: Props) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = `https://demohunt.vercel.app/demo/${id}`;
    const shareData = { title, text: tagline, url };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // user cancelled or share unavailable — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.dispatchEvent(
        new CustomEvent("demohunt:toast", {
          detail: { message: "Link copied to clipboard" },
        }),
      );
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="Share"
      className="inline-flex flex-col items-center justify-center gap-0.5 rounded-2xl border border-border bg-surface px-3 py-2 text-foreground transition hover:border-accent/60 active:scale-95"
    >
      {copied ? (
        <Check className="h-4 w-4" strokeWidth={2.2} />
      ) : (
        <Share2 className="h-4 w-4" strokeWidth={2.2} />
      )}
      <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/65">
        Share
      </span>
    </button>
  );
}
