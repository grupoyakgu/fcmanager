import { Club, Player, Position } from "@/types";
import { mulberry32, randInt, randFloat, pick, clamp, RNG } from "@/lib/rng";
import { NATIONALITIES, NationalityPool } from "@/data/nameData";
import { findClubByIdentity } from "@/data/clubs";
import { makeId } from "@/lib/utils";

function pickNationality(rng: RNG, preferredCountry?: string): NationalityPool {
  if (preferredCountry) {
    const preferred = NATIONALITIES.find((n) => n.country === preferredCountry);
    // Domestic-majority league: most players (but not all) come from the host country.
    if (preferred && rng() < 0.72) return preferred;
  }
  return pick(rng, NATIONALITIES);
}

let usedFullNames = new Set<string>();

type Weights = Partial<Record<"pace" | "shooting" | "passing" | "defending" | "physical" | "vision", number>>;

const POSITION_WEIGHTS: Record<Position, Weights> = {
  GK: { defending: 0.45, physical: 0.35, passing: 0.1, vision: 0.1 },
  CB: { defending: 0.4, physical: 0.3, pace: 0.15, passing: 0.15 },
  LB: { pace: 0.3, defending: 0.3, passing: 0.2, physical: 0.2 },
  RB: { pace: 0.3, defending: 0.3, passing: 0.2, physical: 0.2 },
  CDM: { defending: 0.35, passing: 0.3, vision: 0.2, physical: 0.15 },
  CM: { passing: 0.35, vision: 0.25, defending: 0.2, physical: 0.1, pace: 0.1 },
  CAM: { passing: 0.3, vision: 0.3, shooting: 0.25, pace: 0.15 },
  LW: { pace: 0.35, shooting: 0.25, passing: 0.2, vision: 0.2 },
  RW: { pace: 0.35, shooting: 0.25, passing: 0.2, vision: 0.2 },
  ST: { shooting: 0.4, physical: 0.25, pace: 0.25, passing: 0.1 },
};

const PRIMARY_ATTRS: Record<Position, ("pace" | "shooting" | "passing" | "defending" | "physical" | "vision")[]> = {
  GK: ["defending", "physical"],
  CB: ["defending", "physical"],
  LB: ["pace", "defending"],
  RB: ["pace", "defending"],
  CDM: ["defending", "passing"],
  CM: ["passing", "vision"],
  CAM: ["passing", "vision", "shooting"],
  LW: ["pace", "shooting"],
  RW: ["pace", "shooting"],
  ST: ["shooting", "physical"],
};

type Archetype = "veteran" | "prime" | "young" | "talent";

function rollAge(rng: RNG): { age: number; archetype: Archetype } {
  const r = rng();
  if (r < 0.15) return { age: randInt(rng, 17, 19), archetype: "talent" };
  if (r < 0.42) return { age: randInt(rng, 20, 23), archetype: "young" };
  if (r < 0.82) return { age: randInt(rng, 24, 29), archetype: "prime" };
  return { age: randInt(rng, 30, 35), archetype: "veteran" };
}

function ageMultiplier(attr: string, age: number): number {
  if (attr === "pace") {
    if (age <= 27) return 1;
    if (age <= 30) return 0.95;
    return 0.95 - (age - 30) * 0.045;
  }
  if (attr === "physical") {
    if (age <= 29) return 1;
    return 1 - (age - 29) * 0.025;
  }
  if (attr === "shooting" || attr === "passing" || attr === "vision") {
    if (age <= 20) return 0.88;
    if (age <= 30) return 1;
    return 1 - (age - 30) * 0.01;
  }
  if (attr === "defending") {
    if (age <= 21) return 0.85;
    if (age <= 32) return 1;
    return 0.97;
  }
  return 1;
}

