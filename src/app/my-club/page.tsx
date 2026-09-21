"use client";

import { useGameStore } from "@/game/store";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import { getClubPosition } from "@/game/engines/leagueEngine";
import ClubHeader from "@/components/club/ClubHeader";
import ResetDemoButton from "@/components/club/ResetDemoButton";
import { SectionHeader, StatTile } from "@/components/ui/Card";
import PlayerMiniCard from "@/components/player/PlayerMiniCard";
import NewsCard from "@/components/news/NewsCard";
import EmptyState from "@/components/ui/EmptyState";
import { useUiStore } from "@/game/uiStore";
import { formatCurrency } from "@/lib/formatCurrency";
import { calculateAverageAge, calculateSquadValue, calculateTeamRating, calculateWeeklyWages } from "@/lib/calculateTeamRating";
import { History } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export default function MyClubPage() {
  const club = useGameStore((s) => s.club);
  const players = useGameStore((s) => s.players);
  const clubs = useGameStore((s) => s.clubs);
  const table = useGameStore((s) => s.table);
  const news = useGameStore((s) => s.news);
  const results = useGameStore((s) => s.results);
  const transferHistory = useGameStore((s) => s.transferHistory);
  const openPlayer = useUiStore((s) => s.openPlayer);
  const { t } = useTranslation();

  if (!club) return null;

  const squad = players.filter((p) => p.clubId === USER_CLUB_ID);
  const row = table.find((r) => r.clubId === USER_CLUB_ID);
  const position = table.length ? getClubPosition(table, USER_CLUB_ID) : 0;

  const topScorer = [...squad].sort((a, b) => b.goals - a.goals)[0];
  const topAssister = [...squad].sort((a, b) => b.assists - a.assists)[0];
  const highestRated = [...squad].sort((a, b) => b.overallRating - a.overallRating)[0];
  const highestValue = [...squad].sort((a, b) => b.marketValue - a.marketValue)[0];

  const myTransfers = transferHistory.filter((tr) => tr.fromClubId === USER_CLUB_ID || tr.toClubId === USER_CLUB_ID).slice(0, 4);
  const myResults = results
    .filter((r) => r.homeClubId === USER_CLUB_ID || r.awayClubId === USER_CLUB_ID)
    .slice(-3)
    .reverse();
  const myNews = news.filter((n) => n.relatedClubId === USER_CLUB_ID).slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <ClubHeader />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <StatTile label={t("myClub.clubValue")} value={formatCurrency(calculateSquadValue(squad))} />
        <StatTile label={t("myClub.cash")} value={formatCurrency(club.budget)} />
        <StatTile label={t("myClub.weeklyWages")} value={formatCurrency(calculateWeeklyWages(squad))} />
        <StatTile label={t("myClub.squadSize")} value={String(squad.length)} />
        <StatTile label={t("myClub.avgOvr")} value={String(calculateTeamRating(squad))} />
        <StatTile label={t("myClub.avgAge")} value={calculateAverageAge(squad).toFixed(1)} />
        <StatTile label={t("myClub.position")} value={`#${position}`} />
        <StatTile label={t("myClub.form")} value={(row?.form ?? []).join(" ") || "—"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <SectionHeader eyebrow={t("myClub.eyebrow")} title={t("myClub.performance")} />
          <div className="grid grid-cols-2 gap-3">
            <StatTile label={t("myClub.leaguePosition")} value={`#${position}`} />
            <StatTile label={t("myClub.points")} value={String(row?.points ?? 0)} />
            <StatTile label={t("myClub.goalsFor")} value={String(row?.goalsFor ?? 0)} tone="positive" />
            <StatTile label={t("myClub.goalsAgainst")} value={String(row?.goalsAgainst ?? 0)} tone="negative" />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow={t("myClub.standouts")} title={t("myClub.topPerformers")} />
          <div className="flex flex-col gap-2">
            {highestRated ? <PlayerMiniCard player={highestRated} onClick={() => openPlayer(highestRated.id)} /> : null}
            {topScorer && topScorer.goals > 0 ? <PlayerMiniCard player={topScorer} onClick={() => openPlayer(topScorer.id)} /> : null}
            {topAssister && topAssister.assists > 0 ? <PlayerMiniCard player={topAssister} onClick={() => openPlayer(topAssister.id)} /> : null}
            {highestValue ? <PlayerMiniCard player={highestValue} onClick={() => openPlayer(highestValue.id)} /> : null}
          </div>
        </section>
      </div>

      <section>
        <SectionHeader eyebrow={t("myClub.timeline")} title={t("myClub.recentActivity")} />
        {myTransfers.length === 0 && myResults.length === 0 && myNews.length === 0 ? (
          <EmptyState icon={History} title={t("myClub.noActivityTitle")} message={t("myClub.noActivityMsg")} />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {myTransfers.map((tr) => (
              <div key={tr.id} className="rounded-lg border border-fw-border bg-fw-surface p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-fw-accent">{t("myClub.transfer")}</p>
                <p className="text-sm font-semibold text-fw-text">
                  {tr.toClubId === USER_CLUB_ID ? t("myClub.signed") : t("myClub.sold")} {tr.playerName}
                </p>
                <p className="text-xs text-fw-text-faint">{formatCurrency(tr.fee)}</p>
              </div>
            ))}
            {myResults.map((r) => {
              const home = clubs.find((c) => c.id === r.homeClubId);
              const away = clubs.find((c) => c.id === r.awayClubId);
              return (
                <div key={r.id} className="rounded-lg border border-fw-border bg-fw-surface p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-fw-accent">{t("myClub.matchResult")}</p>
                  <p className="text-sm font-semibold text-fw-text">
                    {home?.shortName} {r.homeGoals}-{r.awayGoals} {away?.shortName}
                  </p>
                  <p className="text-xs text-fw-text-faint">{t("myClub.matchday", { n: r.matchday })}</p>
                </div>
              );
            })}
            {myNews.map((n) => (
              <NewsCard key={n.id} item={n} compact />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-fw-border pt-5">
        <SectionHeader eyebrow={t("myClub.dangerZone")} title={t("myClub.demoControls")} />
        <p className="mb-3 text-sm text-fw-text-faint">{t("myClub.demoControlsMsg")}</p>
        <ResetDemoButton />
      </section>
    </div>
  );
}
