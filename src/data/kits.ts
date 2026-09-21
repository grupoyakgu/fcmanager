// Original, fictional kit patterns (SVG shapes only — no real kit designs).
export interface KitTemplate {
  id: string;
  name: string;
  pattern: "solid" | "stripes" | "hoops" | "sash" | "halves" | "chevron";
}

export const KIT_TEMPLATES: KitTemplate[] = [
  { id: "kit-solid", name: "Solid", pattern: "solid" },
  { id: "kit-stripes", name: "Stripes", pattern: "stripes" },
  { id: "kit-hoops", name: "Hoops", pattern: "hoops" },
  { id: "kit-sash", name: "Sash", pattern: "sash" },
  { id: "kit-halves", name: "Halves", pattern: "halves" },
  { id: "kit-chevron", name: "Chevron", pattern: "chevron" },
];

export function kitTemplateFor(id: string): KitTemplate {
  return KIT_TEMPLATES.find((k) => k.id === id) ?? KIT_TEMPLATES[0];
}
