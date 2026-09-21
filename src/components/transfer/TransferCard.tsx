"use client";

import { Player } from "@/types";
import PlayerPortrait from "@/components/player/PlayerPortrait";
import Pill from "@/components/ui/Pill";
import { formatCurrency } from "@/lib/formatCurrency";
import { flagFor } from "@/data/nameData";
import { useGameStore } from "@/game/store";
import { useUiStore } from "@/game/uiStore";
import { Search, HandCoins } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

function overallColor(value: number): string {
  if (value >= 80) return "text-fw-positive";
  if (value >= 68) return "text-fw-accent";
  if (value >= 55) return "text-fw-amber";
  return "text-fw-text-dim";
}

export default function TransferCard({ player }: { player: Player }) {
  const scoutPlayer = useGameStore((s) => s.scoutPlayer);
  const openPlayer = useUiStore((s) => s.openPlayer);
  const openOffer = useUiStore((s) => s.openOffer);
  const { t } = useTranslation();
  const initials = `${player.firstName[0]}${player.lastName[0]}`;
  const isWonderkid = player.scouted && player.age <= 19 && player.potential >= 84;
  const isYoungTalent = !isWonderkid && player.age <= 21;

  return (
    <div className="flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border border-fw-border bg-fw-surface">
      <button type="button" onClick={() => openPlayer(player.id)} className="text-start">
        <PlayerPortrait position={player.position} initials={initials} className="h-24 w-full rounded-none" />
        <div className="flex items-center justify-between px-2.5 pt-2">
          <span className={`font-display text-2xl font-bold leading-none tabular-nums ${overallColor(player.overallRating)}`}>
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
            <span>{t("common.age", { n: player.age })}</span>
            <span aria-hidden>{flagFor(player.nationality)}</span>
          </div>
        </div>
        {(isWonderkid || isYoungTalent) && (
          <div className="px-2.5 pt-1.5">
            <Pill tone={isWonderkid ? "accent" : "neutral"}>{isWonderkid ? t("pill.wonderkid") : t("pill.youngTalent")}</Pill>
          </div>
        )}
        <div className="mt-1.5 px-2.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-fw-text-faint">{t("transfers.price")}</p>
          <p className="font-display text-sm font-bold tabular-nums text-fw-text">{formatCurrency(player.marketValue)}</p>
        </div>
      </button>

      <div className="mt-2 grid grid-cols-2 gap-1.5 border-t border-fw-border/70 p-2">
        <button
          onClick={() => scoutPlayer(player.id)}
          disabled={player.scouted}
          className="flex items-center justify-center gap-1 rounded-md border border-fw-border py-1.5 text-[10px] font-bold uppercase tracking-wide text-fw-text-dim disabled:opacity-40"
        >
          <Search className="h-3 w-3" /> {player.scouted ? t("transfers.scouted") : t("transfers.scout")}
        </button>
        <button
          onClick={() => openOffer(player.id)}
          className="flex items-center justify-center gap-1 rounded-md bg-fw-accent py-1.5 text-[10px] font-bold uppercase tracking-wide text-fw-accent-fg"
        >
          <HandCoins className="h-3 w-3" /> {t("transfers.offer")}
        </button>
      </div>
    </div>
  );
}
