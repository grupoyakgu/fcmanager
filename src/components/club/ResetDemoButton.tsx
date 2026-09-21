"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useGameStore } from "@/game/store";

export default function ResetDemoButton() {
  const router = useRouter();
  const resetDemo = useGameStore((s) => s.resetDemo);

  function handleReset() {
    const confirmed = window.confirm(
      "Reset demo? This will erase your club, squad, transfers and season progress. This cannot be undone."
    );
    if (!confirmed) return;
    resetDemo();
    router.replace("/onboarding");
  }

  return (
    <button
      onClick={handleReset}
      className="flex items-center gap-2 rounded-lg border border-fw-negative/30 bg-fw-negative/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-fw-negative transition-colors hover:bg-fw-negative/10"
    >
      <RotateCcw className="h-3.5 w-3.5" />
      Reset Demo
    </button>
  );
}
