"use client";

import { useId } from "react";
import { KIT_TEMPLATES } from "@/data/kits";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

interface ClubKitProps {
  kitId: string;
  primaryColor: string;
  secondaryColor: string;
  size?: number;
  className?: string;
}

const JERSEY_PATH =
  "M9 3 L4 6 L4 10 L7 9 L7 21 L17 21 L17 9 L20 10 L20 6 L15 3 L13 5 Q12 6 11 5 Z";

function PatternFill({
  pattern,
  clipId,
  primary,
  secondary,
}: {
  pattern: string;
  clipId: string;
  primary: string;
  secondary: string;
}) {
  switch (pattern) {
    case "stripes":
      return (
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="24" height="24" fill={primary} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={4.5 + i * 4} y="0" width="2" height="24" fill={secondary} />
          ))}
        </g>
      );
    case "hoops":
      return (
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="24" height="24" fill={primary} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x="0" y={7 + i * 4.5} width="24" height="2.2" fill={secondary} />
          ))}
        </g>
      );
    case "sash":
      return (
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="24" height="24" fill={primary} />
          <rect x="-4" y="9.5" width="32" height="5" fill={secondary} transform="rotate(-28 12 12)" />
        </g>
      );
    case "halves":
      return (
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="12" height="24" fill={primary} />
          <rect x="12" y="0" width="12" height="24" fill={secondary} />
        </g>
      );
    case "chevron":
      return (
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="24" height="24" fill={primary} />
          <path d="M6 13l6 4 6-4v3l-6 4-6-4z" fill={secondary} />
        </g>
      );
    default:
      return (
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="24" height="24" fill={primary} />
        </g>
      );
  }
}

export default function ClubKit({ kitId, primaryColor, secondaryColor, size = 40, className }: ClubKitProps) {
  const rawId = useId();
  const clipId = `kit-clip-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const template = KIT_TEMPLATES.find((k) => k.id === kitId) ?? KIT_TEMPLATES[0];
  const { t } = useTranslation();
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0 drop-shadow-sm", className)}
      role="img"
      aria-label={t("common.clubKit")}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={JERSEY_PATH} />
        </clipPath>
      </defs>
      <PatternFill pattern={template.pattern} clipId={clipId} primary={primaryColor} secondary={secondaryColor} />
      <path d={JERSEY_PATH} fill="none" stroke={secondaryColor} strokeWidth="0.6" strokeOpacity="0.5" />
    </svg>
  );
}
