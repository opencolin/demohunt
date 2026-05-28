import Link from "next/link";
import { Suspense } from "react";
import { Play, Upload, Bell } from "lucide-react";
import { SearchBar } from "./search-bar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-14 max-w-[1920px] items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 group">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-black">
            <Play className="h-3.5 w-3.5 fill-current" />
            <span className="absolute inset-0 rounded-lg pulse-ring" aria-hidden />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            demo<span className="text-gradient-accent">hunt</span>
          </span>
        </Link>

        <div className="flex flex-1 justify-center">
          <Suspense fallback={<div className="h-9 w-full max-w-md" />}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground/75 transition hover:text-foreground sm:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-medium text-black transition hover:bg-accent-soft"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Submit demo</span>
            <span className="sm:hidden">Submit</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
