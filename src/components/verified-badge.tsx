import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  size?: "sm" | "md";
  className?: string;
};

export function VerifiedBadge({ size = "sm", className }: Props) {
  const dim = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <BadgeCheck
      className={cn("inline-block text-accent", dim, className)}
      strokeWidth={2.4}
      aria-label="Verified founder"
    />
  );
}

export function TrustChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/75">
      {label}
    </span>
  );
}
