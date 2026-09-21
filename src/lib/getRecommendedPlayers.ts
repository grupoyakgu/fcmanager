import { Player, Position } from "@/types";

// Recommend players a squad plausibly needs: weak positions first, then best value-for-rating.
export function getRecommendedPlayers(
  allPlayers: Player[],
  mySquad: Player[],
  myClubId: string,
  limit = 3
): Player[] {
  const positionCounts = mySquad.reduce<Record<string, number>>((acc, p) => {
    acc[p.position] = (acc[p.position] ?? 0) + 1;
    return acc;
  }, {});
  const weakPositions = (Object.keys(positionCounts) as Position[])
    .concat(["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"])
    .filter((pos, idx, arr) => arr.indexOf(pos) === idx)
    .sort((a, b) => (positionCounts[a] ?? 0) - (positionCounts[b] ?? 0));

  const candidates = allPlayers.filter((p) => p.clubId !== myClubId && p.age <= 27);

  const scored = candidates.map((p) => {
    const positionScore = weakPositions.indexOf(p.position) >= 0 ? 10 - weakPositions.indexOf(p.position) : 0;
    const valueScore = p.overallRating - p.marketValue / 900_000;
    const potentialScore = (p.potential - p.overallRating) * 0.4;
    return { player: p, score: positionScore + valueScore + potentialScore };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.player);
}

export function getHiddenGems(allPlayers: Player[], myClubId: string, limit = 6): Player[] {
  return allPlayers
    .filter((p) => p.clubId !== myClubId && p.overallRating < 68 && p.potential - p.overallRating >= 8)
    .sort((a, b) => b.potential - b.overallRating - (a.potential - a.overallRating))
    .slice(0, limit);
}

export function getWonderkids(allPlayers: Player[], myClubId: string, limit = 8): Player[] {
  return allPlayers
    .filter((p) => p.clubId !== myClubId && p.age <= 19 && p.potential >= 84)
    .sort((a, b) => b.potential - a.potential)
    .slice(0, limit);
}
