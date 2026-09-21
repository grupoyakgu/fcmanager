"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, Trophy, ArrowRight, ArrowLeft } from "lucide-react";
import { useGameStore } from "@/game/store";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import MatchPreview from "@/components/match/MatchPreview";
import MatchResultCard from "@/components/match/MatchResultCard";
import EmptyState from "@/components/ui/EmptyState";
import { calculateTeamRating } from "@/lib/calculateTeamRating";
import { MatchResult } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

export default function MatchPage() {
  const router = useRouter();
  const club = useGameStore((s) => s.club);
  const clubs = useGameStore((s) => s.clubs);
  const players = useGameStore((s) => s.players);
  const table = useGameStore((s) => s.table);
  const lineup = useGameStore((s) => s.lineup);
  const getNextUserFixture = useGameStore((s) => s.getNextUserFixture);
  const simulateNextUserMatch = useGameStore((s) => s.simulateNextUserMatch);
  const { t, isRtl } = useTranslation();
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;

  const [freshResult, setFreshResult] = useState<MatchResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  if (!club) return null;

  const nextFixture = getNextUserFixture();

  if (freshResult) {
    const homeClub = clubs.find((c) => c.id === freshResult.homeClubId)!;
    const awayClub = clubs.find((c) => c.id === freshResult.awayClubId)!;
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-5">
        <MatchResultCard result={freshResult} homeClub={homeClub} awayClub={awayClub} userClubId={USER_CLUB_ID} />
        <button
          onClick={() => setFreshResult(null)}
          className="rounded-lg bg-fw-accent px-5 py-3 font-display text-sm font-bold uppercase tracking-wide text-fw-accent-fg"
        >
          {t("match.continue")}
        </button>
      </div>
    );
  }

  if (!nextFixture) {
    return <EmptyState icon={Trophy} title={t("match.seasonComplete")} message={t("match.seasonCompleteMsg")} />;
  }

  const homeClub = clubs.find((c) => c.id === nextFixture.homeClubId)!;
  const awayClub = clubs.find((c) => c.id === nextFixture.awayClubId)!;
  const opponent = nextFixture.homeClubId === USER_CLUB_ID ? awayClub : homeClub;
  const opponentPlayers = players.filter((p) => p.clubId === opponent.id);
  const opponentRating = calculateTeamRating(opponentPlayers);
  const userRow = table.find((r) => r.clubId === USER_CLUB_ID);
  const opponentRow = table.find((r) => r.clubId === opponent.id);
  const startingXi = lineup.map((s) => players.find((p) => p.id === s.playerId)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  async function handleSimulate() {
    setSimulating(true);
    await new Promise((r) => setTimeout(r, 550));
    const result = simulateNextUserMatch();
    setSimulating(false);
    if (result) setFreshResult(result);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <MatchPreview fixture={nextFixture} homeClub={homeClub} awayClub={awayClub} variant="full" />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-fw-border bg-fw-surface p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("match.yourForm")}</p>
          <FormRow form={userRow?.form ?? []} />
        </div>
        <div className="rounded-xl border border-fw-border bg-fw-surface p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("match.opponentForm", { club: opponent.shortName })}</p>
          <FormRow form={opponentRow?.form ?? []} />
        </div>
      </div>

      <div className="rounded-xl border border-fw-border bg-fw-surface p-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("match.opponentStrength")}</p>
          <p className="font-display text-2xl font-bold tabular-nums text-fw-text">{opponentRating}</p>
        </div>
        <p className="mt-1 text-xs text-fw-text-faint">{t(`identity.${opponent.identity}`)}</p>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("match.keyPlayers", { n: startingXi.length })}</p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {startingXi
            .sort((a, b) => b.overallRating - a.overallRating)
            .slice(0, 6)
            .map((p) => (
              <div key={p.id} className="flex shrink-0 items-center gap-2 rounded-lg border border-fw-border bg-fw-surface px-3 py-2">
                <span className="font-display text-sm font-bold text-fw-text">{p.overallRating}</span>
                <span className="text-xs text-fw-text-dim">{p.lastName}</span>
              </div>
            ))}
        </div>
        {startingXi.length < 11 && (
          <button onClick={() => router.push("/squad")} className="mt-2 flex items-center gap-1 text-xs font-semibold text-fw-accent hover:underline">
            {t("match.completeXi")} <NextIcon className="h-3 w-3" />
          </button>
        )}
      </div>

      <button
        onClick={handleSimulate}
        disabled={simulating || startingXi.length < 7}
        className="flex items-center justify-center gap-2 rounded-lg bg-fw-accent px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-fw-accent-fg transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
      >
        <PlayCircle className={cn("h-5 w-5", simulating && "fw-pulse")} />
        {simulating ? t("match.simulating") : t("match.simulate")}
      </button>
    </div>
  );
}

function FormRow({ form }: { form: ("W" | "D" | "L")[] }) {
  const { t } = useTranslation();
  if (form.length === 0) return <p className="mt-1 text-sm text-fw-text-faint">{t("match.noMatches")}</p>;
  return (
    <div className="mt-2 flex gap-1.5">
      {form.map((r, idx) => (
        <span
          key={idx}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded text-[11px] font-bold",
            r === "W" && "bg-fw-positive/15 text-fw-positive",
            r === "D" && "bg-fw-amber/15 text-fw-amber",
            r === "L" && "bg-fw-negative/15 text-fw-negative"
          )}
        >
          {r}
        </span>
      ))}
    </div>
  );
}
