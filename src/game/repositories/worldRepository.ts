import { buildAiClubs } from "@/data/clubs";
import { generateWorld, USER_CLUB_ID } from "@/data/players";
import { generateFixtures } from "@/data/matches";
import { buildSeedNews } from "@/data/news";
import { buildPreSeasonTransferBuzz } from "@/data/transfers";
import { mulberry32 } from "@/lib/rng";
import { Club, LeagueTableRow } from "@/types";

const WORLD_SEED = 20260921;

export function loadInitialWorld() {
  const rng = mulberry32(WORLD_SEED + 1);
  const aiClubs = buildAiClubs();
  const { players, starPlayerIds } = generateWorld(WORLD_SEED);
  const news = buildSeedNews(6);
  const transferBuzz = buildPreSeasonTransferBuzz(players, aiClubs, rng, 6);

  return { aiClubs, players, starPlayerIds, news, transferBuzz };
}

export function buildEmptyTable(clubs: Club[]): LeagueTableRow[] {
  return clubs.map((c) => ({
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
  }));
}

export function buildLeagueFixtures(clubs: Club[]) {
  return generateFixtures(clubs.map((c) => c.id));
}

export { USER_CLUB_ID };
