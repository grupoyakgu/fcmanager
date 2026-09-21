import { BADGE_TEMPLATES } from "@/data/badges";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

interface ClubBadgeProps {
  badgeId: string;
  primaryColor: string;
  secondaryColor: string;
  size?: number;
  className?: string;
}

function SymbolShape({ symbol, color }: { symbol: string; color: string }) {
  switch (symbol) {
    case "star":
      return <path d="M12 3.5l2.2 4.6 5 .7-3.6 3.6.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.8l5-.7L12 3.5z" fill={color} />;
    case "lion":
      return (
        <circle cx="12" cy="12" r="4.2" fill="none" stroke={color} strokeWidth="1.6" />
      );
    case "eagle":
      return <path d="M6 14l6-7 6 7-6-2.4L6 14z" fill={color} />;
    case "wave":
      return (
        <path d="M5 13c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      );
    case "bolt":
      return <path d="M13 3L6 13h4l-1 8 8-11h-4l1-7z" fill={color} />;
    case "ball":
      return <circle cx="12" cy="12" r="4.5" fill={color} />;
    case "mountain":
      return <path d="M4 16l4.5-7 3 4 2-3L20 16H4z" fill={color} />;
    case "compass":
      return (
        <>
          <circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth="1.4" />
          <path d="M12 8l1.6 3.4L17 13l-3.4 1.6L12 18l-1.6-3.4L7 13l3.4-1.6L12 8z" fill={color} />
        </>
      );
    case "wing":
      return <path d="M4 15c3-4 6-4 8 0 2-4 5-4 8 0-3 1-5 0-8-3-3 3-5 4-8 3z" fill={color} />;
    case "flame":
      return (
        <path
          d="M12 4c1 3-2 4-2 6.5a2 2 0 004 0c0-1 .5-1.5 1-2 .5 1.5 1 3 1 4.5a4 4 0 11-8 0C8 9.5 10 7.5 12 4z"
          fill={color}
        />
      );
    default:
      return <circle cx="12" cy="12" r="4" fill={color} />;
  }
}

function ShapeOutline({ shape, primary, secondary }: { shape: string; primary: string; secondary: string }) {
  const common = { stroke: secondary, strokeWidth: 1.4, fill: primary };
  switch (shape) {
    case "shield":
      return <path d="M12 2.5l8 2.8v6c0 5.2-3.4 8.6-8 10.2-4.6-1.6-8-5-8-10.2v-6l8-2.8z" {...common} />;
    case "roundShield":
      return <path d="M12 2.5l7.5 2.6v5.7c0 5-3.2 8.3-7.5 9.7-4.3-1.4-7.5-4.7-7.5-9.7V5.1L12 2.5z" {...common} />;
    case "circle":
      return <circle cx="12" cy="12" r="9.5" {...common} />;
    case "diamond":
      return <path d="M12 2l9 10-9 10-9-10 9-10z" {...common} />;
    case "hex":
      return <path d="M12 2l8 4.6v10.8L12 22l-8-4.6V6.6L12 2z" {...common} />;
    case "crest":
      return <path d="M12 2.5c3 1.6 5.5 1.8 8 1V13c0 5.5-3.6 8-8 9.5C7.6 21 4 18.5 4 13V3.5c2.5.8 5 .6 8-1z" {...common} />;
    case "arch":
      return <path d="M4 21V11a8 8 0 0116 0v10H4z" {...common} />;
    case "square":
      return <rect x="3" y="3" width="18" height="18" rx="3" {...common} />;
    default:
      return <circle cx="12" cy="12" r="9.5" {...common} />;
  }
}

export default function ClubBadge({ badgeId, primaryColor, secondaryColor, size = 40, className }: ClubBadgeProps) {
  const template = BADGE_TEMPLATES.find((b) => b.id === badgeId) ?? BADGE_TEMPLATES[0];
  const { t } = useTranslation();
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0 drop-shadow-sm", className)}
      role="img"
      aria-label={t("common.clubBadge")}
    >
      <ShapeOutline shape={template.shape} primary={primaryColor} secondary={secondaryColor} />
      <SymbolShape symbol={template.symbol} color={secondaryColor} />
    </svg>
  );
}
