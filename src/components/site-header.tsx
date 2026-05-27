import Link from "next/link";
import { Ticker } from "./ticker";

export function SiteHeader() {
  const today = new Date("2026-05-27");
  const dateline = today
    .toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper-elev">
      {/* Masthead row */}
      <div className="border-b border-ink/40">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 pt-4 pb-3">
          <Link href="/" className="group flex items-end gap-3">
            <span className="grid h-10 w-10 place-items-center border-2 border-ink bg-ink text-accent font-display text-xl leading-none">
              DH
            </span>
            <span className="flex flex-col">
              <span className="font-display text-[26px] font-semibold leading-[0.9] tracking-[-0.01em]">
                Demo<span className="italic font-light"> Hunt</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                Daily dispatch from the demo floor
              </span>
            </span>
          </Link>

          <nav className="hidden items-end gap-1 md:flex">
            <NavLink href="/">Feed</NavLink>
            <NavSep />
            <NavLink href="/discover">Discover</NavLink>
            <NavSep />
            <NavLink href="/demo-days">Demo&nbsp;Days</NavLink>
            <NavSep />
            <NavLink href="/submit">Submit</NavLink>
          </nav>

          <Link
            href="/submit"
            className="hidden shrink-0 items-center gap-1.5 border-2 border-ink bg-accent px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-accent md:inline-flex"
          >
            <span aria-hidden>＋</span> Submit demo
          </Link>
        </div>

        {/* Dateline row */}
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          <span>Vol. II · Issue No. 047</span>
          <span className="hidden sm:inline">
            “Pitches you can{" "}
            <span className="italic font-display text-ink normal-case tracking-normal">
              feel
            </span>
            ”
          </span>
          <span>{dateline}</span>
        </div>
      </div>

      <Ticker />
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink underline-offset-[6px] decoration-2 decoration-ink/0 hover:decoration-accent hover:[text-decoration-line:underline]"
    >
      {children}
    </Link>
  );
}

function NavSep() {
  return <span className="font-mono text-ink/40 px-1.5">·</span>;
}
