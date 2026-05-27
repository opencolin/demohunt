import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Clock, Mail, ArrowUpRight, Calendar, ArrowLeft, MessageCircle } from "lucide-react";
import { UpvoteButton } from "@/components/upvote-button";
import { demoById, demos, founderBySlug } from "@/lib/data";
import { formatCount, timeAgo } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";

type Props = { params: Promise<{ id: string }> };

export default async function DemoPage({ params }: Props) {
  const { id } = await params;
  const demo = demoById(id);
  if (!demo) notFound();
  const founder = founderBySlug(demo.founderSlug);
  if (!founder) notFound();

  const related = demos
    .filter((d) => d.id !== demo.id && d.tags.some((t) => demo.tags.includes(t)))
    .slice(0, 4);

  return (
    <>
    <main className="mx-auto w-full max-w-6xl px-5 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted ink-link"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to the feed
      </Link>

      <article className="mt-4">
        <header className="border-b-2 border-ink pb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Demo File · No. {String(demo.id).padStart(4, "0")} ·{" "}
            {demo.sourceLabel ?? "Founder filed"}
          </p>
          <h1 className="mt-2 font-display text-[44px] leading-[0.95] tracking-[-0.02em] sm:text-[72px]">
            {demo.title.split(" — ")[0]}
            {demo.title.includes(" — ") && (
              <span className="block font-light italic">
                {demo.title.split(" — ").slice(1).join(" — ")}
              </span>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] italic text-ink/85">
            <span className="font-display">“</span>
            {demo.tagline}
            <span className="font-display">”</span>
          </p>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="aspect-video w-full overflow-hidden border-2 border-ink bg-ink cover-shadow">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${demo.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                className="h-full w-full"
                title={demo.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-5 flex items-start gap-4">
              <UpvoteButton initial={demo.upvotes} />
              <div className="min-w-0 flex-1 border-2 border-ink bg-paper-elev px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  <Link
                    href={`/founders/${founder.slug}`}
                    className="inline-flex items-center gap-2 text-ink"
                  >
                    <span className="grid h-6 w-6 place-items-center border border-ink bg-paper font-display text-[10px] leading-none">
                      {founder.avatar}
                    </span>
                    By {founder.name}
                  </Link>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span className="num-tag">{formatCount(demo.views)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span className="num-tag">{formatCount(demo.comments)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="num-tag">{demo.durationSec}″</span>
                  </span>
                  <span>·</span>
                  <span>Filed {timeAgo(demo.postedAt)} ago</span>
                  {demo.sourceLabel && (
                    <span className="inline-flex items-center gap-1 border border-ink bg-paper px-1.5 py-0.5">
                      <Calendar className="h-3 w-3" />
                      {demo.sourceLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <section className="mt-6">
              <div className="mb-2 flex items-end justify-between border-b border-ink/30 pb-1">
                <h2 className="font-display text-[20px] leading-none tracking-tight">
                  About this demo
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  Pull quote
                </span>
              </div>
              <p className="font-display text-[22px] leading-snug tracking-tight first-letter:text-[64px] first-letter:font-light first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
                {demo.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {demo.tags.map((t) => (
                  <span
                    key={t}
                    className="border-2 border-ink bg-paper-elev px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <div className="mb-3 flex items-end justify-between border-b-2 border-ink pb-2">
                <h2 className="font-display text-[24px] leading-none tracking-tight">
                  Letters to the editor
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  {SAMPLE_COMMENTS.length} replies
                </span>
              </div>
              <div className="border-2 border-ink bg-paper-elev p-4">
                <textarea
                  rows={3}
                  placeholder="Ask the founder a question…"
                  className="w-full border-2 border-ink bg-paper px-3 py-2 text-[13px] focus:bg-accent/30 focus:outline-none"
                />
                <div className="mt-2 flex justify-end">
                  <button className="border-2 border-ink bg-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:bg-accent hover:text-ink">
                    Post letter
                  </button>
                </div>
              </div>
              <ul className="mt-4 divide-y-2 divide-ink/15 border-y-2 border-ink/15">
                {SAMPLE_COMMENTS.map((c) => (
                  <li key={c.id} className="py-4">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      <span className="grid h-6 w-6 place-items-center border-2 border-ink bg-paper-elev font-display text-[12px] leading-none">
                        {c.author[0]}
                      </span>
                      <span className="text-ink">{c.author}</span>
                      <span>· {c.ago} ago</span>
                    </div>
                    <p className="mt-2 max-w-prose text-[14px] text-ink/90 italic">
                      <span className="font-display">“</span>
                      {c.body}
                      <span className="font-display">”</span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-5">
            <div className="border-2 border-ink bg-paper-elev p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                The founder
              </p>
              <Link
                href={`/founders/${founder.slug}`}
                className="mt-3 flex items-center gap-3"
              >
                <span className="grid h-12 w-12 place-items-center border-2 border-ink bg-accent font-display text-[18px] leading-none">
                  {founder.avatar}
                </span>
                <span>
                  <span className="block font-display text-[20px] leading-none tracking-tight">
                    {founder.name}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    @{founder.handle}
                  </span>
                </span>
              </Link>
              <p className="mt-3 text-[12px] italic text-ink/80">{founder.bio}</p>
              <div className="mt-4 space-y-2">
                <a
                  href={`mailto:${founder.email}?subject=Re: ${demo.title}`}
                  className="flex items-center justify-center gap-2 border-2 border-ink bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:bg-accent hover:text-ink"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact founder
                </a>
                {founder.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-center gap-2 border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-accent"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="border-2 border-ink bg-paper-elev">
              <p className="border-b-2 border-ink bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                Related dispatches
              </p>
              <ul className="divide-y-2 divide-ink/15">
                {related.map((r, idx) => (
                  <li key={r.id}>
                    <Link
                      href={`/demo/${r.id}`}
                      className="group flex gap-3 p-3 hover:bg-paper"
                    >
                      <span className="num-tag w-6 font-display text-[18px] leading-none text-ink/70">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="relative aspect-video w-20 shrink-0 overflow-hidden border border-ink bg-ink">
                        <img
                          src={`https://i.ytimg.com/vi/${r.youtubeId}/mqdefault.jpg`}
                          alt=""
                          className="h-full w-full object-cover opacity-90"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-display text-[14px] leading-tight">
                          {r.title}
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                          <span className="num-tag">{formatCount(r.upvotes)}</span>{" "}
                          votes · <span className="num-tag">{r.durationSec}″</span>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </main>
    <SiteFooter />
    </>
  );
}

const SAMPLE_COMMENTS = [
  {
    id: "c1",
    author: "Marc",
    ago: "1h",
    body: "Strong opener. Would buy if the API supports webhooks.",
  },
  {
    id: "c2",
    author: "Jess",
    ago: "3h",
    body: "Founders: what's the retention curve look like at day 30?",
  },
  {
    id: "c3",
    author: "Owen",
    ago: "5h",
    body: "We're a customer. Onboarding took 4 minutes. Confirmed not a lie.",
  },
];
