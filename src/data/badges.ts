// Original, fictional badge templates (SVG/CSS shapes only — no real club crests).
export interface BadgeTemplate {
  id: string;
  name: string;
  shape: "shield" | "roundShield" | "circle" | "diamond" | "hex" | "crest" | "arch" | "square";
  symbol: "star" | "lion" | "eagle" | "wave" | "bolt" | "ball" | "mountain" | "compass" | "wing" | "flame";
}

export const BADGE_TEMPLATES: BadgeTemplate[] = [
  { id: "badge-shield-star", name: "Shield Star", shape: "shield", symbol: "star" },
  { id: "badge-shield-lion", name: "Shield Lion", shape: "shield", symbol: "lion" },
  { id: "badge-round-eagle", name: "Round Eagle", shape: "roundShield", symbol: "eagle" },
  { id: "badge-round-wave", name: "Round Wave", shape: "roundShield", symbol: "wave" },
  { id: "badge-circle-bolt", name: "Circle Bolt", shape: "circle", symbol: "bolt" },
  { id: "badge-circle-ball", name: "Circle Ball", shape: "circle", symbol: "ball" },
  { id: "badge-diamond-mountain", name: "Diamond Peak", shape: "diamond", symbol: "mountain" },
  { id: "badge-hex-compass", name: "Hex Compass", shape: "hex", symbol: "compass" },
  { id: "badge-crest-wing", name: "Crest Wing", shape: "crest", symbol: "wing" },
  { id: "badge-arch-flame", name: "Arch Flame", shape: "arch", symbol: "flame" },
  { id: "badge-square-star", name: "Square Star", shape: "square", symbol: "star" },
  { id: "badge-crest-lion", name: "Crest Lion", shape: "crest", symbol: "lion" },
];
