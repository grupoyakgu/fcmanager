"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Language, TRANSLATIONS, interpolate } from "@/i18n/translations";

interface SettingsState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "football-world-settings-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useTranslation() {
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  function t(key: string, vars?: Record<string, string | number>): string {
    const dict = TRANSLATIONS[language];
    const template = dict[key] ?? TRANSLATIONS.en[key] ?? key;
    return interpolate(template, vars);
  }

  return { t, language, setLanguage, isRtl: language === "he" };
}
