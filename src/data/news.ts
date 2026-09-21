import { NewsItem } from "@/types";
import { makeId } from "@/lib/utils";

interface SeedNews {
  category: NewsItem["category"];
  headline: string;
  summary: string;
  isBreaking?: boolean;
}

const SEED_NEWS: SeedNews[] = [
  {
    category: "TRANSFER",
    headline: "Northbridge FC submit €2.4M offer for Marco Silva",
    summary: "The youth-focused Bridgemen have opened talks with Capital United over their teenage playmaker.",
    isBreaking: true,
  },
  {
    category: "WONDERKID_WATCH",
    headline: "17-year-old Lucas Moretti attracts attention",
    summary: "Scouts across the Global Premier League are monitoring the Eastside Athletic winger after a string of electric performances.",
  },
  {
    category: "MARKET_MOVERS",
    headline: "Daniel Costa's value falls 7% after quiet spell",
    summary: "The Red Valley veteran has gone three matches without a goal, and the market has taken notice.",
  },
  {
    category: "TRANSFER",
    headline: "Capital United complete €4.8M midfield signing",
    summary: "The Big Spenders continue their aggressive summer business with another marquee arrival.",
    isBreaking: true,
  },
  {
    category: "MATCH_REPORT",
    headline: "Red Valley cruise past Lakeside City 3-0",
    summary: "Daniel Costa opened the scoring inside ten minutes as Red Valley eased to a comfortable win.",
  },
  {
    category: "LEAGUE_NEWS",
    headline: "Title race tightens after weekend results",
    summary: "Just five points separate the top four clubs heading into the second half of the season.",
  },
  {
    category: "FINANCE",
    headline: "Royal Harbor post record matchday revenue",
    summary: "The Dockers' new stand has boosted income significantly this campaign.",
  },
  {
    category: "WONDERKID_WATCH",
    headline: "Blue Borough's academy graduate handed full debut",
    summary: "The Development Club continue to trust their youth pipeline ahead of the transfer market.",
  },
  {
    category: "MARKET_MOVERS",
    headline: "Kingsport FC duo rise in value after strong form",
    summary: "Two Kingsport regulars have seen their market value climb following a run of clean sheets.",
  },
  {
    category: "TRANSFER",
    headline: "Royal Harbor complete bargain deal for released defender",
    summary: "True to their reputation, the Bargain Hunters have picked up a free transfer many clubs overlooked.",
  },
  {
    category: "MATCH_REPORT",
    headline: "Eastside Athletic held to draw by Kingsport FC",
    summary: "A tactical battle ended goalless despite both sides creating good chances.",
  },
  {
    category: "LEAGUE_NEWS",
    headline: "Global Premier League confirms new broadcast deal",
    summary: "The league's growing global audience has attracted a landmark new agreement.",
  },
  {
    category: "TRANSFER",
    headline: "Rumours link Red Valley with move for rising star",
    summary: "The Star Collectors are reportedly monitoring several of the league's most exciting young talents.",
  },
  {
    category: "FINANCE",
    headline: "Wage bills under scrutiny across the league",
    summary: "Several clubs are being urged to balance ambition with financial sustainability.",
  },
  {
    category: "MARKET_MOVERS",
    headline: "Northbridge FC's academy prospect doubles in value",
    summary: "A standout loan spell has transformed the young defender's transfer market standing.",
  },
  {
    category: "MATCH_REPORT",
    headline: "Blue Borough stun Capital United with late winner",
    summary: "A stoppage-time strike condemned the Big Spenders to a surprise away defeat.",
  },
  {
    category: "WONDERKID_WATCH",
    headline: "Lakeside City hand debut to 16-year-old prospect",
    summary: "The Defensive Club's academy continues to produce intriguing young talent.",
  },
  {
    category: "TRANSFER",
    headline: "Capital United open talks over marquee striker",
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
    headline: "Eastside Athletic reject opening bid for star winger",
    summary: "The Balanced club has made clear it will not sell below their valuation.",
  },
  {
    category: "FINANCE",
    headline: "Transfer spending across the league passes new high",
    summary: "Clubs have combined to spend more than ever before this transfer window.",
  },
  {
    category: "MATCH_REPORT",
    headline: "Kingsport FC edge five-goal thriller",
    summary: "A pulsating encounter saw the Tactical side hold their nerve late on.",
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
    headline: "Royal Harbor snatch late point against Red Valley",
    summary: "A dramatic equaliser denied the league leaders a perfect week.",
  },
  {
    category: "TRANSFER",
    headline: "Blue Borough sell academy graduate for club-record fee",
    summary: "The Development Club's model continues to pay dividends on the pitch and in the boardroom.",
  },
  {
    category: "WONDERKID_WATCH",
    headline: "Youth tournament shines light on league's brightest prospects",
    summary: "Several names have emerged as ones to watch heading into next season.",
  },
  {
    category: "FINANCE",
    headline: "Sponsorship revenue climbs across the Global Premier League",
    summary: "Commercial growth continues to strengthen the league's leading clubs.",
  },
];

export function buildSeedNews(startWeek: number): NewsItem[] {
  return SEED_NEWS.map((item, idx) => ({
    id: makeId("news"),
    category: item.category,
    headline: item.headline,
    summary: item.summary,
    isBreaking: item.isBreaking,
    week: Math.max(1, startWeek - Math.floor(idx / 3)),
    timestamp: Math.max(1, startWeek - Math.floor(idx / 3)),
  })).sort((a, b) => b.week - a.week);
}
