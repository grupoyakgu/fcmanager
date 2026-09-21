import { NewsItem } from "@/types";
import Pill from "@/components/ui/Pill";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

const CATEGORY_TONE: Record<NewsItem["category"], "accent" | "positive" | "neutral" | "amber"> = {
  TRANSFER: "accent",
  MATCH_REPORT: "neutral",
  WONDERKID_WATCH: "positive",
  MARKET_MOVERS: "amber",
  YOUR_CLUB: "accent",
  LEAGUE_NEWS: "neutral",
  FINANCE: "neutral",
};

export default function NewsCard({ item, compact, onClick }: { item: NewsItem; compact?: boolean; onClick?: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-1.5 rounded-lg border border-fw-border bg-fw-surface p-3.5 text-start transition-colors hover:border-fw-accent/40 hover:bg-fw-surface-hover",
        compact && "p-3"
      )}
    >
      <div className="flex items-center gap-2">
        <Pill tone={CATEGORY_TONE[item.category]}>{t(`news.category.${item.category}`)}</Pill>
        {item.isBreaking && <Pill tone="negative">{t("news.breaking")}</Pill>}
        <span className="ms-auto text-[10px] font-semibold uppercase tracking-wide text-fw-text-faint">
          {t("news.week", { n: item.week })}
        </span>
      </div>
      <p
        dir="ltr"
        className={cn(
          "font-display font-bold uppercase leading-snug text-fw-text",
          compact ? "text-sm" : "text-base"
        )}
      >
        {item.headline}
      </p>
      {!compact && (
        <p dir="ltr" className="text-sm text-fw-text-dim">
          {item.summary}
        </p>
      )}
    </button>
  );
}
