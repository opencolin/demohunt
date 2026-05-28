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
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-44 shrink-0 overflow-y-auto border-r border-border bg-background/60 py-3 md:flex md:flex-col">
      <nav className="space-y-0.5 px-2">
        {PRIMARY.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition",
                active
                  ? "bg-surface text-foreground font-medium"
                  : "text-foreground/80 hover:bg-surface hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-4 w-4 items-center justify-center",
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

      <div className="mx-2 my-3 border-t border-border" />

      <div className="px-3 pb-1.5 text-[10px] uppercase tracking-[0.18em] text-muted">
        Explore
      </div>
      <nav className="space-y-0.5 px-2">
        {SECONDARY.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] text-foreground/75 transition hover:bg-surface hover:text-foreground"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center text-foreground/60">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-3 pb-1.5 pt-5 text-[10px] uppercase tracking-[0.18em] text-muted">
        About
      </div>
      <div className="px-3 pb-4 text-[11px] leading-relaxed text-muted">
        Daily dispatch of startup pitches. Submit yours in 15-30 seconds.
      </div>
    </aside>
  );
}
