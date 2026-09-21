import { ReactNode } from "react";
import { Player } from "@/types";
import PlayerPortrait from "@/components/player/PlayerPortrait";
import { formatCurrency } from "@/lib/formatCurrency";
import { flagFor } from "@/data/nameData";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

export default function PlayerMiniCard({
  player,
  onClick,
  right,
  className,
}: {
  player: Player;
  onClick?: () => void;
  right?: ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();
  const initials = `${player.firstName[0]}${player.lastName[0]}`;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-fw-border bg-fw-surface px-3 py-2.5 text-start transition-colors hover:border-fw-accent/40 hover:bg-fw-surface-hover",
        className
      )}
    >
      <PlayerPortrait position={player.position} initials={initials} className="h-11 w-11 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-fw-text">
          {player.firstName} {player.lastName}
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-fw-text-faint">
          <span>{player.position}</span>
          <span>&middot;</span>
          <span>{t("common.age", { n: player.age })}</span>
          <span aria-hidden>{flagFor(player.nationality)}</span>
        </p>
      </div>
      <div className="shrink-0 text-end">
        <p className="font-display text-lg font-bold tabular-nums leading-none text-fw-text">{player.overallRating}</p>
        <p className="text-[10px] font-semibold tabular-nums text-fw-text-faint">{formatCurrency(player.marketValue)}</p>
      </div>
      {right}
    </button>
  );
}
