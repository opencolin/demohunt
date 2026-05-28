import Link from "next/link";
import { Eye, Clock, ChevronUp, Search as SearchIcon, MapPin } from "lucide-react";
import { search, founderBySlug } from "@/lib/data";
import { formatCount, timeAgo, thumbnailFor } from "@/lib/utils";
import { VerifiedBadge } from "@/components/verified-badge";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = search(q);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="mb-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Search results
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {q ? <>“{q}”</> : "Search Demo Hunt"}
        </h1>
        {q && (
          <p className="mt-1 text-sm text-muted">
            <span className="font-mono">{results.total}</span>{" "}
            {results.total === 1 ? "result" : "results"} —{" "}
            <span className="font-mono">{results.demos.length}</span> demos and{" "}
            <span className="font-mono">{results.founders.length}</span> founders
          </p>
        )}
      </header>

      {!q && <EmptyState />}

      {q && results.total === 0 && (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <SearchIcon className="mx-auto h-6 w-6 text-muted" />
          <p className="mt-3 text-sm font-medium">No matches for “{q}”</p>
          <p className="mt-1 text-xs text-muted">
            Try a category like <em>AI</em>, <em>Devtools</em>, or <em>Climate</em>, or a founder
            name.
          </p>
        </div>
      )}

      {q && results.founders.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-medium text-muted">
            Founders
            <span className="ml-2 font-mono text-[11px] text-muted/70">
              {results.founders.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.founders.map((f) => (
              <Link
                key={f.slug}
                href={`/founders/${f.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition hover:border-accent/50"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-soft text-[13px] font-bold text-black">
                  {f.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="inline-flex items-center gap-1 text-[14px] font-medium group-hover:text-accent">
                    {f.name}
                    {f.verified && <VerifiedBadge />}
                  </p>
                  <p className="text-[12px] text-muted">
                    @{f.handle} · <MapPin className="inline h-3 w-3" /> {f.location}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[12px] text-foreground/80">{f.bio}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {q && results.demos.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted">
            Demos
            <span className="ml-2 font-mono text-[11px] text-muted/70">
              {results.demos.length}
            </span>
          </h2>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {results.demos.map((d) => {
              const founder = founderBySlug(d.founderSlug);
              return (
                <li key={d.id} className="transition hover:bg-surface-2">
                  <Link href={`/demo/${d.id}`} className="flex items-center gap-4 p-3">
                    <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md border border-border bg-black">
                      <img
                        src={thumbnailFor(d)}
                        alt=""
                        className="h-full w-full object-cover opacity-90"
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 font-mono text-[10px] text-white">
                        {d.durationSec}s
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[14px] font-medium">{d.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-[12px] text-muted">{d.tagline}</p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-muted">
                        {founder && (
                          <span className="inline-flex items-center gap-1">
                            @{founder.handle}
                            {founder.verified && <VerifiedBadge size="sm" />}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatCount(d.views)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(d.postedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-md border border-border px-2 py-1.5">
                      <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                      <span className="font-mono text-[11px] tabular-nums">
                        {formatCount(d.upvotes)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}

function EmptyState() {
  const examples = ["AI", "Devtools", "Climate", "Hardware", "YC W26", "voice"];
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <p className="text-sm text-foreground/85">Search by demo title, founder, category, or badge.</p>
      <p className="mt-1 text-xs text-muted">Try one of these:</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {examples.map((e) => (
          <Link
            key={e}
            href={`/search?q=${encodeURIComponent(e)}`}
            className="rounded-full border border-border bg-background px-2.5 py-1 text-[12px] text-foreground/85 hover:border-accent hover:text-accent"
          >
            {e}
          </Link>
        ))}
      </div>
    </div>
  );
}
