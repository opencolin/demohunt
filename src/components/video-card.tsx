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
import { FollowButton } from "./follow-button";
import { VideoProgress } from "./video-progress";
import { VerifiedBadge, TrustChip } from "./verified-badge";
import type { ViewMode } from "./view-mode-switcher";
import type { Demo, Founder } from "@/lib/data";
import { cn, formatCount, timeAgo, embedUrlFor, thumbnailFor } from "@/lib/utils";

type Props = {
  demo: Demo;
  founder: Founder;
  active: boolean;
  nearActive?: boolean;
  viewMode: ViewMode;
};

export function VideoCard({ demo, founder, active, nearActive = false, viewMode }: Props) {
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // YouTube responds to postMessage commands; Loom doesn't, so we just re-key the iframe
  useEffect(() => {
    if (demo.videoProvider !== "youtube") return;
    const ifr = iframeRef.current;
    if (!ifr) return;
    const cmd = active ? "playVideo" : "pauseVideo";
    ifr.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: cmd, args: [] }),
      "*",
    );
  }, [active, demo.videoProvider]);

  useEffect(() => {
    if (demo.videoProvider !== "youtube") return;
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
  }, [muted, demo.videoProvider]);

  const shouldRenderIframe = active || nearActive;
  const src = embedUrlFor(demo.videoProvider, demo.videoId, {
    autoplay: active,
    muted,
    loop: true,
  });

  const onMuteToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMuted((m) => !m);
    setHasInteracted(true);
  };

  const iframe = shouldRenderIframe ? (
    <iframe
      ref={iframeRef}
      key={demo.videoProvider === "loom" ? `${demo.id}-${active ? "a" : "p"}` : demo.id}
      src={src}
      title={demo.title}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 h-full w-full"
      loading={active ? "eager" : "lazy"}
    />
  ) : (
    <img
      src={thumbnailFor(demo)}
      alt={demo.title}
      className="absolute inset-0 h-full w-full object-cover opacity-90"
      loading="lazy"
    />
  );

  const actionRail = (
    <>
      <UpvoteButton initial={demo.upvotes} />
      <ActionButton href={`/demo/${demo.id}`} label="Comments" count={formatCount(demo.comments)}>
        <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
      </ActionButton>
      <ActionButton href="#" label="Share">
        <Share2 className="h-5 w-5" strokeWidth={2.2} />
      </ActionButton>
    </>
  );

  if (viewMode === "landscape") {
    return (
      <article className="snap-start relative h-[calc(100vh-3.5rem)] w-full bg-black">
        {/* Video — 16:9, as large as possible */}
        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
          <div
            className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black shadow-[0_30px_80px_-30px_rgba(255,90,60,0.25)]"
            style={{
              width: "min(100%, calc((100vh - 3.5rem - 2rem) * 16 / 9))",
            }}
          >
            {iframe}
            <button
              onClick={() => onMuteToggle()}
              className="absolute inset-0 z-10"
              aria-label={muted ? "Unmute" : "Mute"}
            />
            <VideoProgress durationSec={demo.durationSec} active={active} />
          </div>
        </div>

        {/* Top overlay — source badge + mute */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-6 pt-14">
          <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between">
            <SourceBadge demo={demo} />
            <button
              onClick={onMuteToggle}
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

        {/* Bottom overlay — founder/title/tagline/contact */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/85 to-transparent px-4 pb-6 pt-20 sm:px-8">
          <div className="pointer-events-auto mx-auto flex max-w-5xl items-end gap-4 pr-20 sm:pr-24">
            <div className="min-w-0 flex-1 space-y-2.5">
              <CreatorRow demo={demo} founder={founder} />
              <Link
                href={`/demo/${demo.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block"
              >
                <h2 className="text-[20px] font-semibold leading-snug text-white sm:text-[24px]">
                  {demo.title}
                </h2>
              </Link>
              <p className="line-clamp-2 max-w-2xl text-[14px] text-white/85">{demo.tagline}</p>

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

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`mailto:${founder.email}?subject=Saw your Demo Hunt pitch`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-white/15"
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/85 hover:bg-white/10"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {founder.links[0].label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="absolute bottom-6 right-3 z-30 flex flex-col items-center gap-3 sm:right-6 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2">
          {actionRail}
        </div>
      </article>
    );
  }

  // Portrait
  return (
    <article className="snap-start relative h-[calc(100vh-3.5rem)] w-full">
      <div className="absolute inset-0 mx-auto flex max-w-md flex-col px-3 py-4 sm:py-6">
        <div className="relative flex-1 overflow-hidden rounded-3xl border border-border bg-black shadow-[0_30px_80px_-30px_rgba(255,90,60,0.25)]">
          <div className="absolute inset-0">{iframe}</div>

          {/* Click overlay to unmute */}
          <button
            onClick={() => onMuteToggle()}
            className="absolute inset-0 z-10"
            aria-label={muted ? "Unmute" : "Mute"}
          />

          {/* Top gradient + meta */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 via-black/20 to-transparent px-4 pt-14 pb-4">
            <div className="pointer-events-auto flex items-center justify-between">
              <SourceBadge demo={demo} />
              <button
                onClick={onMuteToggle}
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
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/75 to-transparent p-4 pt-16">
            <div className="pointer-events-auto flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <CreatorRow demo={demo} founder={founder} />

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
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-white/15"
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
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/85 hover:bg-white/10"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {founder.links[0].label}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center gap-3">
                {actionRail}
              </div>
            </div>
          </div>

          <VideoProgress durationSec={demo.durationSec} active={active} />
        </div>
      </div>
    </article>
  );
}

function CreatorRow({ demo, founder }: { demo: Demo; founder: Founder }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <Link
        href={`/founders/${founder.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-2 group"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-[12px] font-bold text-black ring-2 ring-white/15">
          {founder.avatar}
        </span>
        <span className="flex flex-col leading-tight">
          <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-white group-hover:text-accent">
            {founder.name}
            {founder.verified && <VerifiedBadge />}
          </span>
          <span className="text-[11px] text-white/55">
            @{founder.handle}
            {typeof founder.followers === "number" && (
              <span className="ml-2 text-white/45">
                · {formatCount(founder.followers)} followers
              </span>
            )}
          </span>
        </span>
      </Link>
      <FollowButton founderSlug={founder.slug} founderName={founder.name} />
      {founder.badges && founder.badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {founder.badges.slice(0, 2).map((b) => (
            <TrustChip key={b} label={b} />
          ))}
        </div>
      )}
      {demo.sourceLabel && (
        <span className="text-[11px] text-white/45">via {demo.sourceLabel}</span>
      )}
    </div>
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
  count,
  children,
}: {
  href: string;
  label: string;
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className="flex w-[68px] flex-col items-center justify-center gap-0.5 rounded-2xl border border-border bg-surface/80 px-2 py-3 text-foreground backdrop-blur-md transition hover:border-accent/60 active:scale-95"
      aria-label={label}
    >
      {children}
      {count && (
        <span className="font-mono text-[12px] font-semibold tabular-nums text-foreground">
          {count}
        </span>
      )}
      <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/65">
        {label}
      </span>
    </Link>
  );
}
