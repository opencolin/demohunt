const ITEMS = [
  "ReelForge +127 in 1h",
  "NEW: 41 demos from MIT AI Studio",
  "DialPie clears 14,000 calls in a day",
  "OrbitLab tops the Devtools chart for 5th straight day",
  "Sentry merges PR #1,000 unattended",
  "CarbonLedger goes on-chain Tuesday",
  "VetCheck catches 31% more tumors than the average vet",
  "Pip ships in a literal Cheerios box",
  "Submissions for SF Demo Day close Friday",
  "LiveSignal closes 12 deals on the demo call",
];

const SEP = "  ✦  ";

export function Ticker() {
  const stream = ITEMS.join(SEP);
  const full = `${stream}${SEP}${stream}${SEP}`;
  return (
    <div className="border-b-2 border-ink bg-ink text-paper overflow-hidden">
      <div className="flex items-center">
        <span className="shrink-0 bg-accent text-ink px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-mono font-semibold border-r-2 border-ink">
          The Wire ⟶
        </span>
        <div className="flex-1 overflow-hidden py-1">
          <div className="marquee-track text-[12px] font-mono text-paper/90">
            <span className="px-3">{full}</span>
            <span className="px-3" aria-hidden>
              {full}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
