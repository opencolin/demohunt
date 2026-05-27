import Link from "next/link";
import { MapPin, Calendar, Users, Camera } from "lucide-react";
import { demoDays, type DemoDay } from "@/lib/data";
import { SiteFooter } from "@/components/site-footer";

export default function DemoDaysPage() {
  const sorted = [...demoDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const upcoming = sorted.filter((d) => new Date(d.date).getTime() >= Date.now());
  const past = sorted.filter((d) => new Date(d.date).getTime() < Date.now());

  return (
    <>
    <main className="mx-auto w-full max-w-7xl px-5 py-8">
      <header className="grid grid-cols-1 gap-6 border-b-2 border-ink pb-6 md:grid-cols-[2fr_1fr] md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Section III · The Calendar
          </p>
          <h1 className="mt-1 font-display text-[64px] leading-[0.92] tracking-[-0.02em] sm:text-[96px]">
            Demo Days,
            <span className="italic font-light"> everywhere.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[14px] text-ink/85">
            A global calendar of demo days. We capture the public ones with
            permission and post the pitches here within 24 hours of the lights
            coming up.
          </p>
        </div>
        <Link
          href="#run-with-us"
          className="self-start border-2 border-ink bg-accent px-4 py-2 font-mono text-[12px] uppercase tracking-[0.18em] hover:bg-ink hover:text-accent"
        >
          Run a demo day with us →
        </Link>
      </header>

      <Block title="Upcoming" count={upcoming.length}>
        <div className="grid grid-cols-1 gap-0 border-2 border-ink md:grid-cols-2">
          {upcoming.map((dd, i) => (
            <DemoDayCell
              key={dd.id}
              dd={dd}
              rightBorder={i % 2 === 0}
              bottomBorder={i < upcoming.length - 2}
            />
          ))}
        </div>
      </Block>

      <Block title="Recently filed" count={past.length}>
        <div className="grid grid-cols-1 gap-0 border-2 border-ink md:grid-cols-2">
          {past.map((dd, i) => (
            <DemoDayCell
              key={dd.id}
              dd={dd}
              rightBorder={i % 2 === 0}
              bottomBorder={i < past.length - 2}
              past
            />
          ))}
        </div>
      </Block>

      <section
        id="run-with-us"
        className="mt-16 grid grid-cols-1 gap-0 border-2 border-ink md:grid-cols-[1fr_1.6fr]"
      >
        <div className="border-b-2 border-ink bg-ink p-6 text-paper md:border-b-0 md:border-r-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Editorial Services
          </p>
          <h2 className="mt-2 font-display text-[40px] leading-[0.95] tracking-tight">
            Run yours with us.
          </h2>
          <p className="mt-3 text-[13px] text-paper/80">
            We send a videographer. Or you stream it yourself with our recording
            kit. Either way, every pitch lands on Demo Hunt within 24 hours.
          </p>
          <a
            href="mailto:demos@demohunt.tv?subject=Run my demo day with you"
            className="mt-6 inline-flex border-2 border-accent bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:bg-paper"
          >
            Email demos@demohunt.tv →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3">
          <Perk
            label="On-site videographer"
            body="We show up, record every pitch, capture screen, ship the cuts."
          />
          <Perk
            label="DIY recording kit"
            body="Stream your event through our StreamYard template. Auto-published."
            border
          />
          <Perk
            label="Audience boost"
            body="Featured slot in the daily digest. ~12k VC & builder views."
          />
        </div>
      </section>
    </main>
    <SiteFooter />
    </>
  );
}

function DemoDayCell({
  dd,
  rightBorder,
  bottomBorder,
  past,
}: {
  dd: DemoDay;
  rightBorder?: boolean;
  bottomBorder?: boolean;
  past?: boolean;
}) {
  const d = new Date(dd.date);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const time = d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
  return (
    <article
      className={`flex gap-5 bg-paper-elev p-5 ${rightBorder ? "md:border-r-2 md:border-ink" : ""} ${bottomBorder ? "border-b-2 border-ink" : ""}`}
    >
      <div className="flex w-[68px] shrink-0 flex-col items-center justify-center border-2 border-ink bg-paper px-1 py-2 text-center">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
          {month}
        </span>
        <span className="font-display text-[34px] leading-none">{day}</span>
        <span className="num-tag mt-1 text-[9px] uppercase text-muted">{time}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-[22px] leading-tight tracking-tight">
            {dd.name}
          </h3>
          {past ? (
            <span className="border border-ink bg-paper px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
              Filed
            </span>
          ) : (
            <span className="border border-ink bg-accent px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em]">
              Upcoming
            </span>
          )}
          {dd.capturedBy === "demohunt" && (
            <span className="inline-flex items-center gap-1 border border-ink bg-ink px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
              <Camera className="h-2.5 w-2.5" />
              Our camera
            </span>
          )}
        </div>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Hosted by {dd.host}
        </p>
        <p className="mt-2 max-w-md text-[13px] text-ink/85 italic">
          <span className="font-display">“</span>
          {dd.blurb}
          <span className="font-display">”</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {dd.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dd.venue}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="num-tag">{dd.demoCount}</span> demos
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <a
            href={dd.registerUrl}
            className="border-2 border-ink bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent hover:bg-accent hover:text-ink"
          >
            {past ? "Watch pitches" : "Register"}
          </a>
          <Link
            href="/"
            className="border-2 border-ink bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-accent"
          >
            Past demos
          </Link>
        </div>
      </div>
    </article>
  );
}

function Block({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between border-b border-ink/30 pb-1">
        <h2 className="font-display text-[28px] leading-none tracking-tight">{title}</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {String(count).padStart(2, "0")} entries
        </span>
      </div>
      {children}
    </section>
  );
}

function Perk({ label, body, border }: { label: string; body: string; border?: boolean }) {
  return (
    <div
      className={`bg-paper-elev p-5 ${border ? "border-y-2 border-ink sm:border-x-2 sm:border-y-0" : ""}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-[16px] leading-snug">{body}</p>
    </div>
  );
}
