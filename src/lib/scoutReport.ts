import { Player } from "@/types";

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function developmentLabel(rate: number): "FAST" | "MODERATE" | "SLOW" {
  if (rate >= 7) return "FAST";
  if (rate >= 4) return "MODERATE";
  return "SLOW";
}

export function potentialRange(player: Player): { low: number; high: number } {
  const spread = 2 + (hashId(player.id) % 3);
  return {
    low: Math.max(player.overallRating, player.potential - spread),
    high: Math.min(96, player.potential + Math.max(1, spread - 1)),
  };
}

export function scoutConfidence(player: Player): number {
  return 72 + (hashId(player.id + "conf") % 24);
}

const TRAITS: Record<string, string[]> = {
  GK: ["shot-stopping", "command of the box", "distribution", "reflexes"],
  CB: ["aerial dominance", "positioning", "composure on the ball", "tackling"],
  LB: ["overlapping runs", "recovery pace", "crossing", "defensive discipline"],
  RB: ["overlapping runs", "recovery pace", "crossing", "defensive discipline"],
  CDM: ["ball-winning", "screening the defence", "range of passing", "tactical discipline"],
  CM: ["work rate", "range of passing", "box-to-box energy", "decision making"],
  CAM: ["vision", "creativity between the lines", "quick feet", "final ball"],
  LW: ["one-on-one dribbling", "pace in behind", "end product", "movement"],
  RW: ["one-on-one dribbling", "pace in behind", "end product", "movement"],
  ST: ["finishing instinct", "movement in the box", "hold-up play", "composure"],
};

export function generateScoutNote(player: Player): string {
  const traits = TRAITS[player.position] ?? ["all-round ability"];
  const trait = traits[hashId(player.id) % traits.length];
  const ageProfile =
    player.age <= 19
      ? "An exciting long-term project with plenty of room to grow."
      : player.age <= 23
      ? "Already shaping into a reliable option with a high ceiling."
      : player.age <= 29
      ? "A polished, dependable performer in his prime years."
      : "An experienced campaigner who still offers proven quality.";

  return `${player.firstName} ${player.lastName} stands out for ${trait}. ${ageProfile}`;
}