function genAttributes(rng: RNG, position: Position, tier: number, age: number) {
  const primary = PRIMARY_ATTRS[position];
  const attrs: Record<string, number> = {
    pace: 0,
    shooting: 0,
    passing: 0,
    defending: 0,
    physical: 0,
    vision: 0,
  };
  (Object.keys(attrs) as (keyof typeof attrs)[]).forEach((key) => {
    const isPrimary = primary.includes(key as never);
    const base = isPrimary ? randFloat(rng, 58, 90) : randFloat(rng, 32, 68);
    const tierBoost = tier * (isPrimary ? 10 : 6);
    const val = base + tierBoost;
    attrs[key] = clamp(Math.round(val * ageMultiplier(key, age)), 20, 96);
  });
  return attrs as Record<"pace" | "shooting" | "passing" | "defending" | "physical" | "vision", number>;
}

function computeOverall(position: Position, attrs: Record<string, number>): number {
  const weights = POSITION_WEIGHTS[position];
  let total = 0;
  let weightSum = 0;
  Object.entries(weights).forEach(([k, w]) => {
    total += (attrs[k] ?? 0) * (w ?? 0);
    weightSum += w ?? 0;
  });
  return clamp(Math.round(total / weightSum), 38, 94);
}

function roundValue(v: number): number {
  if (v < 200_000) return Math.round(v / 5_000) * 5_000;
  if (v < 1_000_000) return Math.round(v / 25_000) * 25_000;
  if (v < 10_000_000) return Math.round(v / 100_000) * 100_000;
  return Math.round(v / 250_000) * 250_000;
}

function estimateValue(overall: number, age: number, potential: number, position: Position): number {
  const base = Math.pow(overall / 46, 4.6) * 240_000;
  const ageMult = age <= 21 ? 1.1 : age <= 27 ? 1.35 : age <= 30 ? 1.0 : age <= 33 ? 0.55 : 0.3;
  const potentialGap = Math.max(0, potential - overall);
  const potentialMult = 1 + Math.min(potentialGap, 28) * 0.028;
  const posMult = position === "GK" ? 0.8 : ["ST", "CAM", "LW", "RW"].includes(position) ? 1.18 : 1.0;
  return roundValue(Math.max(15_000, base * ageMult * potentialMult * posMult));
}

function computePotential(rng: RNG, overall: number, archetype: Archetype, forceWonderkid?: boolean): number {
  if (archetype === "veteran") return clamp(overall + randInt(rng, 0, 2), overall, 95);
  if (archetype === "prime") return clamp(overall + randInt(rng, 0, 6), overall, 95);
  if (archetype === "young") return clamp(overall + randInt(rng, 4, 14), overall, 95);
  // talent
  if (forceWonderkid ?? rng() < 0.72) {
    return clamp(Math.max(overall + 10, randInt(rng, 84, 92)), overall, 95);
  }
  return clamp(overall + randInt(rng, 8, 18), overall, 83);
}

function seasonStats(rng: RNG, position: Position, overall: number) {
  const appearances = randInt(rng, 4, 7);
  let goals = 0;
  let assists = 0;
  if (position === "ST") {
    goals = randInt(rng, 1, Math.max(1, Math.round(overall / 14)));
    assists = randInt(rng, 0, 3);
  } else if (position === "LW" || position === "RW" || position === "CAM") {
    goals = randInt(rng, 0, Math.max(1, Math.round(overall / 20)));
    assists = randInt(rng, 1, Math.max(1, Math.round(overall / 16)));
  } else if (position === "CM" || position === "CDM") {
    goals = randInt(rng, 0, 2);
    assists = randInt(rng, 0, 3);
  } else if (position === "GK") {
    goals = 0;
    assists = 0;
  } else {
    goals = randInt(rng, 0, 1);
    assists = randInt(rng, 0, 2);
  }
  const avgRating = clamp(6.0 + (overall - 60) / 22 + randFloat(rng, -0.35, 0.4), 5.4, 8.9);
  return { appearances, goals, assists, avgRating: Math.round(avgRating * 10) / 10 };
}

