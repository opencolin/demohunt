"use client";

type Props = {
  durationSec: number;
  active: boolean;
};

export function VideoProgress({ durationSec, active }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[3px] bg-white/15">
      <div
        key={active ? `on-${durationSec}` : "off"}
        className="h-full origin-left bg-accent"
        style={
          active
            ? {
                animation: `demo-progress ${durationSec}s linear infinite`,
              }
            : { transform: "scaleX(0)" }
        }
      />
    </div>
  );
}
