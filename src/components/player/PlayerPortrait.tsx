import { Position } from "@/types";
import { cn } from "@/lib/utils";

const POSITION_TINT: Record<Position, string> = {
  GK: "#f5a623",
  CB: "#5b8def",
  LB: "#5b8def",
  RB: "#5b8def",
  CDM: "#3ddc84",
  CM: "#3ddc84",
  CAM: "#3ddc84",
  LW: "#e5484d",
  RW: "#e5484d",
  ST: "#e5484d",
};

export default function PlayerPortrait({
  position,
  initials,
  className,
}: {
  position: Position;
  initials: string;
  className?: string;
}) {
  const tint = POSITION_TINT[position];
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden rounded-lg", className)}
      style={{
        background: `radial-gradient(circle at 50% 18%, ${tint}33, transparent 60%), linear-gradient(180deg, #171e29 0%, #0c1017 100%)`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-90">
        <circle cx="50" cy="36" r="17" fill="#242e3d" />
        <path d="M14 100c0-24 16-38 36-38s36 14 36 38H14z" fill="#242e3d" />
      </svg>
      <span className="relative z-10 font-display text-lg font-bold tracking-wide text-fw-text-faint">
        {initials}
      </span>
      <div className="absolute inset-x-0 bottom-0 h-6" style={{ background: `linear-gradient(180deg, transparent, ${tint}22)` }} />
    </div>
  );
}
