import { Club, NewsItem, Player } from "@/types";
import { makeId } from "@/lib/utils";
import { RNG, pick, shuffle } from "@/lib/rng";

const IDENTITY_PHRASE: Record<string, string> = {
  YOUTH_FACTORY: "the Youth Factory",
  BIG_SPENDER: "the Big Spenders",
  BARGAIN_HUNTER: "the Bargain Hunters",
  STAR_COLLECTOR: "the Star Collectors",
  BALANCED: "the Balanced club",
  TACTICAL: "the Tactical side",
  DEVELOPMENT_CLUB: "the Development Club",
  DEFENSIVE_CLUB: "the Defensive Club",
};

interface StarPlayers {
  danielCosta: Player;
  marcoSilva: Player;
  lucasMoretti: Player;
}

interface SeedNews {
  category: NewsItem["category"];
  headline: string;
  summary: string;
  isBreaking?: boolean;
}

function byIdentity(clubs: Club[], identity: string): Club {
  return clubs.find((c) => c.identity === identity) ?? clubs[0];
}

function fullName(p: Player): string {
  return `${p.firstName} ${p.lastName}`;
}

function buildTemplates(clubs: Club[], stars: StarPlayers, rng: RNG, leagueName: string): SeedNews[] {
  const youthFactory = byIdentity(clubs, "YOUTH_FACTORY");
  const bigSpender = byIdentity(clubs, "BIG_SPENDER");
  const bargainHunter = byIdentity(clubs, "BARGAIN_HUNTER");
  const starCollector = byIdentity(clubs, "STAR_COLLECTOR");
  const balanced = byIdentity(clubs, "BALANCED");
  const tactical = byIdentity(clubs, "TACTICAL");
  const development = byIdentity(clubs, "DEVELOPMENT_CLUB");
  const defensive = byIdentity(clubs, "DEFENSIVE_CLUB");

  const shuffled = shuffle(rng, clubs);
  const [pairA1, , pairB1, pairB2, pairC1, pairC2] = shuffled;
  const randomClub = () => pick(rng, clubs);

  return [
    {
      category: "TRANSFER",
      headline: `${youthFactory.name} submit offer for ${fullName(stars.marcoSilva)}`,
      summary: `${youthFactory.nickname} have opened talks with ${bigSpender.name} over their teenage playmaker.`,
      isBreaking: true,
    },
    {
      category: "WONDERKID_WATCH",
      headline: `${stars.lucasMoretti.age}-year-old ${fullName(stars.lucasMoretti)} attracts attention`,
      summary: `Scouts across the ${leagueName} are monitoring the ${development.name} winger after a string of electric performances.`,
    },
    {
      category: "MARKET_MOVERS",
      headline: `${fullName(stars.danielCosta)}'s value falls 7% after quiet spell`,
      summary: `The ${starCollector.name} veteran has gone three matches without a goal, and the market has taken notice.`,
    },
    {
      category: "TRANSFER",
      headline: `${bigSpender.name} complete midfield signing`,
      summary: `${IDENTITY_PHRASE.BIG_SPENDER} continue their aggressive summer business with another marquee arrival.`,
      isBreaking: true,
    },
    {
      category: "MATCH_REPORT",
      headline: `${starCollector.name} cruise past ${pairA1.name} 3-0`,
      summary: `${fullName(stars.danielCosta)} opened the scoring inside ten minutes as ${starCollector.shortName} eased to a comfortable win.`,
    },
    {
      category: "LEAGUE_NEWS",
      headline: "Title race tightens after weekend results",
      summary: "Just five points separate the top four clubs heading into the second half of the season.",
    },
    {
      category: "FINANCE",
      headline: `${bargainHunter.name} post record matchday revenue`,
      summary: `${bargainHunter.nickname}'s new stand has boosted income significantly this campaign.`,
    },
    {
      category: "WONDERKID_WATCH",
      headline: `${development.name}'s academy graduate handed full debut`,
      summary: `${IDENTITY_PHRASE.DEVELOPMENT_CLUB} continue to trust their youth pipeline ahead of the transfer market.`,
    },
    {
      category: "MARKET_MOVERS",
      headline: `${tactical.name} duo rise in value after strong form`,
      summary: `Two ${tactical.shortName} regulars have seen their market value climb following a run of clean sheets.`,
    },
    {
      category: "TRANSFER",
      headline: `${bargainHunter.name} complete bargain deal for released defender`,
      summary: `True to their reputation, ${IDENTITY_PHRASE.BARGAIN_HUNTER} have picked up a free transfer many clubs overlooked.`,
    },
    {
      category: "MATCH_REPORT",
      headline: `${development.name} held to draw by ${tactical.name}`,
      summary: "A tactical battle ended goalless despite both sides creating good chances.",
    },
    {
      category: "LEAGUE_NEWS",
      headline: `${leagueName} confirms new broadcast deal`,
      summary: "The league's growing audience has attracted a landmark new agreement.",
    },
    {
      category: "TRANSFER",
      headline: `Rumours link ${starCollector.name} with move for rising star`,
      summary: `${IDENTITY_PHRASE.STAR_COLLECTOR} are reportedly monitoring several of the league's most exciting young talents.`,
    },
    {
      category: "FINANCE",
      headline: "Wage bills under scrutiny across the league",
      summary: "Several clubs are being urged to balance ambition with financial sustainability.",
    },
    {
      category: "MARKET_MOVERS",
      headline: `${youthFactory.name}'s academy prospect doubles in value`,
      summary: "A standout loan spell has transformed the young defender's transfer market standing.",
    },
    {
      category: "MATCH_REPORT",
      headline: `${pairB1.name} stun ${bigSpender.name} with late winner`,
      summary: `A stoppage-time strike condemned ${IDENTITY_PHRASE.BIG_SPENDER} to a surprise away defeat.`,
    },
    {
      category: "WONDERKID_WATCH",
      headline: `${defensive.name} hand debut to 16-year-old prospect`,
      summary: `${IDENTITY_PHRASE.DEFENSIVE_CLUB}'s academy continues to produce intriguing young talent.`,
    },
    {
      category: "TRANSFER",
      headline: `${bigSpender.name} open talks over marquee striker`,
      summary: "The club's pursuit of elite firepower shows no signs of slowing down.",
    },
    {
      category: "LEAGUE_NEWS",
      headline: "Manager of the Month announced",
      summary: "A tactical mastermind has been recognised after a superb run of results.",
    },
    {
      category: "MARKET_MOVERS",
      headline: "Injury scare sends winger's value tumbling",
      summary: "A minor knock has cooled interest from several suitors.",
    },
    {
      category: "TRANSFER",
      headline: `${balanced.name} reject opening bid for star winger`,
      summary: `${IDENTITY_PHRASE.BALANCED} has made clear it will not sell below their valuation.`,
    },
    {
      category: "FINANCE",
      headline: "Transfer spending across the league passes new high",
      summary: "Clubs have combined to spend more than ever before this transfer window.",
    },
    {
      category: "MATCH_REPORT",
      headline: `${tactical.name} edge five-goal thriller`,
      summary: `A pulsating encounter saw ${IDENTITY_PHRASE.TACTICAL} hold their nerve late on.`,
    },
    {
      category: "WONDERKID_WATCH",
      headline: "Scouting departments circle 18-year-old midfielder",
      summary: "Multiple clubs have dispatched scouts to watch the highly-rated prospect in recent weeks.",
    },
    {
      category: "TRANSFER",
      headline: "Free agent market heats up ahead of deadline",
      summary: "Several experienced players remain without a club as the window edges closer.",
    },
    {
      category: "LEAGUE_NEWS",
      headline: "Relegation battle intensifies at the bottom of the table",
      summary: "Three clubs remain locked together on points with matches running out.",
    },
    {
      category: "MARKET_MOVERS",
      headline: "Veteran defender's value stabilises after new contract",
      summary: "Signing a new deal has settled speculation over the experienced centre-back's future.",
    },
    {
      category: "MATCH_REPORT",
      headline: `${bargainHunter.name} snatch late point against ${starCollector.name}`,
      summary: "A dramatic equaliser denied the league leaders a perfect week.",
    },
    {
      category: "TRANSFER",
      headline: `${development.name} sell academy graduate for club-record fee`,
      summary: `${IDENTITY_PHRASE.DEVELOPMENT_CLUB}'s model continues to pay dividends on the pitch and in the boardroom.`,
    },
    {
      category: "WONDERKID_WATCH",
      headline: "Youth tournament shines light on league's brightest prospects",
      summary: "Several names have emerged as ones to watch heading into next season.",
    },
    {
      category: "FINANCE",
      headline: `Sponsorship revenue climbs across the ${leagueName}`,
      summary: "Commercial growth continues to strengthen the league's leading clubs.",
    },
    {
      category: "MATCH_REPORT",
      headline: `${pairC1.name} and ${pairC2.name} share the points`,
      summary: `Neither side could find a breakthrough as ${pairC1.shortName} and ${pairC2.shortName} played out a cagey draw.`,
    },
    {
      category: "LEAGUE_NEWS",
      headline: `${randomClub().name} climb into the top half`,
      summary: "A run of positive results has lifted spirits around the club.",
    },
    {
      category: "MARKET_MOVERS",
      headline: `${pairB2.name} starlet's stock continues to climb`,
      summary: "Consistent performances have caught the eye of several bigger clubs.",
    },
  ];
}

export function buildSeedNews(clubs: Club[], stars: StarPlayers, rng: RNG, leagueName: string, startWeek: number): NewsItem[] {
  const templates = buildTemplates(clubs, stars, rng, leagueName);
  return templates
    .map((item, idx) => ({
      id: makeId("news"),
      category: item.category,
      headline: item.headline,
      summary: item.summary,
      isBreaking: item.isBreaking,
      week: Math.max(1, startWeek - Math.floor(idx / 3)),
      timestamp: Math.max(1, startWeek - Math.floor(idx / 3)),
    }))
    .sort((a, b) => b.week - a.week);
}
