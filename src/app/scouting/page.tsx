"use client";

import { Player } from "@/types";
import { useGameStore } from "@/game/store";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import { SectionHeader } from "@/components/ui/Card";
import ScoutCard from "@/components/scouting/ScoutCard";
import EmptyState from "@/components/ui/EmptyState";
import { getRecommendedPlayers, getHiddenGems, getWonderkids } from "@/lib/getRecommendedPlayers";
import { FileSearch } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export default function ScoutingPage() {
  const players = useGameStore((s) => s.players);
  const scoutReports = useGameStore((s) => s.scoutReports);
  const { t } = useTranslation();

  const mySquad = players.filter((p) => p.clubId === USER_CLUB_ID);
  const recommended = getRecommendedPlayers(players, mySquad, USER_CLUB_ID, 6);
  const hiddenGems = getHiddenGems(players, USER_CLUB_ID, 6);
  const wonderkids = getWonderkids(players, USER_CLUB_ID, 6);
  const recentReports = scoutReports
    .map((r) => players.find((p) => p.id === r.playerId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 6);

  const assignments = Math.max(1, Math.min(5, recommended.filter((p) => !p.scouted).length));

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-fw-border pb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-fw-accent">{t("scouting.eyebrow")}</p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-fw-text sm:text-3xl">{t("scouting.title")}</h1>
        <p className="mt-1 text-sm text-fw-text-dim">{t("scouting.assignments", { n: assignments })}</p>
      </div>

      <ScoutSection title={t("scouting.recommended")} eyebrow={t("scouting.recommendedEyebrow")} players={recommended} emptyMessage={t("scouting.recommendedEmpty")} />
      <ScoutSection title={t("scouting.gems")} eyebrow={t("scouting.gemsEyebrow")} players={hiddenGems} emptyMessage={t("scouting.gemsEmpty")} />
      <ScoutSection title={t("scouting.wonderkids")} eyebrow={t("scouting.wonderkidsEyebrow")} players={wonderkids} emptyMessage={t("scouting.wonderkidsEmpty")} />

      <section>
        <SectionHeader eyebrow={t("scouting.yourScouts")} title={t("scouting.recentReports")} />
        {recentReports.length === 0 ? (
          <EmptyState icon={FileSearch} title={t("scouting.noReportsTitle")} message={t("scouting.noReportsMsg")} />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {recentReports.map((p) => (
              <ScoutCard key={p.id} player={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ScoutSection({
  title,
  eyebrow,
  players,
  emptyMessage,
}: {
  title: string;
  eyebrow: string;
  players: Player[];
  emptyMessage: string;
}) {
  const { t } = useTranslation();
  return (
    <section>
      <SectionHeader eyebrow={eyebrow} title={title} />
      {players.length === 0 ? (
        <EmptyState title={t("scouting.noPlayersFound")} message={emptyMessage} />
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((p) => (
            <ScoutCard key={p.id} player={p} />
          ))}
        </div>
      )}
    </section>
  );
}
