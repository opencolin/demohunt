import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Mail, ExternalLink, Eye, ChevronUp, Clock } from "lucide-react";
import { demosByFounder, founderBySlug } from "@/lib/data";
import { formatCount, timeAgo } from "@/lib/utils";
import { FollowButton } from "@/components/follow-button";
import { VerifiedBadge } from "@/components/verified-badge";

type Props = { params: Promise<{ slug: string }> };

export default async function FounderPage({ params }: Props) {
  const { slug } = await params;
  const founder = founderBySlug(slug);
  if (!founder) notFound();
  const founderDemos = demosByFounder(slug).sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  );
  const totalViews = founderDemos.reduce((s, d) => s + d.views, 0);
  const totalUpvotes = founderDemos.reduce((s, d) => s + d.upvotes, 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-soft text-2xl font-bold text-black">
          {founder.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight">
            {founder.name}
            {founder.verified && <VerifiedBadge size="md" />}
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            @{founder.handle}
            <span className="mx-2">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {founder.location}
            </span>
            {typeof founder.followers === "number" && (
              <>
                <span className="mx-2">·</span>
                <span className="font-mono">{formatCount(founder.followers)}</span> followers
              </>
            )}
          </p>
          {founder.badges && founder.badges.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {founder.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
          <p className="mt-3 max-w-2xl text-[14px] text-foreground/90">{founder.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {founder.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] text-muted"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <FollowButton
              founderSlug={founder.slug}
              founderName={founder.name}
              variant="tile"
            />
            <a
              href={`mailto:${founder.email}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2.5 text-[13px] font-medium text-foreground hover:border-accent"
            >
              <Mail className="h-3.5 w-3.5" />
              {founder.email}
            </a>
            {founder.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2.5 text-[13px] text-foreground hover:border-accent"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-3">
          <Stat label="Demos" value={founderDemos.length} />
          <Stat label="Upvotes" value={formatCount(totalUpvotes)} />
          <Stat label="Views" value={formatCount(totalViews)} />
        </div>
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-muted">All demos</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {founderDemos.map((d) => (
            <Link
              key={d.id}
              href={`/demo/${d.id}`}
              className="group rounded-2xl border border-border bg-surface p-3 transition hover:border-accent/60"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black">
                <img
                  src={`https://i.ytimg.com/vi/${d.youtubeId}/mqdefault.jpg`}
                  alt=""
                  className="h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 font-mono text-[10px] text-white">
                  {d.durationSec}s
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 text-[13px] font-medium leading-snug group-hover:text-accent">
                {d.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-[11px] text-muted">{d.tagline}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted">
                <span className="inline-flex items-center gap-0.5">
                  <ChevronUp className="h-3 w-3" />
                  {formatCount(d.upvotes)}
                </span>
                <span className="inline-flex items-center gap-0.5">
                  <Eye className="h-3 w-3" />
                  {formatCount(d.views)}
                </span>
                <span className="inline-flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  {timeAgo(d.postedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
      <p className="font-mono text-[15px] font-semibold leading-none">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}
