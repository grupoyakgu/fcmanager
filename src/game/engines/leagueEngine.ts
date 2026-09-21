import { Club, LeagueTableRow, MatchResult } from "@/types";

export function computeTable(clubs: Club[], results: MatchResult[], previousTable?: LeagueTableRow[]): LeagueTableRow[] {
  const rows = new Map<string, LeagueTableRow>();
  clubs.forEach((c) =>
    rows.set(c.id, {
      clubId: c.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
      movement: "same",
    })
  );

  const sortedResults = [...results].sort((a, b) => a.matchday - b.matchday);

  sortedResults.forEach((r) => {
    const home = rows.get(r.homeClubId);
    const away = rows.get(r.awayClubId);
    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    home.goalsFor += r.homeGoals;
    home.goalsAgainst += r.awayGoals;
    away.goalsFor += r.awayGoals;
    away.goalsAgainst += r.homeGoals;

    if (r.homeGoals > r.awayGoals) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
      home.form.push("W");
      away.form.push("L");
    } else if (r.awayGoals > r.homeGoals) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
      away.form.push("W");
      home.form.push("L");
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
      home.form.push("D");
      away.form.push("D");
    }
  });

  const table = Array.from(rows.values()).map((row) => ({
    ...row,
    form: row.form.slice(-5),
  }));

  table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });

  if (previousTable && previousTable.length > 0) {
    const previousPositions = new Map<string, number>();
    previousTable.forEach((row, idx) => previousPositions.set(row.clubId, idx));
    table.forEach((row) => {
      const newIdx = table.indexOf(row);
      const oldIdx = previousPositions.get(row.clubId);
      if (oldIdx === undefined) return;
      if (newIdx < oldIdx) row.movement = "up";
      else if (newIdx > oldIdx) row.movement = "down";
      else row.movement = "same";
    });
  }

  return table;
}

export function getClubPosition(table: LeagueTableRow[], clubId: string): number {
  const idx = table.findIndex((r) => r.clubId === clubId);
  return idx === -1 ? table.length : idx + 1;
}
