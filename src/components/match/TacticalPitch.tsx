import { FormationName, Player, SquadSlot } from "@/types";
import { cn } from "@/lib/utils";

const LAYOUTS: Record<FormationName, { x: number; y: number }[]> = {
  "4-3-3": [
    { x: 50, y: 91 },
    { x: 14, y: 71 },
    { x: 37, y: 76 },
    { x: 63, y: 76 },
    { x: 86, y: 71 },
    { x: 34, y: 50 },
    { x: 66, y: 50 },
    { x: 50, y: 31 },
    { x: 16, y: 13 },
    { x: 50, y: 7 },
    { x: 84, y: 13 },
  ],
  "4-4-2": [
    { x: 50, y: 91 },
    { x: 14, y: 71 },
    { x: 37, y: 76 },
    { x: 63, y: 76 },
    { x: 86, y: 71 },
    { x: 14, y: 42 },
    { x: 38, y: 47 },
    { x: 62, y: 47 },
    { x: 86, y: 42 },
    { x: 38, y: 11 },
    { x: 62, y: 11 },
  ],
  "4-2-3-1": [
    { x: 50, y: 91 },
    { x: 14, y: 71 },
    { x: 37, y: 76 },
    { x: 63, y: 76 },
    { x: 86, y: 71 },
    { x: 38, y: 55 },
    { x: 62, y: 55 },
    { x: 50, y: 33 },
    { x: 18, y: 13 },
    { x: 82, y: 13 },
    { x: 50, y: 7 },
  ],
  "3-5-2": [
    { x: 50, y: 91 },
    { x: 28, y: 76 },
    { x: 50, y: 80 },
    { x: 72, y: 76 },
    { x: 8, y: 46 },
    { x: 35, y: 50 },
    { x: 50, y: 58 },
    { x: 65, y: 50 },
    { x: 92, y: 46 },
    { x: 38, y: 11 },
    { x: 62, y: 11 },
  ],
};

export default function TacticalPitch({
  formation,
  lineup,
  players,
  captainId,
  onSlotClick,
  activeSlotIndex,
}: {
  formation: FormationName;
  lineup: SquadSlot[];
  players: Player[];
  captainId: string | null;
  onSlotClick: (slotIndex: number) => void;
  activeSlotIndex?: number | null;
}) {
  const layout = LAYOUTS[formation];

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-fw-border sm:aspect-[4/5]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(180deg, #1b5e3a 0, #1b5e3a 11%, #1a5836 11%, #1a5836 22%)",
        }}
      />
      <div className="absolute inset-3 rounded-lg border-2 border-white/25" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/25 sm:h-32 sm:w-32" />
      <div className="absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 bg-white/25" />
      <div className="absolute inset-x-[22%] bottom-3 h-[14%] rounded-t border-2 border-white/25" />
      <div className="absolute inset-x-[22%] top-3 h-[14%] rounded-b border-2 border-white/25" />

      {lineup.map((slot, idx) => {
        const player = slot.playerId ? players.find((p) => p.id === slot.playerId) : undefined;
        const pos = layout[idx] ?? { x: 50, y: 50 };
        const active = activeSlotIndex === slot.slotIndex;
        return (
          <button
            key={slot.slotIndex}
            onClick={() => onSlotClick(slot.slotIndex)}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1 transition-transform hover:scale-105",
                active && "scale-105"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 font-display text-xs font-bold shadow-md sm:h-11 sm:w-11 sm:text-sm",
                  player
                    ? "border-white/70 bg-fw-bg-elevated text-fw-text"
                    : "border-dashed border-white/50 bg-black/20 text-white/60",
                  active && "border-fw-accent"
                )}
              >
                {player ? player.overallRating : "+"}
              </div>
              <span className="max-w-[64px] truncate rounded bg-black/55 px-1 text-[9px] font-bold uppercase tracking-wide text-white sm:max-w-[76px] sm:text-[10px]">
                {player ? player.lastName : slot.position}
                {player && captainId === player.id ? " (C)" : ""}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
