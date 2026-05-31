"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn, formatCount } from "@/lib/utils";

const STORAGE_KEY = "demohunt:upvotes";

type Props = {
  initial: number;
  size?: "sm" | "lg";
  /**
   * Demo id. When provided, the vote is persisted to localStorage and synced
   * to the server. When omitted, the button keeps its original ephemeral
   * behaviour so existing call sites work unchanged.
   */
  demoId?: string;
};

function readUpvotes(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUpvotes(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function UpvoteButton({ initial, size = "lg", demoId }: Props) {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(initial);

  // Hydrate from localStorage so votes survive reloads (only when we have an id).
  useEffect(() => {
    if (!demoId) return;
    if (readUpvotes().includes(demoId)) {
      setVoted(true);
      setCount((c) => c + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoId]);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVoted((v) => {
      const willVote = !v;
      setCount((c) => (willVote ? c + 1 : c - 1));

      if (demoId) {
        // Optimistic localStorage update — authoritative when signed-out.
        const current = readUpvotes();
        const next = willVote
          ? [...new Set([...current, demoId])]
          : current.filter((id) => id !== demoId);
        writeUpvotes(next);

        // Best-effort server sync; persisted:true (signed-in + DB) is
        // authoritative, otherwise localStorage stands. Errors are ignored.
        void fetch(`/api/upvote/${encodeURIComponent(demoId)}`, {
          method: willVote ? "POST" : "DELETE",
        }).catch(() => {
          /* offline / no session — localStorage already reflects the change */
        });
      }

      return willVote;
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
