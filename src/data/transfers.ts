import { Club, Player, TransferRecord } from "@/types";
import { RNG, randInt, pick } from "@/lib/rng";
import { makeId } from "@/lib/utils";
import { USER_CLUB_ID } from "@/data/players";

// Pre-season transfer buzz: a handful of moves that "already happened" before
// matchday 1 between AI clubs, used to seed news so the world feels lived-in.
// The user's own club is excluded — its opening squad was never "bought".
export function buildPreSeasonTransferBuzz(players: Player[], clubs: Club[], rng: RNG, week: number): TransferRecord[] {
  const eligible = players.filter((p) => p.clubId && p.clubId !== USER_CLUB_ID && p.age <= 26 && p.overallRating < 80);
  const picks = new Set<string>();
  const records: TransferRecord[] = [];
  const count = Math.min(6, eligible.length);

  while (picks.size < count && eligible.length > 0) {
    const player = pick(rng, eligible);
    if (picks.has(player.id)) continue;
    picks.add(player.id);
    const sellerClub = pick(rng, clubs.filter((c) => c.id !== player.clubId));
    records.push({
      id: makeId("transfer"),
      playerId: player.id,
      playerName: `${player.firstName} ${player.lastName}`,
      fromClubId: sellerClub.id,
      toClubId: player.clubId,
      fee: Math.round((player.marketValue * (0.7 + randInt(rng, 0, 40) / 100)) / 10_000) * 10_000,
      week: Math.max(1, week - randInt(rng, 1, 3)),
    });
  }

  return records;
}
