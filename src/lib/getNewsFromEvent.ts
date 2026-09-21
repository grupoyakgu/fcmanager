import { Club, MarketMovement, MatchResult, NewsItem, Player, TransferRecord } from "@/types";
import { makeId } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatCurrency";

function clubName(clubs: Club[], id: string | null): string {
  if (!id) return "a free agent club";
  return clubs.find((c) => c.id === id)?.name ?? "Unknown Club";
}

export function newsFromTransfer(record: TransferRecord, clubs: Club[], week: number): NewsItem {
  const buyer = clubName(clubs, record.toClubId);
  const seller = record.fromClubId ? clubName(clubs, record.fromClubId) : null;
  return {
    id: makeId("news"),
    category: "TRANSFER",
    headline: seller ? `${buyer} complete ${formatCurrency(record.fee)} deal for ${record.playerName}` : `${buyer} sign free agent ${record.playerName}`,
    summary: seller
      ? `${buyer} have completed the signing of ${record.playerName} from ${seller} in a deal worth ${formatCurrency(record.fee)}.`
      : `${buyer} have secured the signature of free agent ${record.playerName}.`,
    timestamp: week,
    week,
    isBreaking: record.fee > 3_000_000,
    relatedClubId: record.toClubId ?? undefined,
    relatedPlayerId: record.playerId,
  };
}

export function newsFromMatch(result: MatchResult, clubs: Club[], week: number, userClubId: string): NewsItem {
  const home = clubs.find((c) => c.id === result.homeClubId)!;
  const away = clubs.find((c) => c.id === result.awayClubId)!;
  const isUserMatch = result.homeClubId === userClubId || result.awayClubId === userClubId;
  const winnerName =
    result.homeGoals > result.awayGoals ? home.name : result.awayGoals > result.homeGoals ? away.name : null;
  const headline = winnerName
    ? `${winnerName} win ${Math.max(result.homeGoals, result.awayGoals)}-${Math.min(result.homeGoals, result.awayGoals)} thriller`
    : `${home.name} and ${away.name} share the points`;
  const topScorer = result.goals[0];
  return {
    id: makeId("news"),
    category: "MATCH_REPORT",
    headline: `${home.name} ${result.homeGoals}-${result.awayGoals} ${away.name}`,
    summary: topScorer
      ? `${headline}. ${topScorer.playerName} was among the scorers in a Matchday ${result.matchday} clash.`
      : headline,
    timestamp: week,
    week,
    isBreaking: isUserMatch,
    relatedClubId: isUserMatch ? userClubId : home.id,
  };
}

export function newsFromMarketMovement(movement: MarketMovement, week: number): NewsItem {
  const up = movement.changePercent >= 0;
  return {
    id: makeId("news"),
    category: "MARKET_MOVERS",
    headline: up
      ? `${movement.playerName}'s value rises ${Math.abs(movement.changePercent).toFixed(1)}%`
      : `${movement.playerName}'s value falls ${Math.abs(movement.changePercent).toFixed(1)}%`,
    summary: `${movement.playerName} is now valued at ${formatCurrency(movement.newValue)} following ${movement.reason}.`,
    timestamp: week,
    week,
    relatedPlayerId: movement.playerId,
  };
}

export function newsFromWonderkid(player: Player, week: number): NewsItem {
  return {
    id: makeId("news"),
    category: "WONDERKID_WATCH",
    headline: `Scouts circle ${player.age}-year-old ${player.firstName} ${player.lastName}`,
    summary: `${player.firstName} ${player.lastName} continues to catch the eye of scouts across the league, with a potential rating scouts believe could reach the top tier.`,
    timestamp: week,
    week,
    relatedPlayerId: player.id,
  };
}

export function newsFromLeagueMovement(club: Club, position: number, direction: "up" | "down", week: number, leagueName: string): NewsItem {
  return {
    id: makeId("news"),
    category: "LEAGUE_NEWS",
    headline: direction === "up" ? `${club.name} climb to ${position}${ordinal(position)}` : `${club.name} slip to ${position}${ordinal(position)}`,
    summary: `${club.name} now sit ${position}${ordinal(position)} in the ${leagueName} table.`,
    timestamp: week,
    week,
    relatedClubId: club.id,
  };
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
