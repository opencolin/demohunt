"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Search,
  Calendar,
  Upload,
  Users,
  Sparkles,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchPrefix?: string;
};

const PRIMARY: Item[] = [
  { href: "/", label: "Feed", icon: <Compass className="h-5 w-5" />, matchPrefix: "/" },
  { href: "/discover", label: "Discover", icon: <Search className="h-5 w-5" /> },
  { href: "/demo-days", label: "Demo Days", icon: <Calendar className="h-5 w-5" /> },
  { href: "/submit", label: "Submit", icon: <Upload className="h-5 w-5" /> },
];

const SECONDARY: Item[] = [
  { href: "/discover?tab=rising", label: "Rising", icon: <Flame className="h-4 w-4" /> },
  { href: "/discover?tab=ai-only", label: "AI-only", icon: <Sparkles className="h-4 w-4" /> },
  { href: "/discover", label: "Founders", icon: <Users className="h-4 w-4" /> },
];

export function SiteSidebar() {
  const pathname = usePathname();

  const isActive = (item: Item) => {
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border bg-background/60 py-4 md:flex md:flex-col">
      <nav className="space-y-1 px-3">
        {PRIMARY.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition",
                active
                  ? "bg-surface text-foreground font-medium"
                  : "text-foreground/80 hover:bg-surface hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center",
                  active ? "text-accent" : "text-foreground/70",
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="my-4 mx-3 border-t border-border" />

      <div className="px-5 pb-2 text-[10px] uppercase tracking-[0.18em] text-muted">
        Explore
      </div>
      <nav className="space-y-0.5 px-3">
        {SECONDARY.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] text-foreground/75 transition hover:bg-surface hover:text-foreground"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center text-foreground/60">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-5 pb-2 pt-6 text-[10px] uppercase tracking-[0.18em] text-muted">
        About
      </div>
      <div className="px-5 pb-6 text-[11px] leading-relaxed text-muted">
        Demo Hunt is a daily dispatch of startup pitches. Submit yours in 15-30 seconds.
      </div>
    </aside>
  );
}
