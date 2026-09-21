import { Club, MatchResult } from "@/types";
import ClubBadge from "@/components/ui/ClubBadge";
import { cn } from "@/lib/utils";

function StatRow({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs font-semibold text-fw-text">
        <span className="tabular-nums">{label === "Possession" ? `${home}%` : home}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-fw-text-faint">{label}</span>
        <span className="tabular-nums">{label === "Possession" ? `${away}%` : away}</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-fw-border">
        <div className="h-full bg-fw-accent" style={{ width: `${homePct}%` }} />
        <div className="h-full bg-fw-text-faint/40" style={{ width: `${100 - homePct}%` }} />
      </div>
    </div>
  );
}

export default function MatchResultCard({
  result,
  homeClub,
  awayClub,
  userClubId,
}: {
  result: MatchResult;
  homeClub: Club;
  awayClub: Club;
  userClubId: string;
}) {
  const userIsHome = result.homeClubId === userClubId;
  const userGoals = userIsHome ? result.homeGoals : result.awayGoals;
  const oppGoals = userIsHome ? result.awayGoals : result.homeGoals;
  const outcome = userGoals > oppGoals ? "win" : userGoals < oppGoals ? "loss" : "draw";
  const topRatings = [...result.playerRatings].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="fw-animate-pop overflow-hidden rounded-2xl border border-fw-border bg-fw-bg-elevated">
      <div
        className={cn(
          "px-6 py-8 text-center",
          outcome === "win" && "bg-fw-positive/10",
          outcome === "loss" && "bg-fw-negative/10",
          outcome === "draw" && "bg-fw-amber/10"
        )}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-fw-text-faint">Full Time</p>
        <div className="mt-4 grid grid-cols-3 items-center gap-3">
          <TeamScoreBlock club={homeClub} />
          <p className="font-display text-5xl font-black tabular-nums text-fw-text">
            {result.homeGoals} <span className="text-fw-text-faint">-</span> {result.awayGoals}
          </p>
          <TeamScoreBlock club={awayClub} />
        </div>
        <p
          className={cn(
            "mt-4 font-display text-sm font-bold uppercase tracking-widest",
            outcome === "win" && "text-fw-positive",
            outcome === "loss" && "text-fw-negative",
            outcome === "draw" && "text-fw-amber"
          )}
        >
          {outcome === "win" ? "Victory" : outcome === "loss" ? "Defeat" : "Draw"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">Goals</p>
          {result.goals.length === 0 ? (
            <p className="text-sm text-fw-text-faint">No goals in this match.</p>
          ) : (
            <ul className="space-y-1.5">
              {result.goals.map((g, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-fw-text">{g.playerName}</span>
                  <span className="font-display font-semibold tabular-nums text-fw-text-faint">{g.minute}&apos;</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">Match Stats</p>
          <StatRow label="Possession" home={result.homeStats.possession} away={result.awayStats.possession} />
          <StatRow label="Shots" home={result.homeStats.shots} away={result.awayStats.shots} />
          <StatRow label="On Target" home={result.homeStats.shotsOnTarget} away={result.awayStats.shotsOnTarget} />
          <StatRow label="Corners" home={result.homeStats.corners} away={result.awayStats.corners} />
        </div>
      </div>

      <div className="border-t border-fw-border p-5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">Player Ratings</p>
        <ul className="space-y-1.5">
          {topRatings.map((r) => (
            <li key={r.playerId} className="flex items-center justify-between text-sm">
              <span className="text-fw-text">{r.playerName}</span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-display text-xs font-bold tabular-nums",
                  r.rating >= 8 ? "bg-fw-positive/15 text-fw-positive" : r.rating >= 6.5 ? "bg-fw-surface-hover text-fw-text" : "bg-fw-negative/10 text-fw-negative"
                )}
              >
                {r.rating.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TeamScoreBlock({ club }: { club: Club }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ClubBadge badgeId={club.badgeId} primaryColor={club.primaryColor} secondaryColor={club.secondaryColor} size={40} />
      <p className="text-center text-xs font-bold uppercase leading-tight text-fw-text">{club.name}</p>
    </div>
  );
}
