import Link from "next/link";
import { ChevronUp, Eye, Clock, Sparkles, Flame, Calendar, Bot } from "lucide-react";
import {
  demos,
  founderBySlug,
  type Demo,
} from "@/lib/data";
import { formatCount, timeAgo } from "@/lib/utils";

const lists: { key: string; title: string; subtitle: string; filter: (d: Demo) => boolean; icon: React.ReactNode; accent: string }[] = [
  {
    key: "top-today",
    title: "Top today",
    subtitle: "Most-upvoted in the last 24h",
    filter: (d) => Date.now() - new Date(d.postedAt).getTime() < 36 * 3600 * 1000,
    icon: <Flame className="h-3.5 w-3.5" />,
    accent: "text-orange-300",
  },
  {
    key: "rising",
    title: "Rising fast",
    subtitle: "Velocity > 100 upvotes/hour",
    filter: () => true,
    icon: <Sparkles className="h-3.5 w-3.5" />,
    accent: "text-yellow-300",
  },
  {
    key: "from-demo-days",
    title: "From demo days",
    subtitle: "Captured live in San Francisco, Boston, Bangalore",
    filter: (d) => d.source === "demo-day",
    icon: <Calendar className="h-3.5 w-3.5" />,
    accent: "text-cyan-300",
  },
  {
    key: "ai-only",
    title: "AI-generated",
    subtitle: "100% synthetic. Filter on or off.",
    filter: (d) => d.source === "ai-generated",
    icon: <Bot className="h-3.5 w-3.5" />,
    accent: "text-purple-300",
  },
];

export default function DiscoverPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Discover</h1>
        <p className="mt-1 text-sm text-muted">
          Curated lists. Subscribe to any list to get it in your inbox.
        </p>
      </header>

      <DigestBar />

      <div className="mt-8 grid grid-cols-1 gap-8">
        {lists.map((list) => {
          const items = demos
            .filter(list.filter)
            .sort((a, b) => b.upvotes - a.upvotes)
            .slice(0, 6);
          if (items.length === 0) return null;
          return (
            <section key={list.key}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md bg-surface ${list.accent}`}>
                    {list.icon}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold leading-tight">{list.title}</h2>
                    <p className="text-xs text-muted">{list.subtitle}</p>
                  </div>
                </div>
                <button className="rounded-full border border-border px-3 py-1 text-[11px] text-muted hover:border-accent hover:text-foreground">
                  Subscribe
                </button>
              </div>
              <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
                {items.map((d, idx) => (
                  <DemoRow key={d.id} demo={d} rank={idx + 1} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function DemoRow({ demo, rank }: { demo: Demo; rank: number }) {
  const founder = founderBySlug(demo.founderSlug);
  return (
    <li className="flex items-center gap-4 px-4 py-3 transition hover:bg-surface-2">
      <span className="w-6 text-right font-mono text-[12px] text-muted">{rank}</span>
      <Link
        href={`/demo/${demo.id}`}
        className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md border border-border bg-black"
      >
        <img
          src={`https://i.ytimg.com/vi/${demo.youtubeId}/mqdefault.jpg`}
          alt=""
          className="h-full w-full object-cover opacity-90"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 font-mono text-[10px] text-white">
          {demo.durationSec}s
        </span>
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/demo/${demo.id}`}
          className="line-clamp-1 text-[14px] font-medium hover:text-accent"
        >
          {demo.title}
        </Link>
        <p className="line-clamp-1 text-[12px] text-muted">{demo.tagline}</p>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted">
          {founder && (
            <Link href={`/founders/${founder.slug}`} className="hover:text-foreground">
              @{founder.handle}
            </Link>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatCount(demo.views)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(demo.postedAt)}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-md border border-border px-2 py-1.5">
        <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span className="font-mono text-[11px] tabular-nums">{formatCount(demo.upvotes)}</span>
      </div>
    </li>
  );
}

function DigestBar() {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">The Demo Hunt Digest</p>
        <p className="mt-0.5 text-xs text-muted">
          Top demos in your inbox. Daily, weekly, or monthly.
        </p>
      </div>
      <form className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@startup.com"
          className="rounded-full border border-border bg-background px-3.5 py-2 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <select className="rounded-full border border-border bg-background px-3 py-2 text-[13px] text-foreground focus:border-accent focus:outline-none">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
        <button className="rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-black hover:bg-accent-soft">
          Subscribe
        </button>
      </form>
    </div>
  );
}
