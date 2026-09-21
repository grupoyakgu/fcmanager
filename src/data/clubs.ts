import { Club, ClubIdentity } from "@/types";

export interface ClubTemplate {
  id: string;
  name: string;
  shortName: string;
  nickname: string;
  country: string;
  city: string;
  stadium: string;
  primaryColor: string;
  secondaryColor: string;
  badgeId: string;
  reputation: number;
  budget: number;
  identity: ClubIdentity;
  identityLabel: string;
  identityBlurb: string;
}

export const CLUB_TEMPLATES: ClubTemplate[] = [
  {
    id: "club-northbridge",
    name: "Northbridge FC",
    shortName: "NOR",
    nickname: "The Bridgemen",
    country: "England",
    city: "Northbridge",
    stadium: "Bridgewater Park",
    primaryColor: "#1d4ed8",
    secondaryColor: "#f8fafc",
    badgeId: "badge-shield-lion",
    reputation: 62,
    budget: 6_200_000,
    identity: "YOUTH_FACTORY",
    identityLabel: "YOUTH FACTORY",
    identityBlurb: "Targets under-21 talent and builds through the academy.",
  },
  {
    id: "club-capital-united",
    name: "Capital United",
    shortName: "CAP",
    nickname: "The Capitals",
    country: "France",
    city: "Grandport",
    stadium: "Stade Royal",
    primaryColor: "#7c1d2c",
    secondaryColor: "#e8b923",
    badgeId: "badge-crest-lion",
    reputation: 84,
    budget: 22_500_000,
    identity: "BIG_SPENDER",
    identityLabel: "BIG SPENDER",
    identityBlurb: "Chases high-rated, proven players regardless of price.",
  },
  {
    id: "club-royal-harbor",
    name: "Royal Harbor",
    shortName: "RHB",
    nickname: "The Dockers",
    country: "Netherlands",
    city: "Harborview",
    stadium: "Harbor Arena",
    primaryColor: "#0f766e",
    secondaryColor: "#f1f5f9",
    badgeId: "badge-round-wave",
    reputation: 58,
    budget: 4_800_000,
    identity: "BARGAIN_HUNTER",
    identityLabel: "BARGAIN HUNTER",
    identityBlurb: "Hunts undervalued players other clubs overlook.",
  },
  {
    id: "club-red-valley",
    name: "Red Valley",
    shortName: "RVL",
    nickname: "The Valley Reds",
    country: "Spain",
    city: "Valdeja",
    stadium: "Estadio del Valle",
    primaryColor: "#dc2626",
    secondaryColor: "#111827",
    badgeId: "badge-shield-star",
    reputation: 88,
    budget: 27_000_000,
    identity: "STAR_COLLECTOR",
    identityLabel: "STAR COLLECTOR",
    identityBlurb: "Builds around marquee, elite-rated superstars.",
  },
  {
    id: "club-eastside-athletic",
    name: "Eastside Athletic",
    shortName: "EAS",
    nickname: "The Athletic",
    country: "Germany",
    city: "Eastford",
    stadium: "Eastside Ground",
    primaryColor: "#ea580c",
    secondaryColor: "#1c1917",
    badgeId: "badge-circle-bolt",
    reputation: 66,
    budget: 9_400_000,
    identity: "BALANCED",
    identityLabel: "BALANCED",
    identityBlurb: "A well-rounded squad with no glaring weaknesses.",
  },
  {
    id: "club-kingsport",
    name: "Kingsport FC",
    shortName: "KGS",
    nickname: "The Kings",
    country: "Croatia",
    city: "Kingsport",
    stadium: "Kingsport Stadium",
    primaryColor: "#4338ca",
    secondaryColor: "#facc15",
    badgeId: "badge-hex-compass",
    reputation: 70,
    budget: 11_800_000,
    identity: "TACTICAL",
    identityLabel: "TACTICAL",
    identityBlurb: "Disciplined, structured recruitment built around a system.",
  },
  {
    id: "club-blue-borough",
    name: "Blue Borough",
    shortName: "BLB",
    nickname: "The Borough",
    country: "Serbia",
    city: "Borough Hill",
    stadium: "Borough Park",
    primaryColor: "#2563eb",
    secondaryColor: "#e2e8f0",
    badgeId: "badge-round-eagle",
    reputation: 54,
    budget: 5_100_000,
    identity: "DEVELOPMENT_CLUB",
    identityLabel: "DEVELOPMENT CLUB",
    identityBlurb: "Develops promising players before selling for profit.",
  },
  {
    id: "club-lakeside-city",
    name: "Lakeside City",
    shortName: "LAK",
    nickname: "The Lakers",
    country: "Turkey",
    city: "Lakeside",
    stadium: "Lakeside Bowl",
    primaryColor: "#0e7490",
    secondaryColor: "#0f172a",
    badgeId: "badge-diamond-mountain",
    reputation: 60,
    budget: 7_600_000,
    identity: "DEFENSIVE_CLUB",
    identityLabel: "DEFENSIVE CLUB",
    identityBlurb: "Prioritizes defenders and goalkeepers above all.",
  },
];

export function buildAiClubs(): Club[] {
  return CLUB_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    shortName: t.shortName,
    nickname: t.nickname,
    country: t.country,
    city: t.city,
    stadium: t.stadium,
    primaryColor: t.primaryColor,
    secondaryColor: t.secondaryColor,
    badgeId: t.badgeId,
    reputation: t.reputation,
    budget: t.budget,
    weeklyWages: Math.round(t.budget * 0.018),
    identity: t.identity,
    isUserClub: false,
  }));
}
