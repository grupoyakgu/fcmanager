"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center rounded-lg border border-fw-border bg-fw-surface p-0.5 text-[11px] font-bold">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={cn(
          "rounded-md px-2 py-1.5 uppercase tracking-wide transition-colors",
          language === "en" ? "bg-fw-accent text-fw-accent-fg" : "text-fw-text-faint hover:text-fw-text"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("he")}
        aria-pressed={language === "he"}
        className={cn(
          "rounded-md px-2 py-1.5 tracking-wide transition-colors",
          language === "he" ? "bg-fw-accent text-fw-accent-fg" : "text-fw-text-faint hover:text-fw-text"
        )}
      >
        עב
      </button>
    </div>
  );
}
