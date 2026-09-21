import { buildAiClubs } from "@/data/clubs";
import { generateWorld, USER_CLUB_ID } from "@/data/players";
import { generateFixtures } from "@/data/matches";
import { buildSeedNews } from "@/data/news";
import { buildPreSeasonTransferBuzz } from "@/data/transfers";
import { leagueNameFor } from "@/data/countryLeagues";
import { mulberry32 } from "@/lib/rng";
import { Club, LeagueTableRow } from "@/types";

const WORLD_SEED = 20260921;

function seedFor(country: string, salt: number): number {
  let hash = 0;
  for (let i = 0; i < country.length; i++) {
    hash = (hash * 31 + country.charCodeAt(i)) | 0;
  }
  return (WORLD_SEED ^ hash) + salt;
}

export function loadInitialWorld(country: string) {
  const aiClubs = buildAiClubs(country, mulberry32(seedFor(country, 1)));
  const { players, starPlayerIds } = generateWorld(seedFor(country, 2), country, aiClubs);
  const stars = {
    danielCosta: players.find((p) => p.id === starPlayerIds.danielCosta)!,
    marcoSilva: players.find((p) => p.id === starPlayerIds.marcoSilva)!,
    lucasMoretti: players.find((p) => p.id === starPlayerIds.lucasMoretti)!,
  };
  const leagueName = leagueNameFor(country);
  const news = buildSeedNews(aiClubs, stars, mulberry32(seedFor(country, 3)), leagueName, 6);
  const transferBuzz = buildPreSeasonTransferBuzz(players, aiClubs, mulberry32(seedFor(country, 4)), 6);

  return { aiClubs, players, starPlayerIds, news, transferBuzz, leagueName };
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
