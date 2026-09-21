import { Player, MarketMovement } from "@/types";
import { RNG, randFloat, pick } from "@/lib/rng";

const RISE_REASONS = [
  "recent goal-scoring form",
  "a string of impressive performances",
  "growing transfer interest",
  "a breakout run of man-of-the-match displays",
  "strong underlying stats this season",
  "heavy transfer rumours",
];

const FALL_REASONS = [
  "a dip in recent form",
  "reduced playing time",
  "an injury scare",
  "three matches without a goal contribution",
  "advancing contract uncertainty",
  "cooling transfer interest",
];

export function rollMarketMovement(player: Player, week: number, rng: RNG): MarketMovement | null {
  // Younger / higher-potential players move more often; veterans are more stable.
  const volatility = player.age <= 23 ? 0.34 : player.age <= 29 ? 0.2 : 0.12;
  if (rng() > volatility) return null;

  const momentum = player.form >= 7 ? 0.72 : player.form <= 4 ? 0.28 : 0.5;
  const goingUp = rng() < momentum;
  const magnitude = randFloat(rng, 3, goingUp ? 22 : 16);
  const changePercent = goingUp ? magnitude : -magnitude;
  const newValue = Math.max(15_000, Math.round((player.marketValue * (1 + changePercent / 100)) / 5000) * 5000);

  return {
    playerId: player.id,
    playerName: `${player.firstName} ${player.lastName}`,
    previousValue: player.marketValue,
    newValue,
    changePercent: Math.round(changePercent * 10) / 10,
    reason: goingUp ? pick(rng, RISE_REASONS) : pick(rng, FALL_REASONS),
    week,
  };
}
