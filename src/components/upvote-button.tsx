"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn, formatCount } from "@/lib/utils";

type Props = {
  initial: number;
  size?: "sm" | "lg";
};

export function UpvoteButton({ initial, size = "lg" }: Props) {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(initial);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVoted((v) => {
      setCount((c) => (v ? c - 1 : c + 1));
      return !v;
    });
  };

  const large = size === "lg";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center gap-0.5 rounded-2xl border transition active:scale-95",
        large ? "w-[68px] px-2 py-3" : "w-12 px-1.5 py-2",
        voted
          ? "border-accent bg-accent text-black"
          : "border-border bg-surface/80 text-foreground backdrop-blur-md hover:border-accent/60",
      )}
      aria-pressed={voted}
      aria-label={voted ? "Remove vote" : "Upvote"}
    >
      <ChevronUp
        className={cn(
          large ? "h-6 w-6" : "h-4 w-4",
          "transition-transform group-active:-translate-y-0.5",
        )}
        strokeWidth={2.4}
      />
      <span
        className={cn(
          "font-mono tabular-nums",
          large ? "text-[13px] font-semibold" : "text-[11px]",
        )}
      >
        {formatCount(count)}
      </span>
      {large && (
        <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
          {voted ? "Voted" : "Vote"}
        </span>
      )}
    </button>
  );
}
