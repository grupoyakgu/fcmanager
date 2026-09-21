import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Tone = "neutral" | "accent" | "positive" | "negative" | "amber";

const TONES: Record<Tone, string> = {
  neutral: "bg-fw-surface-hover text-fw-text-dim border-fw-border",
  accent: "bg-fw-accent/15 text-fw-accent border-fw-accent/30",
  positive: "bg-fw-positive/15 text-fw-positive border-fw-positive/30",
  negative: "bg-fw-negative/15 text-fw-negative border-fw-negative/30",
  amber: "bg-fw-amber/15 text-fw-amber border-fw-amber/30",
};

export default function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
