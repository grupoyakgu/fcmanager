import { Player } from "@/types";
import { RNG } from "@/lib/rng";

export type OfferOutcome = "ACCEPTED" | "CLUB_WANTS_MORE" | "REJECTED";

export interface OfferDecision {
  outcome: OfferOutcome;
  askingPrice: number;
  counterOffer?: number;
}

export function getAskingPrice(player: Player): number {
  // Wonderkids and in-form players command a premium over raw market value.
  const potentialGap = player.potential - player.overallRating;
  const premium = 1 + Math.min(potentialGap, 25) * 0.012 + (player.form >= 8 ? 0.08 : 0);
  return Math.round((player.marketValue * premium) / 5000) * 5000;
}

export function evaluateOffer(player: Player, offerAmount: number, rng: RNG): OfferDecision {
  const askingPrice = getAskingPrice(player);
  const ratio = offerAmount / askingPrice;

  if (ratio >= 1) {
    return { outcome: "ACCEPTED", askingPrice };
  }
  if (ratio >= 0.82) {
    const counterOffer = Math.round((askingPrice * (0.94 + rng() * 0.06)) / 5000) * 5000;
    return { outcome: "CLUB_WANTS_MORE", askingPrice, counterOffer };
  }
  return { outcome: "REJECTED", askingPrice };
}

export function estimateAiSaleOffer(player: Player, rng: RNG): number {
  const factor = 0.82 + rng() * 0.3;
  return Math.round((player.marketValue * factor) / 5000) * 5000;
}
