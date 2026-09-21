"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/game/store";
import NewsCard from "@/components/news/NewsCard";
import EmptyState from "@/components/ui/EmptyState";
import Pill from "@/components/ui/Pill";
import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewsCategory } from "@/types";

const CATEGORIES: { value: NewsCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "MATCH_REPORT", label: "Match Report" },
  { value: "WONDERKID_WATCH", label: "Wonderkid Watch" },
  { value: "MARKET_MOVERS", label: "Market Movers" },
  { value: "YOUR_CLUB", label: "Your Club" },
  { value: "LEAGUE_NEWS", label: "League News" },
  { value: "FINANCE", label: "Finance" },
];

export default function NewsPage() {
  const news = useGameStore((s) => s.news);
  const [category, setCategory] = useState<NewsCategory | "ALL">("ALL");

  const filtered = useMemo(
    () => (category === "ALL" ? news : news.filter((n) => n.category === category)),
    [news, category]
  );

  const [featured, ...rest] = filtered;

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-fw-border pb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-fw-accent">Football Daily</p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-fw-text sm:text-3xl">The Latest News</h1>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn("shrink-0", category === c.value ? "opacity-100" : "opacity-60 hover:opacity-90")}
          >
            <Pill tone={category === c.value ? "accent" : "neutral"}>{c.label}</Pill>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Newspaper} title="THE FOOTBALL WORLD IS QUIET..." message="For now." />
      ) : (
        <div className="flex flex-col gap-6">
          {featured && (
            <div className="rounded-2xl border border-fw-border bg-fw-surface p-6">
              <div
                className="mb-4 flex h-40 items-center justify-center rounded-xl border border-fw-border/60 text-fw-text-faint sm:h-56"
                style={{ background: "linear-gradient(135deg, rgba(61,220,132,0.12), rgba(61,220,132,0.02))" }}
              >
                <Newspaper className="h-10 w-10 opacity-40" />
              </div>
              <div className="flex items-center gap-2">
                <Pill tone="accent">{CATEGORIES.find((c) => c.value === featured.category)?.label}</Pill>
                {featured.isBreaking && <Pill tone="negative">Breaking</Pill>}
                <span className="ml-auto text-[11px] font-semibold uppercase tracking-wide text-fw-text-faint">
                  Week {featured.week}
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase leading-tight text-fw-text">{featured.headline}</h2>
              <p className="mt-2 text-sm text-fw-text-dim">{featured.summary}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
