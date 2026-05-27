import Link from "next/link";
import { Play, Calendar, Compass, Upload, Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-black">
            <Play className="h-3.5 w-3.5 fill-current" />
            <span className="absolute inset-0 rounded-lg pulse-ring" aria-hidden />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            demo<span className="text-gradient-accent">hunt</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          <NavLink href="/">
            <Compass className="h-3.5 w-3.5" />
            Feed
          </NavLink>
          <NavLink href="/discover">
            <Search className="h-3.5 w-3.5" />
            Discover
          </NavLink>
          <NavLink href="/demo-days">
            <Calendar className="h-3.5 w-3.5" />
            Demo Days
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-medium text-black transition hover:bg-accent-soft"
          >
            <Upload className="h-3.5 w-3.5" />
            Submit demo
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-foreground/70 transition hover:bg-surface hover:text-foreground"
    >
      {children}
    </Link>
  );
}
