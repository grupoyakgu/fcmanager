"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/layout/navConfig";
import ClubBadge from "@/components/ui/ClubBadge";
import { useGameStore } from "@/game/store";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const club = useGameStore((s) => s.club);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] shrink-0 flex-col border-r border-fw-border bg-fw-bg-elevated lg:flex">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="h-2.5 w-2.5 rounded-full bg-fw-accent" />
        <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-fw-text">
          Football World
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-fw-accent/12 text-fw-accent"
                  : "text-fw-text-dim hover:bg-fw-surface-hover hover:text-fw-text"
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
              <span className="uppercase tracking-wide">{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-fw-accent" />}
            </Link>
          );
        })}
      </nav>

      {club && (
        <div className="border-t border-fw-border px-4 py-4">
          <div className="flex items-center gap-3 rounded-lg bg-fw-surface px-3 py-2.5">
            <ClubBadge badgeId={club.badgeId} primaryColor={club.primaryColor} secondaryColor={club.secondaryColor} size={30} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fw-text">{club.shortName}</p>
              <p className="truncate text-[11px] text-fw-text-faint">{club.name}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
