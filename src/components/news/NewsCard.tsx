import { NewsItem } from "@/types";
import Pill from "@/components/ui/Pill";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<NewsItem["category"], string> = {
  TRANSFER: "Transfer",
  MATCH_REPORT: "Match Report",
  WONDERKID_WATCH: "Wonderkid Watch",
  MARKET_MOVERS: "Market Movers",
  YOUR_CLUB: "Your Club",
  LEAGUE_NEWS: "League News",
  FINANCE: "Finance",
};

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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-1.5 rounded-lg border border-fw-border bg-fw-surface p-3.5 text-left transition-colors hover:border-fw-accent/40 hover:bg-fw-surface-hover",
        compact && "p-3"
      )}
    >
      <div className="flex items-center gap-2">
        <Pill tone={CATEGORY_TONE[item.category]}>{CATEGORY_LABEL[item.category]}</Pill>
        {item.isBreaking && <Pill tone="negative">Breaking</Pill>}
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-fw-text-faint">
          Week {item.week}
        </span>
      </div>
      <p className={cn("font-display font-bold uppercase leading-snug text-fw-text", compact ? "text-sm" : "text-base")}>
        {item.headline}
      </p>
      {!compact && <p className="text-sm text-fw-text-dim">{item.summary}</p>}
    </button>
  );
}
