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
        "group flex flex-col items-center gap-1 rounded-2xl border transition active:scale-95",
        large ? "px-3 py-3 w-16" : "px-2 py-2 w-12",
        voted
          ? "border-accent bg-accent text-black"
          : "border-border bg-surface text-foreground hover:border-accent/60",
      )}
      aria-pressed={voted}
    >
      <ChevronUp
        className={cn(
          large ? "h-5 w-5" : "h-4 w-4",
          "transition-transform group-active:-translate-y-0.5",
        )}
        strokeWidth={2.5}
      />
      <span
        className={cn(
          "font-mono tabular-nums",
          large ? "text-[13px]" : "text-[11px]",
        )}
      >
        {formatCount(count)}
      </span>
    </button>
  );
}
