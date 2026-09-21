import { FORMATIONS, FormationName } from "@/types";
import { cn } from "@/lib/utils";

export default function FormationSelector({
  value,
  onChange,
}: {
  value: FormationName;
  onChange: (formation: FormationName) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(FORMATIONS) as FormationName[]).map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={cn(
            "rounded-lg border px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wide transition-colors",
            value === f
              ? "border-fw-accent bg-fw-accent/12 text-fw-accent"
              : "border-fw-border bg-fw-surface text-fw-text-dim hover:border-fw-border-strong"
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