interface GenOptions {
  clubId: string | null;
  position: Position;
  tier: number; // club strength tier, roughly -1.5..2
  forceAge?: number;
  forceArchetype?: Archetype;
  forceWonderkid?: boolean;
  nameHint?: { first: string; last: string; nationality: string };
  preferredCountry?: string;
}

function genPlayer(rng: RNG, opts: GenOptions): Player {
  const { age, archetype } = opts.forceAge
    ? { age: opts.forceAge, archetype: opts.forceArchetype ?? "prime" }
    : rollAge(rng);

  const nat = opts.nameHint
    ? NATIONALITIES.find((n) => n.country === opts.nameHint!.nationality)!
    : pickNationality(rng, opts.preferredCountry);

  let firstName = opts.nameHint?.first ?? pick(rng, nat.firstNames);
  let lastName = opts.nameHint?.last ?? pick(rng, nat.lastNames);
  if (!opts.nameHint) {
    let attempts = 0;
    while (usedFullNames.has(`${firstName} ${lastName}`) && attempts < 25) {
      firstName = pick(rng, nat.firstNames);
      lastName = pick(rng, nat.lastNames);
      attempts += 1;
    }
  }
  usedFullNames.add(`${firstName} ${lastName}`);

  const attrs = genAttributes(rng, opts.position, opts.tier, age);
  const overall = computeOverall(opts.position, attrs);
  const potential = computePotential(rng, overall, archetype, opts.forceWonderkid);
  const marketValue = estimateValue(overall, age, potential, opts.position);
  const salary = Math.max(800, Math.round((marketValue * randFloat(rng, 0.006, 0.012)) / 100) * 100);
  const { appearances, goals, assists, avgRating } = seasonStats(rng, opts.position, overall);

  return {
    id: makeId("player"),
    firstName,
    lastName,
    age,
    nationality: nat.country,
    position: opts.position,
    overallRating: overall,
    potential,
    marketValue,
    previousMarketValue: marketValue,
    salary,
    contractYears: randInt(rng, 1, 5),
    pace: attrs.pace,
    shooting: attrs.shooting,
    passing: attrs.passing,
    defending: attrs.defending,
    physical: attrs.physical,
    vision: attrs.vision,
    form: randInt(rng, 4, 9),
    morale: randInt(rng, 5, 9),
    developmentRate:
      archetype === "talent" ? randInt(rng, 7, 10) : archetype === "young" ? randInt(rng, 5, 8) : archetype === "prime" ? randInt(rng, 3, 6) : randInt(rng, 1, 3),
    clubId: opts.clubId,
    scouted: false,
    goals,
    assists,
    appearances,
    avgRating,
  };
}

const AI_SQUAD_TEMPLATE: Position[] = ["GK", "CB", "CB", "LB", "RB", "CDM", "CM", "CM", "CAM", "LW", "RW", "ST"];
const USER_SQUAD_TEMPLATE: Position[] = [
  "GK", "GK",
  "CB", "CB", "CB", "CB",
  "LB", "LB", "RB",
  "CDM", "CDM",
  "CM", "CM",
  "CAM", "CAM",
  "LW", "LW", "RW",
  "ST", "ST",
];

export const USER_CLUB_ID = "club-user";

