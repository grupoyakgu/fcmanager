import { Club, Fixture } from "@/types";
import ClubBadge from "@/components/ui/ClubBadge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

const KICKOFF_DAYS = ["Friday", "Saturday", "Saturday", "Sunday", "Sunday"];
const KICKOFF_TIMES = ["18:00", "15:00", "20:00", "14:00", "16:30"];

export function kickoffFor(matchday: number) {
  return {
    day: KICKOFF_DAYS[matchday % KICKOFF_DAYS.length],
    time: KICKOFF_TIMES[matchday % KICKOFF_TIMES.length],
  };
}

export default function MatchPreview({
  fixture,
  homeClub,
  awayClub,
  variant = "hero",
  children,
}: {
  fixture: Fixture;
  homeClub: Club;
  awayClub: Club;
  variant?: "hero" | "full";
  children?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const kickoff = kickoffFor(fixture.matchday);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-fw-border",
        variant === "hero" ? "bg-fw-surface" : "bg-fw-bg-elevated"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `linear-gradient(135deg, ${homeClub.primaryColor}22 0%, transparent 45%, ${awayClub.primaryColor}22 100%)`,
        }}
      />
      <div className="relative z-10 p-5 sm:p-7">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-fw-accent">
          {t("match.matchday", { n: fixture.matchday })}
        </p>

        <div className="mt-4 grid grid-cols-3 items-center gap-2">
          <TeamBlock club={homeClub} align="left" />
          <div className="flex flex-col items-center">
            <span className="font-display text-2xl font-black uppercase tracking-widest text-fw-text-faint">VS</span>
          </div>
          <TeamBlock club={awayClub} align="right" />
        </div>

        <p className="mt-5 text-center text-xs font-semibold uppercase tracking-wide text-fw-text-faint">
          {t(`match.day.${kickoff.day}`)} {kickoff.time} &middot; {homeClub.stadium}
        </p>

        {children}
      </div>
    </div>
  );
}

function TeamBlock({ club, align }: { club: Club; align: "left" | "right" }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", align === "left" ? "sm:items-end" : "sm:items-start")}>
      <ClubBadge badgeId={club.badgeId} primaryColor={club.primaryColor} secondaryColor={club.secondaryColor} size={44} />
      <p className="text-center text-sm font-bold uppercase leading-tight text-fw-text sm:text-end">{club.name}</p>
    </div>
  );
}
