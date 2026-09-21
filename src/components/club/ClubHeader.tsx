"use client";

import ClubBadge from "@/components/ui/ClubBadge";
import { useGameStore } from "@/game/store";
import { getClubPosition } from "@/game/engines/leagueEngine";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import { formatCurrency } from "@/lib/formatCurrency";

export default function ClubHeader() {
  const club = useGameStore((s) => s.club);
  const table = useGameStore((s) => s.table);

  if (!club) return null;
  const position = table.length ? getClubPosition(table, USER_CLUB_ID) : null;

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-fw-border pb-5">
      <ClubBadge badgeId={club.badgeId} primaryColor={club.primaryColor} secondaryColor={club.secondaryColor} size={52} />
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-fw-text sm:text-3xl">{club.name}</h1>
        <p className="text-xs font-semibold uppercase tracking-wide text-fw-text-faint">{club.nickname}</p>
      </div>
      <div className="ml-auto flex items-center gap-6">
        <div className="text-right">
          <p className="font-display text-xl font-bold tabular-nums text-fw-positive">{formatCurrency(club.budget)}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-fw-text-faint">Cash</p>
        </div>
        {position !== null && (
          <div className="text-right">
            <p className="font-display text-xl font-bold tabular-nums text-fw-text">#{position}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-fw-text-faint">Global Premier League</p>
          </div>
        )}
      </div>
    </div>
  );
}
