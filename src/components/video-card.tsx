"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Share2,
  Mail,
  ArrowUpRight,
  Eye,
  Clock,
  Volume2,
  VolumeX,
} from "lucide-react";
import { UpvoteButton } from "./upvote-button";
import type { Demo, Founder } from "@/lib/data";
import { cn, formatCount, timeAgo } from "@/lib/utils";

type Props = {
  demo: Demo;
  founder: Founder;
  active: boolean;
  index: number;
  total: number;
};

export function VideoCard({ demo, founder, active, index, total }: Props) {
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const ifr = iframeRef.current;
    if (!ifr) return;
    const cmd = active ? "playVideo" : "pauseVideo";
    ifr.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: cmd, args: [] }),
      "*",
    );
  }, [active]);

  useEffect(() => {
    const ifr = iframeRef.current;
    if (!ifr) return;
    ifr.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: muted ? "mute" : "unMute",
        args: [],
      }),
      "*",
    );
  }, [muted]);

  const src = `https://www.youtube-nocookie.com/embed/${demo.youtubeId}?autoplay=${active ? 1 : 0}&mute=1&loop=1&playlist=${demo.youtubeId}&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1`;

  const num = String(index + 1).padStart(3, "0");
  const tot = String(total).padStart(3, "0");

  return (
    <article className="snap-start min-h-full w-full py-6 sm:py-8">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-8 gap-y-4 px-5 md:grid-cols-[1fr_auto]">
        {/* Numbered dateline above */}
        <div className="col-span-full mb-2 flex items-center justify-between border-y-2 border-ink py-1.5 font-mono text-[10px] uppercase tracking-[0.22em]">
          <span>
            No. <span className="num-tag font-semibold">{num}</span>
            <span className="text-muted"> / {tot}</span>
          </span>
          <SourceBadge demo={demo} />
          <span className="hidden sm:inline">
            <span className="text-muted">Filed</span>{" "}
            <span className="num-tag">{timeAgo(demo.postedAt)}</span> ago
          </span>
        </div>

        {/* Video frame */}
        <div className="relative aspect-video w-full overflow-hidden border-2 border-ink bg-ink cover-shadow">
          <iframe
            ref={iframeRef}
            src={src}
            title={demo.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading={active ? "eager" : "lazy"}
          />
          {/* Mute toggle overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => !m);
              setHasInteracted(true);
            }}
            className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-accent"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            {muted ? "Muted" : "Sound"}
          </button>
          {active && muted && !hasInteracted && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto w-max border-2 border-ink bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]">
              Tap for sound
            </div>
          )}
          {/* Watch dot */}
          {active && (
            <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]">
              <span className="block h-1.5 w-1.5 bg-warn animate-pulse" />
              On the air
            </span>
          )}
        </div>

        {/* Sidebar actions */}
        <aside className="flex flex-row gap-2 md:flex-col">
          <UpvoteButton initial={demo.upvotes} />
          <ActionButton href={`/demo/${demo.id}`} label={formatCount(demo.comments)}>
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
          </ActionButton>
          <ActionButton href="#" label="Share">
            <Share2 className="h-4 w-4" strokeWidth={2} />
          </ActionButton>
        </aside>

        {/* Caption / article block */}
        <div className="md:col-span-1 md:max-w-2xl">
          <Link
            href={`/demo/${demo.id}`}
            className="block"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-[34px] leading-[0.98] tracking-[-0.015em] sm:text-[44px]">
              {demo.title.split(" — ")[0]}
              {demo.title.includes(" — ") && (
                <span className="block font-display italic font-light text-ink/85">
                  {demo.title.split(" — ").slice(1).join(" — ")}
                </span>
              )}
            </h2>
          </Link>

          <p className="mt-3 max-w-prose text-[15px] leading-[1.55] text-ink/85">
            <span className="font-display italic">“</span>
            {demo.tagline}
            <span className="font-display italic">”</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            <Link
              href={`/founders/${founder.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-ink hover:text-ink"
            >
              <span className="grid h-6 w-6 place-items-center border border-ink bg-paper-elev font-display text-[10px] leading-none">
                {founder.avatar}
              </span>
              <span className="tracking-[0.18em]">By {founder.name}</span>
            </Link>
            <span className="text-ink/40">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="num-tag">{demo.durationSec}″</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span className="num-tag">{formatCount(demo.views)}</span>
            </span>
            <span className="text-ink/40">·</span>
            <div className="flex flex-wrap gap-1.5">
              {demo.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="border border-ink bg-paper px-1.5 py-0.5 text-[9px] tracking-[0.22em]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${founder.email}?subject=Saw your Demo Hunt pitch`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper hover:bg-accent hover:text-ink"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact founder
            </a>
            {founder.links[0] && (
              <a
                href={founder.links[0].url}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 border-2 border-ink bg-paper px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-accent"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                {founder.links[0].label}
              </a>
            )}
            <Link
              href={`/demo/${demo.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted ink-link"
            >
              Read the full file →
            </Link>
          </div>
        </div>

        {/* Bottom rule with next demo cue */}
        <div className="col-span-full mt-6 flex items-center justify-between gap-3 border-t border-ink/40 pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          <span>End of demo {num}</span>
          <span className="hidden sm:inline">Scroll to continue ↓</span>
        </div>
      </div>
    </article>
  );
}

function SourceBadge({ demo }: { demo: Demo }) {
  const label =
    demo.source === "demo-day"
      ? demo.sourceLabel ?? "Demo Day"
      : demo.source === "hackathon"
        ? demo.sourceLabel ?? "Hackathon"
        : demo.source === "ai-generated"
          ? "Filed: AI-Generated"
          : "Founder Filed";
  const isAI = demo.source === "ai-generated";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.22em]",
        isAI
          ? "border-ink bg-ink text-paper"
          : "border-ink bg-paper-elev",
      )}
    >
      <span className={cn("block h-1.5 w-1.5", isAI ? "bg-accent" : "bg-ink")} />
      {label}
    </span>
  );
}

function ActionButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className="flex w-12 flex-col items-center justify-center gap-1 border-2 border-ink bg-paper-elev py-2.5 hover:bg-accent md:w-[68px]"
    >
      {children}
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/70">
        {label}
      </span>
    </Link>
  );
}
