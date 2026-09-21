"use client";

import { useState } from "react";
import { X, CheckCircle2, XCircle, MessageCircleWarning } from "lucide-react";
import { useGameStore } from "@/game/store";
import { useUiStore } from "@/game/uiStore";
import { getAskingPrice } from "@/game/engines/transferEngine";
import { formatCurrency, formatCurrencyPrecise } from "@/lib/formatCurrency";
import { flagFor } from "@/data/nameData";
import { OfferOutcome } from "@/game/engines/transferEngine";
import { useTranslation } from "@/i18n/useTranslation";

interface OfferResultState {
  outcome: OfferOutcome;
  askingPrice: number;
  counterOffer?: number;
  offerId: string;
}

export default function TransferModal() {
  const offerPlayerId = useUiStore((s) => s.offerPlayerId);
  const closeOffer = useUiStore((s) => s.closeOffer);
  const player = useGameStore((s) => (offerPlayerId ? s.players.find((p) => p.id === offerPlayerId) : undefined));
  const club = useGameStore((s) => s.club);
  const makeOffer = useGameStore((s) => s.makeOffer);
  const acceptCounterOffer = useGameStore((s) => s.acceptCounterOffer);

  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<OfferResultState | null>(null);
  const { t } = useTranslation();

  if (!offerPlayerId || !player || !club) return null;
  const askingPrice = getAskingPrice(player);

  function close() {
    setAmount("");
    setResult(null);
    closeOffer();
  }

  function submitOffer() {
    const value = Number(amount.replace(/[^0-9]/g, ""));
    if (!value || value <= 0) return;
    const decision = makeOffer(player!.id, value);
    setResult(decision);
  }

  function acceptCounter() {
    if (!result?.counterOffer) return;
    const ok = acceptCounterOffer(result.offerId);
    if (ok) setResult({ ...result, outcome: "ACCEPTED" });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={close}>
      <div
        className="fw-animate-in w-full max-w-md overflow-hidden rounded-t-2xl border border-fw-border bg-fw-bg-elevated sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-fw-border px-5 py-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-fw-text">{t("offer.title")}</h2>
          <button onClick={close} className="rounded-lg p-1.5 text-fw-text-faint hover:bg-fw-surface-hover hover:text-fw-text">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <p className="font-display text-xl font-bold uppercase text-fw-text">
            {player.firstName} {player.lastName} <span className="ms-1">{flagFor(player.nationality)}</span>
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-fw-text-faint">
            {player.position} &middot; {player.age} &middot; OVR {player.overallRating}
          </p>

          <div className="mt-4 rounded-lg border border-fw-border bg-fw-surface p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("offer.askingPrice")}</p>
            <p className="font-display text-2xl font-bold text-fw-text">{formatCurrency(askingPrice)}</p>
          </div>

          {!result && (
            <div className="mt-4">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{t("offer.yourOffer")}</label>
              <div className="flex items-center gap-2 rounded-lg border border-fw-border bg-fw-surface px-3.5 py-3 focus-within:border-fw-accent">
                <span className="font-display text-lg font-bold text-fw-text-faint">€</span>
                <input
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder={String(askingPrice)}
                  className="w-full bg-transparent font-display text-lg font-bold tabular-nums text-fw-text outline-none placeholder:font-normal placeholder:text-fw-text-faint"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-fw-text-faint">
                {t("offer.availableCash", { amount: formatCurrencyPrecise(club.budget) })}
              </p>

              <button
                onClick={submitOffer}
                disabled={!amount || Number(amount) <= 0 || Number(amount) > club.budget}
                className="mt-4 w-full rounded-lg bg-fw-accent px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-fw-accent-fg disabled:opacity-40"
              >
                {t("offer.makeOffer")}
              </button>
            </div>
          )}

          {result && (
            <div className="fw-animate-pop mt-5 flex flex-col items-center gap-2 rounded-lg border border-fw-border bg-fw-bg px-4 py-5 text-center">
              {result.outcome === "ACCEPTED" && (
                <>
                  <CheckCircle2 className="h-8 w-8 text-fw-positive" />
                  <p className="font-display text-lg font-bold uppercase text-fw-positive">{t("offer.accepted")}</p>
                  <p className="text-xs text-fw-text-dim">
                    {t("offer.acceptedMsg", { player: `${player.firstName} ${player.lastName}`, club: club.name })}
                  </p>
                </>
              )}
              {result.outcome === "CLUB_WANTS_MORE" && (
                <>
                  <MessageCircleWarning className="h-8 w-8 text-fw-amber" />
                  <p className="font-display text-lg font-bold uppercase text-fw-amber">{t("offer.wantsMore")}</p>
                  <p className="text-xs text-fw-text-dim">
                    {t("offer.wantsMoreMsg", { amount: formatCurrency(result.counterOffer ?? askingPrice) })}
                  </p>
                  <button
                    onClick={acceptCounter}
                    disabled={(result.counterOffer ?? 0) > club.budget}
                    className="mt-2 w-full rounded-lg bg-fw-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-fw-accent-fg disabled:opacity-40"
                  >
                    {t("offer.acceptCounter", { amount: formatCurrency(result.counterOffer ?? 0) })}
                  </button>
                </>
              )}
              {result.outcome === "REJECTED" && (
                <>
                  <XCircle className="h-8 w-8 text-fw-negative" />
                  <p className="font-display text-lg font-bold uppercase text-fw-negative">{t("offer.rejected")}</p>
                  <p className="text-xs text-fw-text-dim">{t("offer.rejectedMsg")}</p>
                </>
              )}
              <button onClick={close} className="mt-3 text-xs font-semibold uppercase tracking-wide text-fw-text-faint hover:text-fw-text">
                {t("common.close")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
