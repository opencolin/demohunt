"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VideoCard } from "./video-card";
import type { Demo, Founder } from "@/lib/data";
import { FEED_TABS } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = {
  demos: Demo[];
  founderMap: Record<string, Founder>;
  currentTab: string;
};

export function VideoFeed({ demos, founderMap, currentTab }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      {
        root,
        threshold: [0.55, 0.9],
      },
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [demos.length]);

  return (
    <section
      className="relative flex flex-col"
      style={{ height: "calc(100dvh - var(--site-header-h, 8rem))" }}
    >
      <FeedSection current={currentTab} count={demos.length} />
      <div
        ref={containerRef}
        className="scroll-snap-y flex-1 overflow-y-auto"
      >
        {demos.map((demo, i) => {
          const founder = founderMap[demo.founderSlug];
          if (!founder) return null;
          return (
            <div
              key={demo.id}
              data-index={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              <VideoCard
                demo={demo}
                founder={founder}
                active={i === activeIndex}
                index={i}
                total={demos.length}
              />
            </div>
          );
        })}
        <CaughtUpBlock />
      </div>
    </section>
  );
}

function FeedSection({ current, count }: { current: string; count: number }) {
  return (
    <div className="border-b border-ink/30 bg-paper-elev">
      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-3 px-5 py-3">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-[26px] font-medium leading-none tracking-[-0.01em]">
            The Feed
          </h1>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            {String(count).padStart(3, "0")} demos · refreshed live
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-1">
          {FEED_TABS.map((t) => {
            const href = t.key === "for-you" ? "/" : `/?tab=${t.key}`;
            const active = current === t.key;
            return (
              <Link
                key={t.key}
                href={href}
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.18em] px-2.5 py-1 border-2 transition",
                  active
                    ? "border-ink bg-ink text-accent"
                    : "border-ink/30 bg-paper hover:border-ink hover:bg-accent",
                )}
              >
                [{t.label}]
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function CaughtUpBlock() {
  return (
    <div className="snap-start mx-auto grid min-h-full w-full max-w-5xl place-items-center px-5 py-12">
      <div className="text-center">
        <p className="font-display text-[44px] leading-none tracking-tight">
          That's the issue.
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Next dispatch tomorrow at 09:00 PT
        </p>
        <div className="dotline mx-auto mt-6 h-px w-32" />
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/discover"
            className="border-2 border-ink bg-accent px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-ink hover:text-accent"
          >
            Browse the archive
          </Link>
          <Link
            href="/submit"
            className="border-2 border-ink bg-paper-elev px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-accent"
          >
            Submit yours
          </Link>
        </div>
      </div>
    </div>
  );
}
