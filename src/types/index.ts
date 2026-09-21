// Core domain types for FOOTBALL WORLD

export type Position =
  | "GK"
  | "CB"
  | "LB"
  | "RB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LW"
  | "RW"
  | "ST";

export type ClubIdentity =
  | "YOUTH_FACTORY"
  | "BIG_SPENDER"
  | "BARGAIN_HUNTER"
  | "STAR_COLLECTOR"
  | "BALANCED"
  | "TACTICAL"
  | "DEVELOPMENT_CLUB"
  | "DEFENSIVE_CLUB"
  | "USER";

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  position: Position;
  overallRating: number;
  potential: number;
  marketValue: number;
  previousMarketValue: number;
  salary: number;
  contractYears: number;
  pace: number;
  shooting: number;
  passing: number;
  defending: number;
  physical: number;
  vision: number;
  form: number; // 1-10
  morale: number; // 1-10
  developmentRate: number; // 1-10, higher = faster growth
  clubId: string | null; // null = free agent
  scouted: boolean;
  goals: number;
  assists: number;
  appearances: number;
  avgRating: number;
  listedForTransfer?: boolean;
}

export interface Club {
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
  reputation: number; // 1-100
  budget: number;
  weeklyWages: number;
  identity: ClubIdentity;
  isUserClub: boolean;
}

export interface Fixture {
  id: string;
  matchday: number;
  homeClubId: string;
  awayClubId: string;
  played: boolean;
}

export interface MatchStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
}

export interface GoalEvent {
  minute: number;
  playerId: string;
  playerName: string;
  clubId: string;
}

export interface PlayerRating {
  playerId: string;
  playerName: string;
  rating: number;
}

export interface MatchResult {
  id: string;
  fixtureId: string;
  matchday: number;
  homeClubId: string;
  awayClubId: string;
  homeGoals: number;
  awayGoals: number;
  goals: GoalEvent[];
  homeStats: MatchStats;
  awayStats: MatchStats;
  playerRatings: PlayerRating[];
  playedAtWeek: number;
}

export interface LeagueTableRow {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ("W" | "D" | "L")[];
  movement: "up" | "down" | "same";
}

export type NewsCategory =
  | "TRANSFER"
  | "MATCH_REPORT"
  | "WONDERKID_WATCH"
  | "MARKET_MOVERS"
  | "YOUR_CLUB"
  | "LEAGUE_NEWS"
  | "FINANCE";

export interface NewsItem {
  id: string;
  category: NewsCategory;
  headline: string;
  summary: string;
  timestamp: number; // week number for ordering + display
  week: number;
  isBreaking?: boolean;
  relatedClubId?: string;
  relatedPlayerId?: string;
}

export type NotificationType =
  | "SCOUT_REPORT_READY"
  | "OFFER_RECEIVED"
  | "TRANSFER_COMPLETED"
  | "MATCHDAY_STARTING"
  | "VALUE_UP"
  | "VALUE_DOWN"
  | "CONTRACT_REMINDER"
  | "CLUB_NEWS";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  week: number;
  read: boolean;
  relatedPlayerId?: string;
}

export type OfferStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "NEGOTIATING"
  | "PLAYER_INTERESTED";

export interface TransferOffer {
  id: string;
  playerId: string;
  playerName: string;
  fromClubId: string | null; // buyer (user)
  toClubId: string | null; // seller
  askingPrice: number;
  offerAmount: number;
  status: OfferStatus;
  week: number;
  counterOffer?: number;
}

export interface TransferRecord {
  id: string;
  playerId: string;
  playerName: string;
  fromClubId: string | null;
  toClubId: string | null;
  fee: number;
  week: number;
}

export interface MarketMovement {
  playerId: string;
  playerName: string;
  previousValue: number;
  newValue: number;
  changePercent: number;
  reason: string;
  week: number;
}

export const FORMATIONS = {
  "4-3-3": ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CAM", "LW", "ST", "RW"],
  "4-4-2": ["GK", "LB", "CB", "CB", "RB", "LW", "CM", "CM", "RW", "ST", "ST"],
  "4-2-3-1": ["GK", "LB", "CB", "CB", "RB", "CDM", "CDM", "CAM", "LW", "RW", "ST"],
  "3-5-2": ["GK", "CB", "CB", "CB", "LW", "CM", "CDM", "CM", "RW", "ST", "ST"],
} as const;

export type FormationName = keyof typeof FORMATIONS;

export interface SquadSlot {
  slotIndex: number;
  position: Position;
  playerId: string | null;
}

export interface SaveState {
  version: number;
  onboarded: boolean;
  club: Club | null;
  players: Player[];
  clubs: Club[];
  fixtures: Fixture[];
  results: MatchResult[];
  table: LeagueTableRow[];
  news: NewsItem[];
  notifications: AppNotification[];
  offers: TransferOffer[];
  transferHistory: TransferRecord[];
  marketMovements: MarketMovement[];
  currentWeek: number;
  formation: FormationName;
  lineup: SquadSlot[];
  bench: string[];
  captainId: string | null;
}
