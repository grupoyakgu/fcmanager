import { Club, ClubIdentity } from "@/types";
import { RNG, randInt, shuffle, pick } from "@/lib/rng";
import { BADGE_TEMPLATES } from "@/data/badges";
import { KIT_TEMPLATES } from "@/data/kits";
import { countryStyle } from "@/data/countryLeagues";
import { SPAIN_REAL_CLUBS } from "@/data/realSpain";
import { makeId } from "@/lib/utils";

const IDENTITIES: ClubIdentity[] = [
  "YOUTH_FACTORY",
  "BIG_SPENDER",
  "BARGAIN_HUNTER",
  "STAR_COLLECTOR",
  "BALANCED",
  "TACTICAL",
  "DEVELOPMENT_CLUB",
  "DEFENSIVE_CLUB",
];

// [reputation, budget] tiers spread across an 8-club league, weakest to strongest.
const STRENGTH_TIERS: [number, number][] = [
  [52, 4_200_000],
  [56, 5_400_000],
  [60, 6_800_000],
  [65, 9_200_000],
  [70, 11_800_000],
  [76, 15_500_000],
  [83, 21_000_000],
  [89, 27_500_000],
];

const COLOR_PAIRS: [string, string][] = [
  ["#1d4ed8", "#f8fafc"],
  ["#7c1d2c", "#e8b923"],
  ["#0f766e", "#f1f5f9"],
  ["#dc2626", "#111827"],
  ["#ea580c", "#1c1917"],
  ["#4338ca", "#facc15"],
  ["#2563eb", "#e2e8f0"],
  ["#0e7490", "#0f172a"],
  ["#7e22ce", "#f5f3ff"],
  ["#15803d", "#f0fdf4"],
  ["#b91c1c", "#fef3c7"],
  ["#0369a1", "#fef2f2"],
];

const STADIUM_SUFFIXES = ["Arena", "Park", "Stadium", "Ground", "Bowl"];

function shortNameFrom(city: string, used: Set<string>): string {
  const letters = city.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean);
  let base = letters.length > 1 ? letters.map((w) => w[0]).join("") : city.slice(0, 3);
  base = base.toUpperCase().slice(0, 4) || "CLB";
  let candidate = base;
  let suffix = 1;
  while (used.has(candidate)) {
    candidate = `${base.slice(0, 3)}${suffix}`;
    suffix += 1;
  }
  used.add(candidate);
  return candidate;
}

function buildSpainClubs(rng: RNG): Club[] {
  const badges = shuffle(rng, BADGE_TEMPLATES).slice(0, 8);
  return SPAIN_REAL_CLUBS.map((seed, idx) => ({
    id: makeId("club"),
    name: seed.name,
    shortName: seed.shortName,
    nickname: seed.nickname,
    country: "Spain",
    city: seed.city,
    stadium: seed.stadium,
    primaryColor: seed.primaryColor,
    secondaryColor: seed.secondaryColor,
    badgeId: badges[idx].id,
    kitId: pick(rng, KIT_TEMPLATES).id,
    reputation: seed.reputation,
    budget: seed.budget,
    weeklyWages: Math.round(seed.budget * 0.018),
    identity: seed.identity,
    isUserClub: false,
  }));
}

export function buildAiClubs(country: string, rng: RNG): Club[] {
  if (country === "Spain") return buildSpainClubs(rng);

  const style = countryStyle(country);
  const cities = shuffle(rng, style.cities).slice(0, 8);
  const identities = shuffle(rng, IDENTITIES);
  const badges = shuffle(rng, BADGE_TEMPLATES).slice(0, 8);
  const colors = shuffle(rng, COLOR_PAIRS).slice(0, 8);
  const tiers = shuffle(rng, STRENGTH_TIERS);
  const usedShortNames = new Set<string>();

  return cities.map((city, idx) => {
    const namePattern = pick(rng, style.namePatterns);
    const name = namePattern.replace("{c}", city);
    const nicknamePattern = pick(rng, style.nicknamePatterns);
    const nickname = nicknamePattern.replace("{c}", city);
    const [reputation, budget] = tiers[idx];

    return {
      id: makeId("club"),
      name,
      shortName: shortNameFrom(city, usedShortNames),
      nickname,
      country,
      city,
      stadium: `${city} ${pick(rng, STADIUM_SUFFIXES)}`,
      primaryColor: colors[idx][0],
      secondaryColor: colors[idx][1],
      badgeId: badges[idx].id,
      kitId: pick(rng, KIT_TEMPLATES).id,
      reputation,
      budget,
      weeklyWages: Math.round(budget * 0.018),
      identity: identities[idx],
      isUserClub: false,
    };
  });
}

export function findClubByIdentity(clubs: Club[], identity: ClubIdentity, rng: RNG): Club {
  const matches = clubs.filter((c) => c.identity === identity);
  return matches.length > 0 ? pick(rng, matches) : clubs[randInt(rng, 0, clubs.length - 1)];
}
