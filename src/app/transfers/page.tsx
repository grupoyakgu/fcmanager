"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/game/store";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import { SectionHeader } from "@/components/ui/Card";
import TransferCard from "@/components/transfer/TransferCard";
import EmptyState from "@/components/ui/EmptyState";
import MoneyDisplay from "@/components/ui/MoneyDisplay";
import { formatCurrency } from "@/lib/formatCurrency";
import { NATIONALITIES } from "@/data/nameData";
import { Player, Position } from "@/types";
import { SlidersHorizontal, Search } from "lucide-react";

const POSITIONS: (Position | "ALL")[] = ["ALL", "GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"];

export default function TransfersPage() {
  const club = useGameStore((s) => s.club);
  const players = useGameStore((s) => s.players);
  const marketMovements = useGameStore((s) => s.marketMovements);
  const currentWeek = useGameStore((s) => s.currentWeek);

  const [position, setPosition] = useState<Position | "ALL">("ALL");
  const [maxAge, setMaxAge] = useState(40);
  const [minOverall, setMinOverall] = useState(0);
  const [maxPrice, setMaxPrice] = useState(60_000_000);
  const [nationality, setNationality] = useState("ALL");
  const [talentOnly, setTalentOnly] = useState(false);
  const [query, setQuery] = useState("");

  const pool = useMemo(() => {
    return players.filter((p) => {
      if (p.clubId === USER_CLUB_ID) return false;
      if (position !== "ALL" && p.position !== position) return false;
      if (p.age > maxAge) return false;
      if (p.overallRating < minOverall) return false;
      if (p.marketValue > maxPrice) return false;
      if (nationality !== "ALL" && p.nationality !== nationality) return false;
      if (talentOnly && p.age > 21) return false;
      if (query && !`${p.firstName} ${p.lastName}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [players, position, maxAge, minOverall, maxPrice, nationality, talentOnly, query]);

  const featured = [...pool].sort((a, b) => b.overallRating - a.overallRating).slice(0, 8);
  const youngTalents = pool
    .filter((p) => p.age <= 21)
    .sort((a, b) => (b.scouted ? b.potential : b.overallRating) - (a.scouted ? a.potential : a.overallRating))
    .slice(0, 8);
  const moversThisWeek = marketMovements.filter((m) => m.week === currentWeek || m.week === currentWeek - 1);
  const poolIds = new Set(pool.map((p) => p.id));
  const marketMovers = moversThisWeek
    .filter((m) => poolIds.has(m.playerId))
    .map((m) => pool.find((p) => p.id === m.playerId)!)
    .slice(0, 8);
  const recentlyListed = [...pool].sort((a, b) => a.contractYears - b.contractYears).slice(0, 8);

  if (!club) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-fw-border pb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-fw-accent">Global Premier League</p>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-fw-text sm:text-3xl">Transfer Market</h1>
        </div>
        <MoneyDisplay value={club.budget} label="Available Cash" size="lg" />
      </div>

      <div className="rounded-xl border border-fw-border bg-fw-surface p-4">
        <div className="mb-3 flex items-center gap-2 text-fw-text-dim">
          <SlidersHorizontal className="h-4 w-4" />
          <p className="text-xs font-bold uppercase tracking-wide">Filters</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="relative col-span-2 sm:col-span-3 lg:col-span-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fw-text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search player"
              className="w-full rounded-lg border border-fw-border bg-fw-bg py-2 pl-8 pr-2 text-xs text-fw-text outline-none focus:border-fw-accent"
            />
          </div>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as Position | "ALL")}
            className="rounded-lg border border-fw-border bg-fw-bg px-2 py-2 text-xs text-fw-text outline-none focus:border-fw-accent"
          >
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p === "ALL" ? "All Positions" : p}
              </option>
            ))}
          </select>
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="rounded-lg border border-fw-border bg-fw-bg px-2 py-2 text-xs text-fw-text outline-none focus:border-fw-accent"
          >
            <option value="ALL">All Nations</option>
            {NATIONALITIES.map((n) => (
              <option key={n.country} value={n.country}>
                {n.country}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-fw-text-dim">
            Max Age
            <input
              type="range"
              min={16}
              max={40}
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="flex-1 accent-fw-accent"
            />
            <span className="w-6 text-right tabular-nums text-fw-text">{maxAge}</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-fw-text-dim">
            Min OVR
            <input
              type="range"
              min={0}
              max={90}
              value={minOverall}
              onChange={(e) => setMinOverall(Number(e.target.value))}
              className="flex-1 accent-fw-accent"
            />
            <span className="w-6 text-right tabular-nums text-fw-text">{minOverall}</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-fw-text-dim">
            Max Price
            <input
              type="range"
              min={100_000}
              max={60_000_000}
              step={100_000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="flex-1 accent-fw-accent"
            />
            <span className="w-12 text-right tabular-nums text-fw-text">{formatCurrency(maxPrice)}</span>
          </label>
        </div>
        <label className="mt-3 flex w-fit items-center gap-2 text-xs font-semibold text-fw-text-dim">
          <input type="checkbox" checked={talentOnly} onChange={(e) => setTalentOnly(e.target.checked)} className="accent-fw-accent" />
          Talent only (21 & under)
        </label>
      </div>

      <MarketSection title="Featured Targets" eyebrow="Editor's Picks" players={featured} emptyMessage="No players match your filters right now." />
      <MarketSection title="Young Talents" eyebrow="Future Stars" players={youngTalents} emptyMessage="No young talents match your filters." />
      <MarketSection title="Market Movers" eyebrow="This Week" players={marketMovers} emptyMessage="No significant value changes this week." />
      <MarketSection title="Recently Listed" eyebrow="Fresh Availability" players={recentlyListed} emptyMessage="No listings match your filters." />
    </div>
  );
}

function MarketSection({
  title,
  eyebrow,
  players,
  emptyMessage,
}: {
  title: string;
  eyebrow: string;
  players: Player[];
  emptyMessage: string;
}) {
  return (
    <section>
      <SectionHeader eyebrow={eyebrow} title={title} />
      {players.length === 0 ? (
        <EmptyState title="NO PLAYERS FOUND" message={emptyMessage} />
      ) : (
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {players.map((p) => (
            <TransferCard key={p.id} player={p} />
          ))}
        </div>
      )}
    </section>
  );
}
