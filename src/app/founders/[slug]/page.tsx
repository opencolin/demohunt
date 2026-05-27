import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Mail, ArrowUpRight, Eye, Clock } from "lucide-react";
import { demosByFounder, founderBySlug } from "@/lib/data";
import { formatCount, timeAgo } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";

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
    <>
    <main className="mx-auto w-full max-w-6xl px-5 py-8">
      {/* Dossier header */}
      <div className="border-2 border-ink bg-paper-elev">
        <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-2 text-paper">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Founder File · No. {founder.slug.slice(0, 3).toUpperCase()}-
            {String(founder.handle.length).padStart(2, "0")}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">
            Demo Hunt archive
          </p>
        </div>
        <div className="grid grid-cols-1 gap-0 md:grid-cols-[auto_1fr_auto]">
          <div className="grid h-32 w-32 place-items-center border-b-2 border-ink bg-accent md:h-auto md:w-40 md:border-b-0 md:border-r-2">
            <span className="font-display text-[64px] leading-none">
              {founder.avatar}
            </span>
          </div>
          <div className="border-b-2 border-ink p-6 md:border-b-0 md:border-r-2">
            <h1 className="font-display text-[48px] leading-[0.95] tracking-[-0.015em] sm:text-[64px]">
              {founder.name}
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              @{founder.handle}{" "}
              <span className="inline-flex items-center gap-1 normal-case tracking-normal">
                · <MapPin className="h-3 w-3" /> {founder.location}
              </span>
            </p>
            <p className="mt-4 max-w-xl text-[15px] italic text-ink/85">
              <span className="font-display">“</span>
              {founder.bio}
              <span className="font-display">”</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {founder.tags.map((t) => (
                <span
                  key={t}
                  className="border border-ink bg-paper px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em]"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`mailto:${founder.email}`}
                className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:bg-accent hover:text-ink"
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
                  className="inline-flex items-center gap-2 border-2 border-ink bg-paper px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-accent"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-1 md:divide-y-2 md:divide-ink">
            <Stat label="Demos" value={founderDemos.length} />
            <Stat label="Upvotes" value={formatCount(totalUpvotes)} />
            <Stat label="Views" value={formatCount(totalViews)} />
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between border-b-2 border-ink pb-2">
          <h2 className="font-display text-[28px] leading-none tracking-tight">
            All demos
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Listed newest first
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {founderDemos.map((d, idx) => (
            <Link
              key={d.id}
              href={`/demo/${d.id}`}
              className="group border-2 border-ink bg-paper-elev p-3 hover:bg-accent"
            >
              <div className="relative aspect-video overflow-hidden border-2 border-ink bg-ink">
                <img
                  src={`https://i.ytimg.com/vi/${d.youtubeId}/mqdefault.jpg`}
                  alt=""
                  className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                />
                <span className="absolute bottom-1 right-1 num-tag bg-paper px-1 text-[9px] uppercase">
                  {d.durationSec}″
                </span>
                <span className="absolute left-1 top-1 num-tag bg-ink px-1 text-[9px] uppercase text-accent">
                  No. {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-2 font-display text-[18px] leading-tight tracking-tight">
                {d.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-[12px] text-ink/80 italic">
                {d.tagline}
              </p>
              <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                <span className="inline-flex items-center gap-1">
                  <span aria-hidden>↑</span>
                  <span className="num-tag">{formatCount(d.upvotes)}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span className="num-tag">{formatCount(d.views)}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeAgo(d.postedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
    <SiteFooter />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-4 text-center md:px-8 md:py-6">
      <span className="font-display text-[32px] leading-none">{value}</span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
    </div>
  );
}
