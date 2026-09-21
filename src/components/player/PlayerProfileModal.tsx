"use client";

import { useRouter } from "next/navigation";
import { X, Search, HandCoins, Star, ArrowRightLeft } from "lucide-react";
import { useGameStore } from "@/game/store";
import { useUiStore } from "@/game/uiStore";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import PlayerPortrait from "@/components/player/PlayerPortrait";
import StatBar from "@/components/ui/StatBar";
import { StatTile } from "@/components/ui/Card";
import Pill from "@/components/ui/Pill";
import MoneyDisplay from "@/components/ui/MoneyDisplay";
import { flagFor } from "@/data/nameData";
import { useTranslation } from "@/i18n/useTranslation";

export default function PlayerProfileModal() {
  const router = useRouter();
  const selectedPlayerId = useUiStore((s) => s.selectedPlayerId);
  const closePlayer = useUiStore((s) => s.closePlayer);
  const openOffer = useUiStore((s) => s.openOffer);
  const player = useGameStore((s) => (selectedPlayerId ? s.players.find((p) => p.id === selectedPlayerId) : undefined));
  const clubs = useGameStore((s) => s.clubs);
  const scoutPlayer = useGameStore((s) => s.scoutPlayer);
  const sellPlayer = useGameStore((s) => s.sellPlayer);
  const setLineupSlot = useGameStore((s) => s.setLineupSlot);
  const lineup = useGameStore((s) => s.lineup);
  const bench = useGameStore((s) => s.bench);
  const setBench = useGameStore((s) => s.setBench);
  const { t } = useTranslation();

  if (!selectedPlayerId || !player) return null;
  const p = player;

  const club = clubs.find((c) => c.id === p.clubId);
  const isOwn = p.clubId === USER_CLUB_ID;
  const initials = `${p.firstName[0]}${p.lastName[0]}`;
  const isStarting = lineup.some((s) => s.playerId === p.id);

  function handleSetStarter() {
    const slot = lineup.find((s) => s.position === p.position);
    if (!slot) return;
    if (slot.playerId && slot.playerId !== p.id) {
      setBench([...bench.filter((id) => id !== p.id), slot.playerId]);
    }
    setLineupSlot(slot.slotIndex, p.id);
  }

  function handleSell() {
    if (!confirm(t("profile.sellConfirm", { player: `${p.firstName} ${p.lastName}` }))) return;
    const fee = sellPlayer(p.id);
    if (fee > 0) closePlayer();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={closePlayer}>
      <div
        className="fw-animate-in max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-fw-border bg-fw-bg-elevated sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-fw-border px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-fw-accent">{club?.name ?? t("profile.freeAgent")}</p>
            <h2 className="font-display text-xl font-bold uppercase text-fw-text">
              {player.firstName} {player.lastName}
            </h2>
          </div>
          <button onClick={closePlayer} aria-label="Close" className="rounded-lg p-2 text-fw-text-faint hover:bg-fw-surface-hover hover:text-fw-text">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-[160px_1fr_180px]">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <PlayerPortrait position={player.position} initials={initials} className="h-32 w-32" />
            <div className="text-center sm:text-start">
              <p className="font-display text-3xl font-bold text-fw-text">{player.overallRating}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-fw-text-faint">
                {player.position} &middot; {t("common.age", { n: player.age })}
              </p>
              <p className="mt-1 text-sm text-fw-text-dim">
                {flagFor(player.nationality)} {player.nationality}
              </p>
            </div>
            {isStarting && <Pill tone="accent">{t("profile.startingXi")}</Pill>}
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("profile.attributes")}</p>
            <StatBar label={t("profile.pace")} value={player.pace} />
            <StatBar label={t("profile.shooting")} value={player.shooting} />
            <StatBar label={t("profile.passing")} value={player.passing} />
            <StatBar label={t("profile.defending")} value={player.defending} />
            <StatBar label={t("profile.physical")} value={player.physical} />
            <StatBar label={t("profile.vision")} value={player.vision} />

            <div className="mt-3 grid grid-cols-4 gap-2">
              <StatTile label={t("profile.apps")} value={String(player.appearances)} />
              <StatTile label={t("profile.goals")} value={String(player.goals)} />
              <StatTile label={t("profile.assists")} value={String(player.assists)} />
              <StatTile label={t("profile.avgRating")} value={player.avgRating.toFixed(1)} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("profile.contract")}</p>
              <p className="font-display text-sm font-semibold text-fw-text">{t("profile.yearsLeft", { n: player.contractYears })}</p>
            </div>
            <MoneyDisplay value={player.marketValue} label={t("profile.marketValue")} size="md" />
            <MoneyDisplay value={player.salary} label={t("profile.weeklySalary")} size="sm" />
            <div className="flex gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("profile.form")}</p>
                <p className="font-display text-lg font-bold text-fw-text">{player.form}/10</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("profile.morale")}</p>
                <p className="font-display text-lg font-bold text-fw-text">{player.morale}/10</p>
              </div>
            </div>

            <div className="mt-1 rounded-lg border border-fw-border bg-fw-surface p-3">
              {player.scouted ? (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("profile.potential")}</p>
                  <p className="font-display text-2xl font-bold text-fw-positive">{player.potential}</p>
                </>
              ) : (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("profile.potential")}</p>
                  <p className="font-display text-lg font-bold uppercase text-fw-text-faint">{t("profile.potentialUnknown")}</p>
                  <button
                    onClick={() => scoutPlayer(player.id)}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-fw-accent px-3 py-2 text-xs font-bold uppercase tracking-wide text-fw-accent-fg"
                  >
                    <Search className="h-3.5 w-3.5" /> {t("profile.scoutPlayer")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-fw-border px-5 py-4">
          {isOwn ? (
            <>
              <button
                onClick={handleSetStarter}
                disabled={isStarting}
                className="flex items-center gap-1.5 rounded-lg bg-fw-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-fw-accent-fg disabled:opacity-40"
              >
                <Star className="h-3.5 w-3.5" /> {t("profile.setStarter")}
              </button>
              <button
                onClick={handleSell}
                className="flex items-center gap-1.5 rounded-lg border border-fw-negative/40 bg-fw-negative/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-fw-negative"
              >
                <HandCoins className="h-3.5 w-3.5" /> {t("profile.sell")}
              </button>
              <button
                onClick={() => {
                  closePlayer();
                  router.push("/transfers");
                }}
                className="flex items-center gap-1.5 rounded-lg border border-fw-border bg-fw-surface px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-fw-text-dim"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" /> {t("profile.viewMarket")}
              </button>
            </>
          ) : (
            <>
              {!player.scouted && (
                <button
                  onClick={() => scoutPlayer(player.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-fw-border bg-fw-surface px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-fw-text-dim"
                >
                  <Search className="h-3.5 w-3.5" /> {t("profile.scout")}
                </button>
              )}
              <button
                onClick={() => openOffer(player.id)}
                className="flex items-center gap-1.5 rounded-lg bg-fw-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-fw-accent-fg"
              >
                <HandCoins className="h-3.5 w-3.5" /> {t("profile.makeOffer")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
