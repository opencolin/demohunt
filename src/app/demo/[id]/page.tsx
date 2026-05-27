import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Clock, MessageCircle, Mail, ExternalLink, Calendar, ArrowLeft } from "lucide-react";
import { UpvoteButton } from "@/components/upvote-button";
import { demoById, demos, founderBySlug } from "@/lib/data";
import { formatCount, timeAgo } from "@/lib/utils";

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
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to feed
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <article>
          <div className="overflow-hidden rounded-3xl border border-border bg-black shadow-[0_30px_80px_-30px_rgba(255,90,60,0.25)]">
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${demo.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                className="absolute inset-0 h-full w-full"
                title={demo.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <UpvoteButton initial={demo.upvotes} />
            <div className="min-w-0 flex-1">
              <h1 className="text-[22px] font-semibold leading-tight tracking-tight">
                {demo.title}
              </h1>
              <p className="mt-1 text-[14px] text-foreground/85">{demo.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-muted">
                <Link
                  href={`/founders/${founder.slug}`}
                  className="inline-flex items-center gap-2 text-foreground hover:text-accent"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-[10px] font-bold text-black">
                    {founder.avatar}
                  </span>
                  {founder.name}
                </Link>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatCount(demo.views)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {formatCount(demo.comments)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {demo.durationSec}s
                </span>
                <span>· {timeAgo(demo.postedAt)} ago</span>
                {demo.sourceLabel && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5">
                    <Calendar className="h-3 w-3" />
                    {demo.sourceLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-medium text-muted">About this demo</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground/90">
              {demo.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {demo.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-sm font-medium text-muted">Discussion</h2>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <textarea
                rows={3}
                placeholder="Ask the founder a question…"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <div className="mt-2 flex justify-end">
                <button className="rounded-full bg-accent px-4 py-1.5 text-[12px] font-medium text-black hover:bg-accent-soft">
                  Post comment
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-3">
              {SAMPLE_COMMENTS.map((c) => (
                <li
                  key={c.id}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-surface-2 text-[10px] font-bold">
                      {c.author[0]}
                    </span>
                    <span className="font-medium">{c.author}</span>
                    <span className="text-muted">· {c.ago}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-foreground/90">{c.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-[12px] uppercase tracking-wider text-muted">Founder</p>
            <Link
              href={`/founders/${founder.slug}`}
              className="mt-2 flex items-center gap-3"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-[13px] font-bold text-black">
                {founder.avatar}
              </span>
              <span>
                <span className="block text-[14px] font-medium">{founder.name}</span>
                <span className="block text-[11px] text-muted">@{founder.handle}</span>
              </span>
            </Link>
            <p className="mt-3 text-[12px] text-muted">{founder.bio}</p>
            <div className="mt-3 space-y-2">
              <a
                href={`mailto:${founder.email}?subject=Re: ${demo.title}`}
                className="flex items-center justify-center gap-1.5 rounded-full bg-accent px-3 py-2 text-[12px] font-medium text-black hover:bg-accent-soft"
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
                  className="flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-[12px] text-foreground hover:border-accent"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-[12px] uppercase tracking-wider text-muted">Related</p>
            <ul className="mt-3 space-y-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/demo/${r.id}`}
                    className="flex gap-3 group"
                  >
                    <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md border border-border bg-black">
                      <img
                        src={`https://i.ytimg.com/vi/${r.youtubeId}/mqdefault.jpg`}
                        alt=""
                        className="h-full w-full object-cover opacity-90"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[12px] font-medium group-hover:text-accent">
                        {r.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {formatCount(r.upvotes)} upvotes · {r.durationSec}s
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
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
