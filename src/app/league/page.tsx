"use client";

import { useGameStore } from "@/game/store";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import LeagueTable from "@/components/league/LeagueTable";

export default function LeaguePage() {
  const table = useGameStore((s) => s.table);
  const clubs = useGameStore((s) => s.clubs);
  const currentWeek = useGameStore((s) => s.currentWeek);
  const fixtures = useGameStore((s) => s.fixtures);

  const totalMatchdays = fixtures.reduce((max, f) => Math.max(max, f.matchday), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-fw-border pb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-fw-accent">Season Standings</p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-fw-text sm:text-3xl">Global Premier League</h1>
        <p className="mt-1 text-sm text-fw-text-dim">
          Matchday {Math.min(currentWeek, totalMatchdays)} of {totalMatchdays}
        </p>
      </div>

      <LeagueTable table={table} clubs={clubs} userClubId={USER_CLUB_ID} />
    </div>
  );
}
