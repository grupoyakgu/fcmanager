"use client";

import ClubBadge from "@/components/ui/ClubBadge";
import NotificationBell from "@/components/layout/NotificationBell";
import { useGameStore } from "@/game/store";
import { formatCurrency } from "@/lib/formatCurrency";
import { getClubPosition } from "@/game/engines/leagueEngine";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";

export default function Topbar() {
  const club = useGameStore((s) => s.club);
  const table = useGameStore((s) => s.table);
  const currentWeek = useGameStore((s) => s.currentWeek);

  if (!club) return null;
  const position = table.length ? getClubPosition(table, USER_CLUB_ID) : null;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-fw-border bg-fw-bg/90 px-4 backdrop-blur lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <ClubBadge badgeId={club.badgeId} primaryColor={club.primaryColor} secondaryColor={club.secondaryColor} size={32} className="lg:hidden" />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold uppercase tracking-wide text-fw-text">{club.name}</p>
          <p className="text-[11px] text-fw-text-faint">Matchday {currentWeek}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden flex-col items-end sm:flex">
          <span className="font-display text-sm font-bold tabular-nums text-fw-positive">{formatCurrency(club.budget)}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-fw-text-faint">Cash</span>
        </div>
        {position !== null && (
          <div className="hidden flex-col items-end sm:flex">
            <span className="font-display text-sm font-bold tabular-nums text-fw-text">#{position}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-fw-text-faint">GPL</span>
          </div>
        )}
        <NotificationBell />
      </div>
    </header>
  );
}
