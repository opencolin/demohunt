import Link from "next/link";
import { MapPin, Calendar, Users, Camera, Globe } from "lucide-react";
import { demoDays, type DemoDay } from "@/lib/data";

export default function DemoDaysPage() {
  const sorted = [...demoDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Demo Days</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Every demo day on the planet — in one calendar. We capture the public
            ones with permission and post the pitches here within 24 hours.
          </p>
        </div>
        <Link
          href="#run-with-us"
          className="self-start rounded-full border border-border px-4 py-2 text-[13px] text-foreground hover:border-accent"
        >
          Run a demo day with us
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {sorted.map((dd) => (
          <DemoDayCard key={dd.id} dd={dd} />
        ))}
      </div>

      <section
        id="run-with-us"
        className="mt-12 rounded-3xl border border-border bg-surface p-6"
      >
        <h2 className="text-lg font-semibold">Run your demo day with us</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          We send a videographer (or you stream it yourself with our recording
          kit). Every pitch lands on Demo Hunt within 24 hours, with founder
          attribution and a permanent link.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <PerkCard
            icon={<Camera className="h-4 w-4" />}
            title="On-site videographer"
            body="We show up, record every pitch, capture screen, ship the cuts."
          />
          <PerkCard
            icon={<Globe className="h-4 w-4" />}
            title="DIY recording kit"
            body="Stream your event through our StreamYard template. Auto-published."
          />
          <PerkCard
            icon={<Users className="h-4 w-4" />}
            title="Audience boost"
            body="Featured slot in the daily digest. Avg 12k VC & builder views."
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="mailto:demos@demohunt.tv?subject=Run my demo day with you"
            className="rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-black hover:bg-accent-soft"
          >
            Get in touch
          </a>
          <Link
            href="/submit"
            className="rounded-full border border-border px-4 py-2 text-[13px] text-foreground hover:border-accent"
          >
            Or just submit your demo
          </Link>
        </div>
      </section>
    </main>
  );
}

function DemoDayCard({ dd }: { dd: DemoDay }) {
  const d = new Date(dd.date);
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const time = d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
  const past = d.getTime() < Date.now();

  return (
    <article className="group relative flex gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-accent/50">
      <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-background py-2 text-center">
        <span className="text-[10px] uppercase tracking-wider text-muted">{month}</span>
        <span className="font-mono text-2xl font-semibold leading-none">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-semibold leading-tight">{dd.name}</h3>
          {past ? (
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
              Past
            </span>
          ) : (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">
              Upcoming
            </span>
          )}
          {dd.capturedBy === "demohunt" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] text-cyan-300">
              <Camera className="h-3 w-3" />
              We're recording
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[12px] text-muted">Hosted by {dd.host}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {time}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {dd.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            {dd.demoCount} demos
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] text-foreground/80">{dd.blurb}</p>
        <div className="mt-3 flex gap-2">
          <a
            href={dd.registerUrl}
            className="rounded-full bg-foreground px-3 py-1 text-[12px] font-medium text-background hover:bg-foreground/90"
          >
            {past ? "Watch pitches" : "Register"}
          </a>
          <Link
            href={`/`}
            className="rounded-full border border-border px-3 py-1 text-[12px] text-foreground hover:border-accent"
          >
            See past demos
          </Link>
        </div>
      </div>
    </article>
  );
}

function PerkCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-surface text-accent">
        {icon}
      </span>
      <p className="mt-2 text-[13px] font-medium">{title}</p>
      <p className="mt-0.5 text-[12px] text-muted">{body}</p>
    </div>
  );
}
