"use client";

import { useState } from "react";
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
      aria-pressed={voted}
      className={cn(
        "group flex flex-col items-center justify-center gap-1 border-2 border-ink bg-paper-elev transition active:translate-y-px",
        large ? "w-[68px] py-2.5" : "w-12 py-1.5",
        voted ? "bg-accent" : "hover:bg-accent",
      )}
    >
      <span
        className={cn(
          "font-display leading-none",
          large ? "text-[26px]" : "text-[18px]",
        )}
        aria-hidden
      >
        ↑
      </span>
      <span
        className={cn(
          "num-tag font-semibold tabular-nums",
          large ? "text-[12px]" : "text-[10px]",
        )}
      >
        {formatCount(count)}
      </span>
      <span
        className={cn(
          "font-mono uppercase tracking-[0.18em] text-ink/70",
          large ? "text-[8px]" : "text-[7px]",
        )}
      >
        {voted ? "Voted" : "Vote"}
      </span>
    </button>
  );
}
