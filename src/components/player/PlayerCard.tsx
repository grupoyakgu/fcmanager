import { Player } from "@/types";
import PlayerPortrait from "@/components/player/PlayerPortrait";
import Pill from "@/components/ui/Pill";
import { formatCurrency } from "@/lib/formatCurrency";
import { flagFor } from "@/data/nameData";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  className?: string;
  showValue?: boolean;
  highlight?: boolean;
}

function overallColor(value: number): string {
  if (value >= 80) return "text-fw-positive";
  if (value >= 68) return "text-fw-accent";
  if (value >= 55) return "text-fw-amber";
  return "text-fw-text-dim";
}

export default function PlayerCard({ player, onClick, className, showValue = true, highlight }: PlayerCardProps) {
  const initials = `${player.firstName[0]}${player.lastName[0]}`;
  const isWonderkid = player.scouted && player.age <= 19 && player.potential >= 84;
  const isYoungTalent = !isWonderkid && player.age <= 21;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-40 shrink-0 flex-col overflow-hidden rounded-xl border bg-fw-surface text-left transition-all hover:-translate-y-0.5 hover:border-fw-accent/50 hover:shadow-lg hover:shadow-black/20",
        highlight ? "border-fw-accent/60" : "border-fw-border",
        className
      )}
    >
      <PlayerPortrait position={player.position} initials={initials} className="h-24 w-full rounded-none" />

      <div className="flex items-center justify-between px-2.5 pt-2">
        <span className={cn("font-display text-2xl font-bold leading-none tabular-nums", overallColor(player.overallRating))}>
          {player.overallRating}
        </span>
        <span className="rounded bg-fw-surface-hover px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fw-text-dim">
          {player.position}
        </span>
      </div>

      <div className="px-2.5 pt-1">
        <p className="truncate text-[13px] font-semibold uppercase tracking-tight text-fw-text">
          {player.firstName[0]}. {player.lastName}
        </p>
        <div className="mt-0.5 flex items-center justify-between text-[11px] text-fw-text-faint">
          <span>AGE {player.age}</span>
          <span aria-hidden>{flagFor(player.nationality)}</span>
        </div>
      </div>

      {(isWonderkid || isYoungTalent) && (
        <div className="px-2.5 pt-1.5">
          <Pill tone={isWonderkid ? "accent" : "neutral"}>{isWonderkid ? "Wonderkid" : "Young Talent"}</Pill>
        </div>
      )}

      {showValue && (
        <div className="mt-auto border-t border-fw-border/70 px-2.5 py-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-fw-text-faint">Value</p>
          <p className="font-display text-sm font-bold tabular-nums text-fw-text">{formatCurrency(player.marketValue)}</p>
        </div>
      )}
    </button>
  );
}
