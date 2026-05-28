"use client";

import { useEffect, useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "demohunt:follows";

type Props = {
  founderSlug: string;
  founderName?: string;
  variant?: "pill" | "tile";
  onClick?: (e: React.MouseEvent) => void;
};

function readFollows(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeFollows(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new CustomEvent("demohunt:follows-changed"));
}

export function FollowButton({ founderSlug, founderName, variant = "pill", onClick }: Props) {
  const [following, setFollowing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFollowing(readFollows().includes(founderSlug));
    const handler = () => setFollowing(readFollows().includes(founderSlug));
    window.addEventListener("demohunt:follows-changed", handler);
    return () => window.removeEventListener("demohunt:follows-changed", handler);
  }, [founderSlug]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
    const current = readFollows();
    const next = current.includes(founderSlug)
      ? current.filter((s) => s !== founderSlug)
      : [...current, founderSlug];
    writeFollows(next);
    setFollowing(!following);
  };

  const label = following ? "Following" : "Follow";
  const ariaLabel = founderName ? `${label} ${founderName}` : label;

  if (variant === "tile") {
    return (
      <button
        onClick={toggle}
        aria-pressed={mounted && following}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition active:scale-[0.97]",
          mounted && following
            ? "border border-border bg-surface text-foreground hover:bg-surface-2"
            : "bg-foreground text-background hover:bg-foreground/90",
        )}
      >
        {mounted && following ? (
          <Check className="h-4 w-4" strokeWidth={2.4} />
        ) : (
          <UserPlus className="h-4 w-4" strokeWidth={2.2} />
        )}
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={mounted && following}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition active:scale-[0.97]",
        mounted && following
          ? "border border-white/25 bg-white/10 text-white/90 hover:bg-white/15"
          : "bg-white text-black hover:bg-white/90",
      )}
    >
      {mounted && following ? (
        <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
      ) : (
        <UserPlus className="h-3.5 w-3.5" strokeWidth={2.4} />
      )}
      {label}
    </button>
  );
}
