"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/game/store";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import BottomNav from "@/components/layout/BottomNav";
import PlayerProfileModal from "@/components/player/PlayerProfileModal";
import TransferModal from "@/components/transfer/TransferModal";
import ScoutReport from "@/components/scouting/ScoutReport";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useGameStore((s) => s.hydrated);
  const onboarded = useGameStore((s) => s.onboarded);
  const ensureWorldLoaded = useGameStore((s) => s.ensureWorldLoaded);
  const rehydrateStarted = useRef(false);

  useEffect(() => {
    if (rehydrateStarted.current) return;
    rehydrateStarted.current = true;
    useGameStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    ensureWorldLoaded();
  }, [hydrated, ensureWorldLoaded]);

  useEffect(() => {
    if (!hydrated) return;
    if (!onboarded && pathname !== "/onboarding") {
      router.replace("/onboarding");
    } else if (onboarded && pathname === "/onboarding") {
      router.replace("/");
    }
  }, [hydrated, onboarded, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-fw-bg">
        <span className="h-2.5 w-2.5 animate-ping rounded-full bg-fw-accent" />
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-fw-text-faint">
          Football World
        </p>
      </div>
    );
  }

  if (pathname === "/onboarding" || !onboarded) {
    return <main className="min-h-screen bg-fw-bg">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-fw-bg">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-[232px]">
        <Topbar />
        <main className="flex-1 px-4 pb-24 pt-5 lg:px-8 lg:pb-10 lg:pt-6">
          <div className="mx-auto w-full max-w-[1560px]">{children}</div>
        </main>
      </div>
      <BottomNav />
      <PlayerProfileModal />
      <TransferModal />
      <ScoutReport />
    </div>
  );
}
