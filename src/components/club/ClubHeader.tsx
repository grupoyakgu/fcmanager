"use client";

import ClubBadge from "@/components/ui/ClubBadge";
import ClubKit from "@/components/ui/ClubKit";
import { useGameStore } from "@/game/store";
import { getClubPosition } from "@/game/engines/leagueEngine";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import { formatCurrency } from "@/lib/formatCurrency";
import { useTranslation } from "@/i18n/useTranslation";

export default function ClubHeader() {
  const club = useGameStore((s) => s.club);
  const table = useGameStore((s) => s.table);
  const leagueName = useGameStore((s) => s.leagueName);
  const { t } = useTranslation();

  if (!club) return null;
  const position = table.length ? getClubPosition(table, USER_CLUB_ID) : null;

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-fw-border pb-5">
      <ClubBadge badgeId={club.badgeId} primaryColor={club.primaryColor} secondaryColor={club.secondaryColor} size={52} />
      <ClubKit kitId={club.kitId} primaryColor={club.primaryColor} secondaryColor={club.secondaryColor} size={44} className="hidden sm:block" />
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-fw-text sm:text-3xl">{club.name}</h1>
        <p className="text-xs font-semibold uppercase tracking-wide text-fw-text-faint">{club.nickname}</p>
      </div>
      <div className="ms-auto flex items-center gap-6">
        <div className="text-end">
          <p className="font-display text-xl font-bold tabular-nums text-fw-positive">{formatCurrency(club.budget)}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-fw-text-faint">{t("club.cash")}</p>
        </div>
        {position !== null && (
          <div className="text-end">
            <p className="font-display text-xl font-bold tabular-nums text-fw-text">#{position}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-fw-text-faint">{leagueName}</p>
          </div>
        )}
      </div>
    </div>
  );
}
