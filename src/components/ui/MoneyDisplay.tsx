import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

interface MoneyDisplayProps {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const SIZES = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
  xl: "text-4xl md:text-5xl",
};

export default function MoneyDisplay({ value, label, size = "md", trend, className }: MoneyDisplayProps) {
  const color =
    trend === "up" ? "text-fw-positive" : trend === "down" ? "text-fw-negative" : "text-fw-text";
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className={cn("font-display font-semibold tabular-nums leading-none", SIZES[size], color)}>
        {formatCurrency(value)}
      </span>
      {label && <span className="text-[11px] font-medium uppercase tracking-wider text-fw-text-faint">{label}</span>}
    </div>
  );
}
