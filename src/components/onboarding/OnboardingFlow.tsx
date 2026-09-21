"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { useGameStore } from "@/game/store";
import { NATIONALITIES } from "@/data/nameData";
import { BADGE_TEMPLATES } from "@/data/badges";
import ClubBadge from "@/components/ui/ClubBadge";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

const COLOR_SWATCHES = [
  "#3ddc84", "#1d4ed8", "#dc2626", "#f5a623", "#0f766e", "#7c1d2c",
  "#4338ca", "#ea580c", "#2563eb", "#0e7490", "#facc15", "#111827",
];

const NEUTRAL_SECONDARY = ["#f8fafc", "#0f172a", "#e2e8f0", "#111827", "#facc15", "#e8b923"];

interface FormData {
  name: string;
  shortName: string;
  nickname: string;
  country: string;
  badgeId: string;
  primaryColor: string;
  secondaryColor: string;
}

const INITIAL: FormData = {
  name: "FC Koby",
  shortName: "KBY",
  nickname: "The Club",
  country: NATIONALITIES[0].country,
  badgeId: BADGE_TEMPLATES[0].id,
  primaryColor: "#3ddc84",
  secondaryColor: "#0f172a",
};

export default function OnboardingFlow() {
  const router = useRouter();
  const createClub = useGameStore((s) => s.createClub);
  const worldLoaded = useGameStore((s) => s.worldLoaded);
  const ensureWorldLoaded = useGameStore((s) => s.ensureWorldLoaded);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const { t, isRtl } = useTranslation();
  const BackIcon = isRtl ? ChevronRight : ChevronLeft;

  useEffect(() => {
    if (!worldLoaded) ensureWorldLoaded();
  }, [worldLoaded, ensureWorldLoaded]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function finish() {
    createClub(form);
    router.replace("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-fw-bg">
      <div className="relative flex-1 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 15% 10%, rgba(61,220,132,0.14), transparent 45%), radial-gradient(circle at 85% 85%, rgba(61,220,132,0.08), transparent 45%)",
          }}
        />

        <div className="absolute end-4 top-4 z-20 sm:end-6 sm:top-6">
          <LanguageToggle />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-10">
          {step > 1 && step < 5 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mb-4 flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-wide text-fw-text-faint hover:text-fw-text"
            >
              <BackIcon className="h-4 w-4" /> {t("common.back")}
            </button>
          )}

          <div className="mb-8 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-fw-accent" : "bg-fw-border"
                )}
              />
            ))}
          </div>

          <div className="flex flex-1 flex-col justify-center">
            {step === 1 && <ScreenWelcome onNext={() => setStep(2)} />}
            {step === 2 && <ScreenIdentity form={form} update={update} onNext={() => setStep(3)} />}
            {step === 3 && <ScreenBadge form={form} update={update} onNext={() => setStep(4)} />}
            {step === 4 && <ScreenColors form={form} update={update} onNext={() => setStep(5)} />}
            {step === 5 && <ScreenReveal form={form} onFinish={finish} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenWelcome({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="fw-animate-in flex flex-col items-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-fw-accent/30 bg-fw-accent/10">
        <ShieldCheck className="h-8 w-8 text-fw-accent" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.35em] text-fw-accent">{t("brand.name")}</p>
      <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-fw-text sm:text-5xl">
        {t("onboarding.welcome.title")}
      </h1>
      <p className="mt-4 text-base text-fw-text-dim">{t("onboarding.welcome.subtitle")}</p>
      <button
        onClick={onNext}
        className="mt-10 w-full max-w-xs rounded-lg bg-fw-accent px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-fw-accent-fg transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {t("onboarding.welcome.cta")}
      </button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fw-text-faint">{children}</label>;
}

function ScreenIdentity({
  form,
  update,
  onNext,
}: {
  form: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  const valid = form.name.trim().length >= 2;
  return (
    <div className="fw-animate-in flex flex-col gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-fw-accent">{t("onboarding.step", { n: 2 })}</p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase text-fw-text">{t("onboarding.identity.title")}</h2>
      </div>

      <div>
        <FieldLabel>{t("onboarding.identity.clubName")}</FieldLabel>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder={t("onboarding.identity.clubNamePlaceholder")}
          maxLength={28}
          className="w-full rounded-lg border border-fw-border bg-fw-surface px-3.5 py-3 text-sm font-medium text-fw-text outline-none focus:border-fw-accent"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>{t("onboarding.identity.shortName")}</FieldLabel>
          <input
            value={form.shortName}
            onChange={(e) => update("shortName", e.target.value.toUpperCase().slice(0, 4))}
            placeholder="KBY"
            className="w-full rounded-lg border border-fw-border bg-fw-surface px-3.5 py-3 text-sm font-medium uppercase text-fw-text outline-none focus:border-fw-accent"
          />
        </div>
        <div>
          <FieldLabel>{t("onboarding.identity.nickname")}</FieldLabel>
          <input
            value={form.nickname}
            onChange={(e) => update("nickname", e.target.value)}
            placeholder={t("onboarding.identity.nicknamePlaceholder")}
            maxLength={24}
            className="w-full rounded-lg border border-fw-border bg-fw-surface px-3.5 py-3 text-sm font-medium text-fw-text outline-none focus:border-fw-accent"
          />
        </div>
      </div>
      <div>
        <FieldLabel>{t("onboarding.identity.country")}</FieldLabel>
        <select
          value={form.country}
          onChange={(e) => update("country", e.target.value)}
          className="w-full rounded-lg border border-fw-border bg-fw-surface px-3.5 py-3 text-sm font-medium text-fw-text outline-none focus:border-fw-accent"
        >
          {NATIONALITIES.map((n) => (
            <option key={n.country} value={n.country}>
              {n.flag} {n.country}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onNext}
        disabled={!valid}
        className="mt-2 w-full rounded-lg bg-fw-accent px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-fw-accent-fg transition-transform enabled:hover:scale-[1.02] disabled:opacity-40"
      >
        {t("common.continue")}
      </button>
    </div>
  );
}

function ScreenBadge({
  form,
  update,
  onNext,
}: {
  form: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="fw-animate-in flex flex-col gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-fw-accent">{t("onboarding.step", { n: 3 })}</p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase text-fw-text">{t("onboarding.badge.title")}</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {BADGE_TEMPLATES.map((b) => (
          <button
            key={b.id}
            onClick={() => update("badgeId", b.id)}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border bg-fw-surface transition-colors",
              form.badgeId === b.id ? "border-fw-accent bg-fw-accent/10" : "border-fw-border hover:border-fw-border-strong"
            )}
          >
            <ClubBadge badgeId={b.id} primaryColor={form.primaryColor} secondaryColor={form.secondaryColor} size={38} />
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        className="mt-2 w-full rounded-lg bg-fw-accent px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-fw-accent-fg transition-transform hover:scale-[1.02]"
      >
        {t("common.continue")}
      </button>
    </div>
  );
}

function ScreenColors({
  form,
  update,
  onNext,
}: {
  form: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="fw-animate-in flex flex-col gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-fw-accent">{t("onboarding.step", { n: 4 })}</p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase text-fw-text">{t("onboarding.colors.title")}</h2>
      </div>

      <div className="flex justify-center py-4">
        <ClubBadge badgeId={form.badgeId} primaryColor={form.primaryColor} secondaryColor={form.secondaryColor} size={88} />
      </div>

      <div>
        <FieldLabel>{t("onboarding.colors.primary")}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => update("primaryColor", c)}
              style={{ background: c }}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition-transform hover:scale-110",
                form.primaryColor === c ? "border-fw-text" : "border-transparent"
              )}
              aria-label={`${t("onboarding.colors.primary")} ${c}`}
            />
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>{t("onboarding.colors.secondary")}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {NEUTRAL_SECONDARY.map((c) => (
            <button
              key={c}
              onClick={() => update("secondaryColor", c)}
              style={{ background: c }}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition-transform hover:scale-110",
                form.secondaryColor === c ? "border-fw-text" : "border-transparent"
              )}
              aria-label={`${t("onboarding.colors.secondary")} ${c}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-2 w-full rounded-lg bg-fw-accent px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-fw-accent-fg transition-transform hover:scale-[1.02]"
      >
        {t("common.continue")}
      </button>
    </div>
  );
}

function ScreenReveal({ form, onFinish }: { form: FormData; onFinish: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="fw-animate-pop flex flex-col items-center text-center">
      <ClubBadge badgeId={form.badgeId} primaryColor={form.primaryColor} secondaryColor={form.secondaryColor} size={110} />
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-fw-accent">{t("onboarding.reveal.welcome")}</p>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-fw-text sm:text-4xl">
        {form.name}
      </h1>
      <p className="mt-3 text-base text-fw-text-dim">{t("onboarding.reveal.subtitle")}</p>
      <button
        onClick={onFinish}
        className="mt-10 w-full max-w-xs rounded-lg bg-fw-accent px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-fw-accent-fg transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {t("onboarding.reveal.cta")}
      </button>
    </div>
  );
}
