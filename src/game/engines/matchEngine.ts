import { Club, GoalEvent, MatchResult, MatchStats, Player, PlayerRating, Position } from "@/types";
import { RNG, randInt, randFloat, clamp } from "@/lib/rng";
import { calculateTeamRating } from "@/lib/calculateTeamRating";
import { makeId } from "@/lib/utils";

const ATTACKING_POSITIONS: Position[] = ["ST", "LW", "RW", "CAM"];

function weightedGoalScorer(rng: RNG, players: Player[]): Player {
  const pool = players.filter((p) => p.position !== "GK");
  const weights = pool.map((p) => {
    const attackWeight = ATTACKING_POSITIONS.includes(p.position) ? 3 : 1;
    return Math.max(1, p.shooting / 20) * attackWeight;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1] ?? players[0];
}

function simulateGoals(
  rng: RNG,
  clubId: string,
  count: number,
  players: Player[]
): GoalEvent[] {
  const events: GoalEvent[] = [];
  const usedMinutes = new Set<number>();
  for (let i = 0; i < count; i++) {
    let minute = randInt(rng, 1, 90);
    while (usedMinutes.has(minute)) minute = randInt(rng, 1, 90);
    usedMinutes.add(minute);
    const scorer = weightedGoalScorer(rng, players);
    events.push({
      minute,
      playerId: scorer.id,
      playerName: `${scorer.firstName} ${scorer.lastName}`,
      clubId,
    });
  }
  return events.sort((a, b) => a.minute - b.minute);
}

function simulateStats(rng: RNG, strengthShare: number, goals: number): MatchStats {
  const possession = clamp(Math.round(35 + strengthShare * 30 + randFloat(rng, -5, 5)), 30, 70);
  const shots = clamp(Math.round(6 + goals * 2 + strengthShare * 10 + randInt(rng, -2, 3)), 3, 22);
  const shotsOnTarget = clamp(Math.round(shots * randFloat(rng, 0.35, 0.6)) + goals, goals, shots);
  const corners = clamp(Math.round(2 + strengthShare * 6 + randInt(rng, -1, 3)), 0, 12);
  const fouls = randInt(rng, 6, 16);
  return { possession, shots, shotsOnTarget, corners, fouls };
}

function ratePlayers(rng: RNG, players: Player[], goalScorers: GoalEvent[], goalsScored: number, goalsConceded: number): PlayerRating[] {
  const sample = players.slice(0, 11);
  return sample.map((p) => {
    let base = 6.0 + (p.overallRating - 65) / 18 + randFloat(rng, -0.5, 0.5);
    const goalsByPlayer = goalScorers.filter((g) => g.playerId === p.id).length;
    base += goalsByPlayer * 0.9;
    if (p.position === "GK" || p.position === "CB") {
      base -= goalsConceded * 0.12;
      base += goalsConceded === 0 ? 0.4 : 0;
    }
    if (goalsScored > goalsConceded) base += 0.2;
    if (goalsScored < goalsConceded) base -= 0.25;
    return {
      playerId: p.id,
      playerName: `${p.firstName} ${p.lastName}`,
      rating: Math.round(clamp(base, 4.5, 9.6) * 10) / 10,
    };
  });
}

export interface SimulateFixtureInput {
  fixtureId: string;
  matchday: number;
  homeClub: Club;
  awayClub: Club;
  homePlayers: Player[];
  awayPlayers: Player[];
  week: number;
  rng: RNG;
}

export function simulateFixture(input: SimulateFixtureInput): MatchResult {
  const { fixtureId, matchday, homeClub, awayClub, homePlayers, awayPlayers, week, rng } = input;
  const homeRating = calculateTeamRating(homePlayers) + 3; // home advantage
  const awayRating = calculateTeamRating(awayPlayers);
  const diff = homeRating - awayRating;
  const homeStrengthShare = clamp(0.5 + diff / 60, 0.15, 0.85);

  const expectedHomeGoals = clamp(1.15 + diff / 22 + randFloat(rng, -0.4, 0.6), 0.15, 4.2);
  const expectedAwayGoals = clamp(1.05 - diff / 22 + randFloat(rng, -0.4, 0.6), 0.1, 3.8);

  const homeGoals = poissonish(rng, expectedHomeGoals);
  const awayGoals = poissonish(rng, expectedAwayGoals);

  const homeGoalEvents = simulateGoals(rng, homeClub.id, homeGoals, homePlayers);
  const awayGoalEvents = simulateGoals(rng, awayClub.id, awayGoals, awayPlayers);
  const goals = [...homeGoalEvents, ...awayGoalEvents].sort((a, b) => a.minute - b.minute);

  const homeStats = simulateStats(rng, homeStrengthShare, homeGoals);
  const awayStats = simulateStats(rng, 1 - homeStrengthShare, awayGoals);

  const playerRatings = [
    ...ratePlayers(rng, homePlayers, homeGoalEvents, homeGoals, awayGoals),
    ...ratePlayers(rng, awayPlayers, awayGoalEvents, awayGoals, homeGoals),
  ].sort((a, b) => b.rating - a.rating);

  return {
    id: makeId("result"),
    fixtureId,
    matchday,
    homeClubId: homeClub.id,
    awayClubId: awayClub.id,
    homeGoals,
    awayGoals,
    goals,
    homeStats,
    awayStats,
    playerRatings,
    playedAtWeek: week,
  };
}

function poissonish(rng: RNG, expected: number): number {
  // Cheap approximation of a Poisson-like discrete distribution, tuned for football scorelines.
  let goals = 0;
  let threshold = Math.exp(-expected);
  let cumulative = threshold;
  const r = rng();
  while (cumulative < r && goals < 8) {
    goals += 1;
    threshold *= expected / goals;
    cumulative += threshold;
  }
  return goals;
}

export function pickManOfTheMatch(ratings: PlayerRating[]): PlayerRating | undefined {
  return ratings[0];
}
