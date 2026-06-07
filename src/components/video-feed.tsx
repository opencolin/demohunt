"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import { VideoCard } from "./video-card";
import { ViewModeSwitcher, type ViewMode } from "./view-mode-switcher";
import type { Demo, Founder } from "@/lib/data";
import { FEED_TABS } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = {
  demos: Demo[];
  founderMap: Record<string, Founder>;
  currentTab: string;
};

const VIEW_MODE_KEY = "demohunt:viewMode";

export function VideoFeed({ demos, founderMap, currentTab }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("portrait");
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    if (stored === "landscape" || stored === "portrait") {
      setViewMode(stored);
      return;
    }
    // No preference yet: default landscape on wide viewports, portrait on
    // phones / narrow tablets so doomscroll feels right by default.
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setViewMode("landscape");
    }
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

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

  // Keyboard nav: J/K and arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toUpperCase();
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        scrollTo(activeIndex + 1);
      }
      if (e.key === "ArrowUp" || e.key === "k" || e.key === "K") {
        e.preventDefault();
        scrollTo(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const scrollTo = (idx: number) => {
    const target = cardRefs.current[Math.max(0, Math.min(demos.length - 1, idx))];
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const atTop = activeIndex === 0;
  const atBottom = activeIndex === demos.length - 1;

  return (
    <div className="relative flex-1 overflow-hidden">
      <FeedControls
        currentTab={currentTab}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
      <div
        ref={containerRef}
        className="scroll-snap-y h-[calc(100dvh-var(--header-h))] overflow-y-auto"
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
                nearActive={Math.abs(i - activeIndex) <= 1}
                viewMode={viewMode}
              />
            </div>
          );
        })}
        <div className="snap-start grid h-[calc(100dvh-var(--header-h))] w-full place-items-center">
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

      {/* Up/down nav arrows — desktop only */}
      <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        <NavArrow
          direction="up"
          disabled={atTop}
          onClick={() => scrollTo(activeIndex - 1)}
        />
        <NavArrow
          direction="down"
          disabled={atBottom}
          onClick={() => scrollTo(activeIndex + 1)}
        />
        <div className="mt-1 text-center font-mono text-[10px] text-muted">
          {String(activeIndex + 1).padStart(2, "0")}
          <span className="text-muted/50">/{demos.length}</span>
        </div>
      </div>
    </div>
  );
}

function NavArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "up" | "down";
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "up" ? "Previous demo" : "Next demo"}
      className={cn(
        "pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/85 text-foreground/85 backdrop-blur-md transition",
        disabled
          ? "cursor-not-allowed opacity-30"
          : "hover:border-accent hover:bg-accent hover:text-black active:scale-95",
      )}
    >
      {direction === "up" ? (
        <ArrowUp className="h-5 w-5" strokeWidth={2.2} />
      ) : (
        <ArrowDown className="h-5 w-5" strokeWidth={2.2} />
      )}
    </button>
  );
}

function FeedControls({
  currentTab,
  viewMode,
  onViewModeChange,
}: {
  currentTab: string;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-wrap items-center justify-center gap-2 px-3 pt-3">
      <div className="pointer-events-auto glass flex items-center gap-1 rounded-full p-1">
        {FEED_TABS.map((t) => {
          const href = t.key === "for-you" ? "/" : `/?tab=${t.key}`;
          const active = currentTab === t.key;
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
      <div className="pointer-events-auto">
        <ViewModeSwitcher value={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  );
}
