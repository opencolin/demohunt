"use client";

import { RectangleVertical, RectangleHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "portrait" | "landscape";

type Props = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewModeSwitcher({ value, onChange }: Props) {
  return (
    <div className="glass flex items-center gap-0.5 rounded-full p-0.5">
      <ModeButton
        active={value === "portrait"}
        onClick={() => onChange("portrait")}
        label="Portrait"
      >
        <RectangleVertical className="h-3.5 w-3.5" strokeWidth={2} />
      </ModeButton>
      <ModeButton
        active={value === "landscape"}
        onClick={() => onChange("landscape")}
        label="Landscape"
      >
        <RectangleHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
      </ModeButton>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full transition",
        active
          ? "bg-foreground text-background"
          : "text-foreground/70 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
