"use client";

import { X, FileText } from "lucide-react";
import { useGameStore } from "@/game/store";
import { useUiStore } from "@/game/uiStore";
import PlayerPortrait from "@/components/player/PlayerPortrait";
import { formatCurrency } from "@/lib/formatCurrency";
import { flagFor } from "@/data/nameData";
import { developmentLabel, potentialRange, scoutConfidence, generateScoutNote } from "@/lib/scoutReport";
import { useTranslation } from "@/i18n/useTranslation";

export default function ScoutReport() {
  const reportPlayerId = useUiStore((s) => s.reportPlayerId);
  const closeReport = useUiStore((s) => s.closeReport);
  const openOffer = useUiStore((s) => s.openOffer);
  const player = useGameStore((s) => (reportPlayerId ? s.players.find((p) => p.id === reportPlayerId) : undefined));
  const { t } = useTranslation();

  if (!reportPlayerId || !player) return null;
  const initials = `${player.firstName[0]}${player.lastName[0]}`;
  const range = potentialRange(player);
  const confidence = scoutConfidence(player);
  const devLabel = t(`report.dev.${developmentLabel(player.developmentRate).toLowerCase()}`);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={closeReport}>
      <div
        className="fw-animate-pop w-full max-w-md overflow-hidden rounded-t-2xl border border-fw-border bg-fw-bg-elevated sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-fw-border px-5 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-fw-accent" />
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-fw-accent">{t("report.title")}</h2>
          </div>
          <button onClick={closeReport} className="rounded-lg p-1.5 text-fw-text-faint hover:bg-fw-surface-hover hover:text-fw-text">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 px-5 pt-5">
          <PlayerPortrait position={player.position} initials={initials} className="h-20 w-20" />
          <div>
            <p className="font-display text-xl font-bold uppercase text-fw-text">
              {player.firstName} {player.lastName} <span className="ms-1">{flagFor(player.nationality)}</span>
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-fw-text-faint">
              {player.age} &middot; {player.position} &middot; {player.overallRating} OVR
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5 py-5">
          <ReportTile label={t("report.potential")} value={`${range.low}-${range.high}`} accent />
          <ReportTile label={t("report.development")} value={devLabel} />
          <ReportTile label={t("report.marketValue")} value={formatCurrency(player.marketValue)} />
          <ReportTile label={t("report.confidence")} value={`${confidence}%`} />
        </div>

        <div className="mx-5 mb-5 rounded-lg border border-fw-border bg-fw-surface p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("report.note")}</p>
          <p dir="ltr" className="text-start text-sm leading-relaxed text-fw-text-dim">
            {generateScoutNote(player)}
          </p>
        </div>

        <div className="border-t border-fw-border px-5 py-4">
          <button
            onClick={() => {
              closeReport();
              openOffer(player.id);
            }}
            className="w-full rounded-lg bg-fw-accent px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-fw-accent-fg"
          >
            {t("report.makeOffer")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-fw-border bg-fw-surface px-3.5 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-fw-text-faint">{label}</p>
      <p className={`font-display text-xl font-bold tabular-nums ${accent ? "text-fw-positive" : "text-fw-text"}`}>{value}</p>
    </div>
  );
}
