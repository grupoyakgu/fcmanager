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

export default function MyClubPage() {
  const club = useGameStore((s) => s.club);
  const players = useGameStore((s) => s.players);
  const clubs = useGameStore((s) => s.clubs);
  const table = useGameStore((s) => s.table);
  const news = useGameStore((s) => s.news);
  const results = useGameStore((s) => s.results);
  const transferHistory = useGameStore((s) => s.transferHistory);
  const openPlayer = useUiStore((s) => s.openPlayer);

  if (!club) return null;

  const squad = players.filter((p) => p.clubId === USER_CLUB_ID);
  const row = table.find((r) => r.clubId === USER_CLUB_ID);
  const position = table.length ? getClubPosition(table, USER_CLUB_ID) : 0;

  const topScorer = [...squad].sort((a, b) => b.goals - a.goals)[0];
  const topAssister = [...squad].sort((a, b) => b.assists - a.assists)[0];
  const highestRated = [...squad].sort((a, b) => b.overallRating - a.overallRating)[0];
  const highestValue = [...squad].sort((a, b) => b.marketValue - a.marketValue)[0];

  const myTransfers = transferHistory.filter((t) => t.fromClubId === USER_CLUB_ID || t.toClubId === USER_CLUB_ID).slice(0, 4);
  const myResults = results
    .filter((r) => r.homeClubId === USER_CLUB_ID || r.awayClubId === USER_CLUB_ID)
    .slice(-3)
    .reverse();
  const myNews = news.filter((n) => n.relatedClubId === USER_CLUB_ID).slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <ClubHeader />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <StatTile label="Club Value" value={formatCurrency(calculateSquadValue(squad))} />
        <StatTile label="Cash" value={formatCurrency(club.budget)} />
        <StatTile label="Weekly Wages" value={formatCurrency(calculateWeeklyWages(squad))} />
        <StatTile label="Squad Size" value={String(squad.length)} />
        <StatTile label="Avg OVR" value={String(calculateTeamRating(squad))} />
        <StatTile label="Avg Age" value={calculateAverageAge(squad).toFixed(1)} />
        <StatTile label="Position" value={`#${position}`} />
        <StatTile label="Form" value={(row?.form ?? []).join(" ") || "—"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <SectionHeader eyebrow="Season" title="Club Performance" />
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="League Position" value={`#${position}`} />
            <StatTile label="Points" value={String(row?.points ?? 0)} />
            <StatTile label="Goals For" value={String(row?.goalsFor ?? 0)} tone="positive" />
            <StatTile label="Goals Against" value={String(row?.goalsAgainst ?? 0)} tone="negative" />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Standouts" title="Top Performers" />
          <div className="flex flex-col gap-2">
            {highestRated ? <PlayerMiniCard player={highestRated} onClick={() => openPlayer(highestRated.id)} /> : null}
            {topScorer && topScorer.goals > 0 ? <PlayerMiniCard player={topScorer} onClick={() => openPlayer(topScorer.id)} /> : null}
            {topAssister && topAssister.assists > 0 ? <PlayerMiniCard player={topAssister} onClick={() => openPlayer(topAssister.id)} /> : null}
            {highestValue ? <PlayerMiniCard player={highestValue} onClick={() => openPlayer(highestValue.id)} /> : null}
          </div>
        </section>
      </div>

      <section>
        <SectionHeader eyebrow="Timeline" title="Recent Activity" />
        {myTransfers.length === 0 && myResults.length === 0 && myNews.length === 0 ? (
          <EmptyState icon={History} title="NO ACTIVITY YET" message="Transfers, results and news about your club will appear here." />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {myTransfers.map((t) => (
              <div key={t.id} className="rounded-lg border border-fw-border bg-fw-surface p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-fw-accent">Transfer</p>
                <p className="text-sm font-semibold text-fw-text">
                  {t.toClubId === USER_CLUB_ID ? "Signed" : "Sold"} {t.playerName}
                </p>
                <p className="text-xs text-fw-text-faint">{formatCurrency(t.fee)}</p>
              </div>
            ))}
            {myResults.map((r) => {
              const home = clubs.find((c) => c.id === r.homeClubId);
              const away = clubs.find((c) => c.id === r.awayClubId);
              return (
                <div key={r.id} className="rounded-lg border border-fw-border bg-fw-surface p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-fw-accent">Match Result</p>
                  <p className="text-sm font-semibold text-fw-text">
                    {home?.shortName} {r.homeGoals}-{r.awayGoals} {away?.shortName}
                  </p>
                  <p className="text-xs text-fw-text-faint">Matchday {r.matchday}</p>
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
        <SectionHeader eyebrow="Danger Zone" title="Demo Controls" />
        <p className="mb-3 text-sm text-fw-text-faint">Start over with a brand new club and a freshly generated football world.</p>
        <ResetDemoButton />
      </section>
    </div>
  );
}
