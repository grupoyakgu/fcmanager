import { Player } from "@/types";

export function calculateTeamRating(players: Player[]): number {
  if (players.length === 0) return 0;
  const sorted = [...players].sort((a, b) => b.overallRating - a.overallRating);
  const core = sorted.slice(0, 11);
  const sum = core.reduce((acc, p) => acc + p.overallRating, 0);
  return Math.round(sum / core.length);
}

export function calculateSquadValue(players: Player[]): number {
  return players.reduce((acc, p) => acc + p.marketValue, 0);
}

export function calculateAverageAge(players: Player[]): number {
  if (players.length === 0) return 0;
  return Math.round((players.reduce((acc, p) => acc + p.age, 0) / players.length) * 10) / 10;
}

export function calculateWeeklyWages(players: Player[]): number {
  return players.reduce((acc, p) => acc + p.salary, 0);
}
