import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-fw-border bg-fw-surface", className)}>{children}</div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div>
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-fw-accent">{eyebrow}</p>
        )}
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-fw-text">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const color = tone === "positive" ? "text-fw-positive" : tone === "negative" ? "text-fw-negative" : "text-fw-text";
  return (
    <div className="rounded-lg border border-fw-border bg-fw-bg-elevated px-3 py-2.5">
      <p className="font-display text-xl font-bold tabular-nums leading-none">
        <span className={color}>{value}</span>
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-fw-text-faint">{label}</p>
      {sub && <p className="text-[11px] text-fw-text-dim">{sub}</p>}
    </div>
  );
}