export function generateWorld(seed: number, country: string, aiClubs: Club[]) {
  const rng = mulberry32(seed);
  const players: Player[] = [];
  usedFullNames = new Set<string>();

  // Named star / narrative players referenced throughout the game world and
  // in the seed news — kept as fixed personalities regardless of which
  // country's league they end up playing in.
  const starCollectorClub = findClubByIdentity(aiClubs, "STAR_COLLECTOR", rng);
  const bigSpenderClub = findClubByIdentity(aiClubs, "BIG_SPENDER", rng);
  const developmentClub = findClubByIdentity(aiClubs, "DEVELOPMENT_CLUB", rng);

  const danielCosta = genPlayer(rng, {
    clubId: starCollectorClub.id,
    position: "ST",
    tier: 1.5,
    forceAge: 31,
    forceArchetype: "veteran",
    nameHint: { first: "Daniel", last: "Costa", nationality: "Portugal" },
  });
  danielCosta.overallRating = 78;
  danielCosta.potential = 78;
  danielCosta.marketValue = 5_500_000;
  danielCosta.previousMarketValue = 5_930_000;
  players.push(danielCosta);

  const marcoSilva = genPlayer(rng, {
    clubId: bigSpenderClub.id,
    position: "CAM",
    tier: 0.4,
    forceAge: 18,
    forceArchetype: "talent",
    forceWonderkid: true,
    nameHint: { first: "Marco", last: "Silva", nationality: "Spain" },
  });
  marcoSilva.overallRating = 64;
  marcoSilva.potential = 86;
  marcoSilva.marketValue = 1_020_000;
  marcoSilva.previousMarketValue = 900_000;
  marcoSilva.listedForTransfer = true;
  players.push(marcoSilva);

  const lucasMoretti = genPlayer(rng, {
    clubId: developmentClub.id,
    position: "RW",
    tier: 0.6,
    forceAge: 17,
    forceArchetype: "talent",
    forceWonderkid: true,
    nameHint: { first: "Lucas", last: "Moretti", nationality: "Brazil" },
  });
  lucasMoretti.potential = Math.max(lucasMoretti.potential, 88);
  players.push(lucasMoretti);

  // 8 AI clubs, 12 players each. One slot per "star" club is already filled by its named player above.
  const starOccupiedSlot: Record<string, Position> = {
    [starCollectorClub.id]: "ST",
    [bigSpenderClub.id]: "CAM",
    [developmentClub.id]: "RW",
  };
  for (const club of aiClubs) {
    const tier = (club.reputation - 65) / 18;
    let skippedStarSlot = false;
    for (const position of AI_SQUAD_TEMPLATE) {
      if (!skippedStarSlot && starOccupiedSlot[club.id] === position) {
        skippedStarSlot = true;
        continue;
      }
      players.push(genPlayer(rng, { clubId: club.id, position, tier, preferredCountry: country }));
    }
  }

  // User club (FC KOBY default identity) — 20 players, deliberately balanced with one weakness.
  for (const position of USER_SQUAD_TEMPLATE) {
    if (position === "RB") continue; // deliberate weakness: only one senior right-back
    players.push(genPlayer(rng, { clubId: USER_CLUB_ID, position, tier: 0.15, preferredCountry: country }));
  }
  // The single right-back — solid but thin depth is the whole point.
  players.push(genPlayer(rng, { clubId: USER_CLUB_ID, position: "RB", tier: 0.15, preferredCountry: country }));
  // One clear star (captain-level).
  const clubStar = genPlayer(rng, {
    clubId: USER_CLUB_ID,
    position: "CM",
    tier: 1.6,
    forceAge: 28,
    forceArchetype: "prime",
    preferredCountry: country,
  });
  players.push(clubStar);
  // Hidden high-potential player (unscouted wonderkid on the books).
  const hiddenGem = genPlayer(rng, {
    clubId: USER_CLUB_ID,
    position: "CAM",
    tier: 0.3,
    forceAge: 18,
    forceArchetype: "talent",
    forceWonderkid: true,
    preferredCountry: country,
  });
  players.push(hiddenGem);

  // A handful of free agents circulating the market.
  const freeAgentPositions: Position[] = ["CB", "CM", "ST", "GK"];
  for (const position of freeAgentPositions) {
    players.push(genPlayer(rng, { clubId: null, position, tier: -0.6, preferredCountry: country }));
  }

  return { players, starPlayerIds: { danielCosta: danielCosta.id, marcoSilva: marcoSilva.id, lucasMoretti: lucasMoretti.id } };
}
