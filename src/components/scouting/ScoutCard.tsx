"use client";

import { Player } from "@/types";
import PlayerPortrait from "@/components/player/PlayerPortrait";
import Pill from "@/components/ui/Pill";
import { formatCurrency } from "@/lib/formatCurrency";
import { flagFor } from "@/data/nameData";
import { useGameStore } from "@/game/store";
import { useUiStore } from "@/game/uiStore";
import { FileSearch } from "lucide-react";

export default function ScoutCard({ player }: { player: Player }) {
  const scoutPlayer = useGameStore((s) => s.scoutPlayer);
  const openReport = useUiStore((s) => s.openReport);
  const initials = `${player.firstName[0]}${player.lastName[0]}`;

  function handleClick() {
    if (!player.scouted) scoutPlayer(player.id);
    openReport(player.id);
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-fw-border bg-fw-surface p-3">
      <PlayerPortrait position={player.position} initials={initials} className="h-12 w-12 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-fw-text">
          {player.firstName} {player.lastName} <span className="ml-1">{flagFor(player.nationality)}</span>
        </p>
        <p className="text-[11px] text-fw-text-faint">
          {player.position} &middot; AGE {player.age} &middot; OVR {player.overallRating}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <Pill tone={player.scouted ? "positive" : "neutral"}>{player.scouted ? "Scouted" : "Unscouted"}</Pill>
          <span className="text-[10px] font-semibold text-fw-text-faint">{formatCurrency(player.marketValue)}</span>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-fw-accent px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-fw-accent-fg"
      >
        <FileSearch className="h-3.5 w-3.5" />
        {player.scouted ? "View Report" : "Scout"}
      </button>
    </div>
  );
}
