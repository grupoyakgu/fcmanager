"use client";

import Link from "next/link";
import { ArrowRight, Newspaper, Trophy } from "lucide-react";
import { useGameStore } from "@/game/store";
import { useUiStore } from "@/game/uiStore";
import { USER_CLUB_ID } from "@/game/repositories/worldRepository";
import ClubHeader from "@/components/club/ClubHeader";
import MatchPreview from "@/components/match/MatchPreview";
import { SectionHeader } from "@/components/ui/Card";
import NewsCard from "@/components/news/NewsCard";
import PlayerCard from "@/components/player/PlayerCard";
import EmptyState from "@/components/ui/EmptyState";
import { getRecommendedPlayers } from "@/lib/getRecommendedPlayers";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const club = useGameStore((s) => s.club);
  const clubs = useGameStore((s) => s.clubs);
  const players = useGameStore((s) => s.players);
  const table = useGameStore((s) => s.table);
  const news = useGameStore((s) => s.news);
  const getNextUserFixture = useGameStore((s) => s.getNextUserFixture);
  const openPlayer = useUiStore((s) => s.openPlayer);

  if (!club) return null;

  const nextFixture = getNextUserFixture();
  const homeClub = nextFixture ? clubs.find((c) => c.id === nextFixture.homeClubId) : undefined;
  const awayClub = nextFixture ? clubs.find((c) => c.id === nextFixture.awayClubId) : undefined;
  const userRow = table.find((r) => r.clubId === USER_CLUB_ID);
  const mySquad = players.filter((p) => p.clubId === USER_CLUB_ID);
  const recommended = getRecommendedPlayers(players, mySquad, USER_CLUB_ID, 3);

  return (
    <div className="flex flex-col gap-8">
      <ClubHeader />

      {nextFixture && homeClub && awayClub ? (
        <MatchPreview fixture={nextFixture} homeClub={homeClub} awayClub={awayClub} variant="hero">
          <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
            <Link
              href="/squad"
              className="rounded-lg border border-fw-border bg-fw-bg px-5 py-3 text-center font-display text-sm font-bold uppercase tracking-wide text-fw-text transition-colors hover:border-fw-border-strong"
            >
              Manage Squad
            </Link>
            <Link
              href="/match"
              className="rounded-lg bg-fw-accent px-5 py-3 text-center font-display text-sm font-bold uppercase tracking-wide text-fw-accent-fg transition-transform hover:scale-[1.02]"
            >
              Play Match
            </Link>
          </div>
        </MatchPreview>
      ) : (
        <EmptyState icon={Trophy} title="SEASON COMPLETE" message="There are no fixtures remaining right now." />
      )}

      <section>
        <SectionHeader eyebrow="Momentum" title="Recent Form" />
        <div className="flex items-center gap-2">
          {(userRow?.form.length ? userRow.form : []).map((r, idx) => (
            <span
              key={idx}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg font-display text-sm font-bold",
                r === "W" && "bg-fw-positive/15 text-fw-positive",
                r === "D" && "bg-fw-amber/15 text-fw-amber",
                r === "L" && "bg-fw-negative/15 text-fw-negative"
              )}
            >
              {r}
            </span>
          ))}
          {!userRow?.form.length && (
            <p className="text-sm text-fw-text-faint">No matches played yet this season.</p>
          )}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Football Daily"
          title="Latest Headlines"
          action={
            <Link href="/news" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-fw-accent hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          }
        />
        {news.length === 0 ? (
          <EmptyState icon={Newspaper} title="THE FOOTBALL WORLD IS QUIET..." message="For now." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {news.slice(0, 4).map((item) => (
              <NewsCard key={item.id} item={item} compact />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          eyebrow="Scouting Desk"
          title="Transfer Opportunities"
          action={
            <Link href="/transfers" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-fw-accent hover:underline">
              View Market <ArrowRight className="h-3 w-3" />
            </Link>
          }
        />
        {recommended.length === 0 ? (
          <EmptyState title="NO OFFERS YET" message="Your squad already covers every position well." />
        ) : (
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {recommended.map((p) => (
              <PlayerCard key={p.id} player={p} onClick={() => openPlayer(p.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
