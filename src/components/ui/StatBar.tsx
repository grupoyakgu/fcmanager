import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  className?: string;
}

function colorFor(value: number): string {
  if (value >= 80) return "bg-fw-positive";
  if (value >= 60) return "bg-fw-accent";
  if (value >= 40) return "bg-fw-amber";
  return "bg-fw-negative";
}

export default function StatBar({ label, value, max = 99, className }: StatBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-fw-text-dim">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-fw-border">
        <div className={cn("h-full rounded-full", colorFor(value))} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-7 shrink-0 text-right font-display text-sm font-semibold tabular-nums text-fw-text">
        {value}
      </span>
    </div>
  );
}
