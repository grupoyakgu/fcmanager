"use client";

import { useState } from "react";
import { Crown, X, Users } from "lucide-react";
import { useGameStore } from "@/game/store";
import { useUiStore } from "@/game/uiStore";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import { SectionHeader, StatTile } from "@/components/ui/Card";
import TacticalPitch from "@/components/match/TacticalPitch";
import FormationSelector from "@/components/match/FormationSelector";
import PlayerMiniCard from "@/components/player/PlayerMiniCard";
import EmptyState from "@/components/ui/EmptyState";
import { calculateTeamRating, calculateSquadValue, calculateAverageAge } from "@/lib/calculateTeamRating";
import { formatCurrency } from "@/lib/formatCurrency";

export default function SquadPage() {
  const players = useGameStore((s) => s.players);
  const formation = useGameStore((s) => s.formation);
  const lineup = useGameStore((s) => s.lineup);
  const bench = useGameStore((s) => s.bench);
  const captainId = useGameStore((s) => s.captainId);
  const setFormation = useGameStore((s) => s.setFormation);
  const setLineupSlot = useGameStore((s) => s.setLineupSlot);
  const setCaptain = useGameStore((s) => s.setCaptain);
  const openPlayer = useUiStore((s) => s.openPlayer);

  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  const squad = players.filter((p) => p.clubId === USER_CLUB_ID);
  const startingPlayers = lineup
    .map((s) => players.find((p) => p.id === s.playerId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const benchPlayers = bench.map((id) => players.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const activeSlot = lineup.find((s) => s.slotIndex === activeSlotIndex) ?? null;
  const eligiblePlayers = activeSlot
    ? squad.filter((p) => p.position === activeSlot.position).sort((a, b) => b.overallRating - a.overallRating)
    : [];

  if (squad.length === 0) {
    return <EmptyState icon={Users} title="NO SQUAD YET" message="Your squad will appear here once your club is ready." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionHeader eyebrow="Team Management" title="Squad" />
        <div className="grid grid-cols-3 gap-3 sm:max-w-md">
          <StatTile label="OVR" value={String(calculateTeamRating(startingPlayers.length ? startingPlayers : squad))} />
          <StatTile label="Value" value={formatCurrency(calculateSquadValue(squad))} />
          <StatTile label="Avg Age" value={calculateAverageAge(squad).toFixed(1)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <FormationSelector value={formation} onChange={setFormation} />
          <TacticalPitch
            formation={formation}
            lineup={lineup}
            players={players}
            captainId={captainId}
            onSlotClick={(idx) => setActiveSlotIndex(idx)}
            activeSlotIndex={activeSlotIndex}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-fw-border bg-fw-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-fw-text">
                {activeSlot ? `Select ${activeSlot.position}` : "Selected Player"}
              </p>
              {activeSlot && (
                <button onClick={() => setActiveSlotIndex(null)} className="text-fw-text-faint hover:text-fw-text">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {!activeSlot && (
              <p className="text-sm text-fw-text-faint">Tap any position on the pitch to view or change your selection.</p>
            )}

            {activeSlot && (
              <div className="flex flex-col gap-2">
                {activeSlot.playerId && (
                  <button
                    onClick={() => setLineupSlot(activeSlot.slotIndex, null)}
                    className="mb-1 rounded-lg border border-fw-negative/30 bg-fw-negative/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-fw-negative"
                  >
                    Remove From XI
                  </button>
                )}
                {eligiblePlayers.length === 0 && (
                  <p className="text-sm text-fw-text-faint">No {activeSlot.position} players in your squad.</p>
                )}
                {eligiblePlayers.map((p) => (
                  <PlayerMiniCard
                    key={p.id}
                    player={p}
                    onClick={() => setLineupSlot(activeSlot.slotIndex, p.id)}
                    className={activeSlot.playerId === p.id ? "border-fw-accent bg-fw-accent/5" : undefined}
                    right={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCaptain(p.id);
                        }}
                        aria-label="Set captain"
                        className={captainId === p.id ? "text-fw-amber" : "text-fw-text-faint hover:text-fw-text-dim"}
                      >
                        <Crown className="h-4 w-4" />
                      </button>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <SectionHeader eyebrow="Reserves" title="Bench" />
        {benchPlayers.length === 0 ? (
          <EmptyState title="BENCH IS EMPTY" message="Every fit squad player is currently in your starting XI." />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {benchPlayers.map((p) => (
              <PlayerMiniCard key={p.id} player={p} onClick={() => openPlayer(p.id)} />
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionHeader eyebrow="Full Roster" title="Squad List" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {squad
            .sort((a, b) => b.overallRating - a.overallRating)
            .map((p) => (
              <PlayerMiniCard key={p.id} player={p} onClick={() => openPlayer(p.id)} />
            ))}
        </div>
      </div>
    </div>
  );
}
