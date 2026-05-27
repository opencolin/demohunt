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
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      {
        root,
        threshold: [0.6, 0.9],
      },
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [demos.length]);

  return (
    <div className="relative flex-1 overflow-hidden">
      <FeedTabs current={currentTab} />
      <div
        ref={containerRef}
        className="scroll-snap-y h-[calc(100vh-3.5rem)] overflow-y-auto"
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
              <VideoCard demo={demo} founder={founder} active={i === activeIndex} />
            </div>
          );
        })}
        <div className="snap-start grid h-[calc(100vh-3.5rem)] w-full place-items-center">
          <div className="mx-auto max-w-md px-6 text-center">
            <p className="text-sm text-muted">You're caught up.</p>
            <p className="mt-2 text-xs text-muted/70">
              New demos drop daily. Subscribe to the digest.
            </p>
            <Link
              href="/discover"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-black"
            >
              Browse curated lists
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedTabs({ current }: { current: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center pt-3">
      <div className="pointer-events-auto glass flex items-center gap-1 rounded-full p-1">
        {FEED_TABS.map((t) => {
          const href = t.key === "for-you" ? "/" : `/?tab=${t.key}`;
          const active = current === t.key;
          return (
            <Link
              key={t.key}
              href={href}
              className={cn(
                "rounded-full px-3 py-1 text-[12px] transition",
                active
                  ? "bg-foreground text-background"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
