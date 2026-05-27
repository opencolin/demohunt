import Link from "next/link";
import { Eye, Flame, Sparkles, Calendar, Bot } from "lucide-react";
import {
  demos,
  founderBySlug,
  type Demo,
} from "@/lib/data";
import { formatCount, timeAgo } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";

const lists: {
  key: string;
  title: string;
  kicker: string;
  subtitle: string;
  filter: (d: Demo) => boolean;
  icon: React.ReactNode;
}[] = [
  {
    key: "top-today",
    title: "On the Front Page",
    kicker: "Today",
    subtitle: "What the algorithm picked at 09:00 PT.",
    filter: (d) => Date.now() - new Date(d.postedAt).getTime() < 36 * 3600 * 1000,
    icon: <Flame className="h-3.5 w-3.5" />,
  },
  {
    key: "rising",
    title: "Climbing the Chart",
    kicker: "Velocity",
    subtitle: "Most upvotes per hour, weighted against age.",
    filter: () => true,
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  {
    key: "from-demo-days",
    title: "From the Demo Floor",
    kicker: "Live capture",
    subtitle: "Pitches our cameras grabbed this week.",
    filter: (d) => d.source === "demo-day",
    icon: <Calendar className="h-3.5 w-3.5" />,
  },
  {
    key: "ai-only",
    title: "Synthesised",
    kicker: "AI-only",
    subtitle: "100% generative. Tag exists so you can hide it — or seek it.",
    filter: (d) => d.source === "ai-generated",
    icon: <Bot className="h-3.5 w-3.5" />,
  },
];

export default function DiscoverPage() {
  return (
    <>
    <main className="mx-auto w-full max-w-7xl px-5 py-8">
      <PageHead
        kicker="Section II"
        title="Discover"
        sub="Curated lists, refreshed nightly. Subscribe to any of them — we'll deliver to your inbox."
      />

      <Digest />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {lists.map((list, listIdx) => {
          const items = [...demos]
            .filter(list.filter)
            .sort((a, b) => b.upvotes - a.upvotes)
            .slice(0, 6);
          if (items.length === 0) return null;
          return (
            <section key={list.key} className="lg:col-span-6">
              <header className="mb-4 flex items-end justify-between border-b-2 border-ink pb-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    No. {String(listIdx + 1).padStart(2, "0")} · {list.kicker}
                  </p>
                  <h2 className="mt-1 font-display text-[30px] leading-none tracking-tight">
                    {list.title}
                  </h2>
                  <p className="mt-1 max-w-md text-[13px] text-ink/75">{list.subtitle}</p>
                </div>
                <button className="hidden border-2 border-ink bg-paper-elev px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-accent sm:inline-flex">
                  Subscribe
                </button>
              </header>
              <ol className="divide-y-2 divide-ink/15">
                {items.map((d, idx) => (
                  <DemoRow key={d.id} demo={d} rank={idx + 1} />
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </main>
    <SiteFooter />
    </>
  );
}

function DemoRow({ demo, rank }: { demo: Demo; rank: number }) {
  const founder = founderBySlug(demo.founderSlug);
  return (
    <li className="group flex items-center gap-4 py-3 transition hover:bg-paper-elev">
      <span className="num-tag w-9 text-right font-display text-[28px] leading-none text-ink/80">
        {String(rank).padStart(2, "0")}
      </span>
      <Link
        href={`/demo/${demo.id}`}
        className="relative aspect-video w-32 shrink-0 overflow-hidden border-2 border-ink bg-ink"
      >
        <img
          src={`https://i.ytimg.com/vi/${demo.youtubeId}/mqdefault.jpg`}
          alt=""
          className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
        />
        <span className="absolute bottom-1 right-1 num-tag bg-paper px-1 text-[9px] uppercase">
          {demo.durationSec}″
        </span>
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/demo/${demo.id}`}
          className="font-display text-[18px] leading-tight tracking-[-0.01em] group-hover:underline group-hover:decoration-accent group-hover:decoration-4 group-hover:underline-offset-[3px]"
        >
          {demo.title}
        </Link>
        <p className="mt-0.5 line-clamp-1 text-[12px] text-ink/75 italic">{demo.tagline}</p>
        <div className="mt-1 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {founder && (
            <Link href={`/founders/${founder.slug}`}>@{founder.handle}</Link>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span className="num-tag">{formatCount(demo.views)}</span>
          </span>
          <span>{timeAgo(demo.postedAt)}</span>
        </div>
      </div>
      <div className="flex w-12 shrink-0 flex-col items-center border-2 border-ink bg-paper-elev py-1 group-hover:bg-accent">
        <span className="font-display text-[18px] leading-none" aria-hidden>
          ↑
        </span>
        <span className="num-tag text-[10px]">{formatCount(demo.upvotes)}</span>
      </div>
    </li>
  );
}

function PageHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <header className="border-b-2 border-ink pb-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {kicker}
      </p>
      <h1 className="mt-1 font-display text-[64px] leading-[0.92] tracking-[-0.02em] sm:text-[88px]">
        {title}
      </h1>
      {sub && <p className="mt-3 max-w-xl text-[14px] text-ink/80">{sub}</p>}
    </header>
  );
}

function Digest() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-0 border-2 border-ink bg-paper-elev md:grid-cols-[1.2fr_1fr]">
      <div className="border-b-2 border-ink p-6 md:border-b-0 md:border-r-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          The Wire — newsletter
        </p>
        <h3 className="mt-2 font-display text-[32px] leading-none tracking-tight">
          The Demo Hunt Digest
        </h3>
        <p className="mt-3 max-w-md text-[13px] text-ink/80">
          Top demos in your inbox. We pick three. You read for two minutes. You move
          on with your day.
        </p>
      </div>
      <form className="flex flex-col gap-3 p-6">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Email
          </span>
          <input
            type="email"
            required
            placeholder="you@startup.com"
            className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 text-[14px] focus:outline-none focus:bg-accent/30"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Cadence
          </span>
          <select className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 text-[14px] focus:outline-none focus:bg-accent/30">
            <option>Daily — every weekday at 09:00 PT</option>
            <option>Weekly — Saturday morning</option>
            <option>Monthly — best of the month</option>
          </select>
        </label>
        <button className="border-2 border-ink bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:bg-accent hover:text-ink">
          Subscribe →
        </button>
      </form>
    </div>
  );
}
