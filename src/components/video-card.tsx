"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Share2,
  Mail,
  ExternalLink,
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
};

export function VideoCard({ demo, founder, active }: Props) {
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

  return (
    <article className="snap-start relative h-[calc(100vh-3.5rem)] w-full">
      <div className="absolute inset-0 mx-auto flex max-w-md flex-col px-3 py-4 sm:py-6">
        <div className="relative flex-1 overflow-hidden rounded-3xl border border-border bg-black shadow-[0_30px_80px_-30px_rgba(255,90,60,0.25)]">
          <div className="absolute inset-0">
            <iframe
              ref={iframeRef}
              src={src}
              title={demo.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              loading={active ? "eager" : "lazy"}
            />
          </div>

          {/* Click overlay to unmute */}
          <button
            onClick={() => {
              setMuted((m) => !m);
              setHasInteracted(true);
            }}
            className="absolute inset-0 z-10"
            aria-label={muted ? "Unmute" : "Mute"}
          />

          {/* Top gradient + meta */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 via-black/20 to-transparent px-4 pt-14 pb-4">
            <div className="pointer-events-auto flex items-center justify-between">
              <SourceBadge demo={demo} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMuted((m) => !m);
                  setHasInteracted(true);
                }}
                className="rounded-full glass p-2 text-white/80 hover:text-white"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Unmute hint */}
          {active && muted && !hasInteracted && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full glass px-3 py-1.5 text-[11px] text-white/80">
              Tap to unmute
            </div>
          )}

          {/* Bottom gradient + content */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-16">
            <div className="pointer-events-auto flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Link
                  href={`/founders/${founder.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 group"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-[11px] font-bold text-black">
                    {founder.avatar}
                  </span>
                  <span className="text-[13px] font-medium text-white group-hover:text-accent">
                    {founder.name}
                  </span>
                  <span className="text-[12px] text-white/50">@{founder.handle}</span>
                </Link>

                <Link
                  href={`/demo/${demo.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="block"
                >
                  <h2 className="text-[18px] font-semibold leading-snug text-white">
                    {demo.title}
                  </h2>
                </Link>
                <p className="line-clamp-2 text-[13px] text-white/80">{demo.tagline}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {demo.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 text-[11px] text-white/50">
                    <Clock className="h-3 w-3" />
                    {demo.durationSec}s
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-white/50">
                    <Eye className="h-3 w-3" />
                    {formatCount(demo.views)}
                  </span>
                  <span className="text-[11px] text-white/40">· {timeAgo(demo.postedAt)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <a
                    href={`mailto:${founder.email}?subject=Saw your Demo Hunt pitch`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-black hover:bg-white/90"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Contact
                  </a>
                  {founder.links[0] && (
                    <a
                      href={founder.links[0].url}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[12px] text-white/85 hover:bg-white/10"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {founder.links[0].label}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center gap-3">
                <UpvoteButton initial={demo.upvotes} />
                <ActionButton href={`/demo/${demo.id}`} label={formatCount(demo.comments)}>
                  <MessageCircle className="h-4 w-4" />
                </ActionButton>
                <ActionButton href="#" label="Share">
                  <Share2 className="h-4 w-4" />
                </ActionButton>
              </div>
            </div>
          </div>
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
          ? "AI-generated"
          : "Founder upload";
  const isAI = demo.source === "ai-generated";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-md",
        isAI
          ? "bg-purple-500/20 text-purple-200 border border-purple-400/30"
          : "bg-black/40 text-white/85 border border-white/15",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", isAI ? "bg-purple-300" : "bg-accent")} />
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
      className="flex w-16 flex-col items-center gap-1 rounded-2xl border border-border bg-surface px-3 py-3 text-foreground transition hover:border-accent/60"
    >
      {children}
      <span className="font-mono text-[11px] text-foreground/80">{label}</span>
    </Link>
  );
}
