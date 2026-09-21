import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Club, LeagueTableRow } from "@/types";
import ClubBadge from "@/components/ui/ClubBadge";
import { cn } from "@/lib/utils";

export default function LeagueTable({
  table,
  clubs,
  userClubId,
}: {
  table: LeagueTableRow[];
  clubs: Club[];
  userClubId: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-fw-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-fw-border bg-fw-bg-elevated text-[10px] font-bold uppercase tracking-wider text-fw-text-faint">
            <th className="px-3 py-2.5 text-left">Pos</th>
            <th className="px-3 py-2.5 text-left">Club</th>
            <th className="px-2 py-2.5 text-center">P</th>
            <th className="hidden px-2 py-2.5 text-center sm:table-cell">W</th>
            <th className="hidden px-2 py-2.5 text-center sm:table-cell">D</th>
            <th className="hidden px-2 py-2.5 text-center sm:table-cell">L</th>
            <th className="hidden px-2 py-2.5 text-center md:table-cell">GF</th>
            <th className="hidden px-2 py-2.5 text-center md:table-cell">GA</th>
            <th className="px-2 py-2.5 text-center">GD</th>
            <th className="px-3 py-2.5 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, idx) => {
            const club = clubs.find((c) => c.id === row.clubId);
            if (!club) return null;
            const isUser = row.clubId === userClubId;
            const gd = row.goalsFor - row.goalsAgainst;
            return (
              <tr
                key={row.clubId}
                className={cn(
                  "border-b border-fw-border/60 last:border-0",
                  isUser ? "bg-fw-accent/8" : idx % 2 === 1 ? "bg-fw-bg-elevated/40" : undefined
                )}
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("font-display text-sm font-bold tabular-nums", isUser ? "text-fw-accent" : "text-fw-text")}>
                      {idx + 1}
                    </span>
                    {row.movement === "up" && <ArrowUp className="h-3 w-3 text-fw-positive" />}
                    {row.movement === "down" && <ArrowDown className="h-3 w-3 text-fw-negative" />}
                    {row.movement === "same" && <Minus className="h-3 w-3 text-fw-text-faint" />}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <ClubBadge badgeId={club.badgeId} primaryColor={club.primaryColor} secondaryColor={club.secondaryColor} size={20} />
                    <span className={cn("truncate text-xs font-semibold sm:text-sm", isUser ? "text-fw-accent" : "text-fw-text")}>
                      {club.name}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2.5 text-center tabular-nums text-fw-text-dim">{row.played}</td>
                <td className="hidden px-2 py-2.5 text-center tabular-nums text-fw-text-dim sm:table-cell">{row.won}</td>
                <td className="hidden px-2 py-2.5 text-center tabular-nums text-fw-text-dim sm:table-cell">{row.drawn}</td>
                <td className="hidden px-2 py-2.5 text-center tabular-nums text-fw-text-dim sm:table-cell">{row.lost}</td>
                <td className="hidden px-2 py-2.5 text-center tabular-nums text-fw-text-dim md:table-cell">{row.goalsFor}</td>
                <td className="hidden px-2 py-2.5 text-center tabular-nums text-fw-text-dim md:table-cell">{row.goalsAgainst}</td>
                <td className="px-2 py-2.5 text-center tabular-nums text-fw-text-dim">
                  {gd > 0 ? `+${gd}` : gd}
                </td>
                <td className="px-3 py-2.5 text-center font-display text-sm font-bold tabular-nums text-fw-text">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
