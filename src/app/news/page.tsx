"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/game/store";
import NewsCard from "@/components/news/NewsCard";
import EmptyState from "@/components/ui/EmptyState";
import Pill from "@/components/ui/Pill";
import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewsCategory } from "@/types";
import { useTranslation } from "@/i18n/useTranslation";

const CATEGORY_VALUES: (NewsCategory | "ALL")[] = [
  "ALL",
  "TRANSFER",
  "MATCH_REPORT",
  "WONDERKID_WATCH",
  "MARKET_MOVERS",
  "YOUR_CLUB",
  "LEAGUE_NEWS",
  "FINANCE",
];

export default function NewsPage() {
  const news = useGameStore((s) => s.news);
  const [category, setCategory] = useState<NewsCategory | "ALL">("ALL");
  const { t } = useTranslation();

  const filtered = useMemo(
    () => (category === "ALL" ? news : news.filter((n) => n.category === category)),
    [news, category]
  );

  const [featured, ...rest] = filtered;

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-fw-border pb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-fw-accent">{t("news.eyebrow")}</p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-fw-text sm:text-3xl">{t("news.title")}</h1>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_VALUES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn("shrink-0", category === c ? "opacity-100" : "opacity-60 hover:opacity-90")}
          >
            <Pill tone={category === c ? "accent" : "neutral"}>{c === "ALL" ? t("news.all") : t(`news.category.${c}`)}</Pill>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Newspaper} title={t("news.emptyTitle")} message={t("news.emptyMsg")} />
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
                <Pill tone="accent">{t(`news.category.${featured.category}`)}</Pill>
                {featured.isBreaking && <Pill tone="negative">{t("news.breaking")}</Pill>}
                <span className="ms-auto text-[11px] font-semibold uppercase tracking-wide text-fw-text-faint">
                  {t("news.week", { n: featured.week })}
                </span>
              </div>
              <h2 dir="ltr" className="mt-3 text-start font-display text-2xl font-bold uppercase leading-tight text-fw-text">
                {featured.headline}
              </h2>
              <p dir="ltr" className="mt-2 text-start text-sm text-fw-text-dim">
                {featured.summary}
              </p>
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
