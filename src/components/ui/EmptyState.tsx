import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-fw-border bg-fw-surface/40 px-6 py-10 text-center",
        className
      )}
    >
      {Icon && <Icon className="mb-1 h-7 w-7 text-fw-text-faint" strokeWidth={1.5} />}
      <p className="font-display text-sm font-semibold uppercase tracking-wide text-fw-text-dim">{title}</p>
      <p className="max-w-xs text-sm text-fw-text-faint">{message}</p>
    </div>
  );
}
