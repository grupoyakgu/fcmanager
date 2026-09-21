"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CircleDollarSign, Newspaper, TrendingDown, TrendingUp, Trophy, UserCheck, UserPlus } from "lucide-react";
import { useGameStore } from "@/game/store";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import { useTranslation } from "@/i18n/useTranslation";

const ICONS: Record<NotificationType, typeof Bell> = {
  SCOUT_REPORT_READY: UserCheck,
  OFFER_RECEIVED: CircleDollarSign,
  TRANSFER_COMPLETED: UserPlus,
  MATCHDAY_STARTING: Trophy,
  VALUE_UP: TrendingUp,
  VALUE_DOWN: TrendingDown,
  CONTRACT_REMINDER: Newspaper,
  CLUB_NEWS: Newspaper,
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useGameStore((s) => s.notifications);
  const markAllRead = useGameStore((s) => s.markAllNotificationsRead);
  const markRead = useGameStore((s) => s.markNotificationRead);
  const unread = notifications.filter((n) => !n.read).length;
  const { t } = useTranslation();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-fw-border bg-fw-surface text-fw-text-dim transition-colors hover:text-fw-text"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-fw-negative px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fw-animate-in absolute end-0 top-11 z-40 w-80 overflow-hidden rounded-xl border border-fw-border bg-fw-bg-elevated shadow-2xl">
          <div className="flex items-center justify-between border-b border-fw-border px-4 py-3">
            <p className="font-display text-sm font-semibold uppercase tracking-wide">{t("notif.title")}</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-semibold text-fw-accent hover:underline">
                {t("notif.markAllRead")}
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                title={t("notif.emptyTitle")}
                message={t("notif.emptyMessage")}
                className="border-0"
              />
            ) : (
              notifications.slice(0, 20).map((n) => {
                const Icon = ICONS[n.type] ?? Bell;
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-fw-border/60 px-4 py-3 text-start transition-colors hover:bg-fw-surface-hover",
                      !n.read && "bg-fw-accent/5"
                    )}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-fw-accent" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-fw-text">{n.title}</p>
                      <p className="line-clamp-2 text-xs text-fw-text-dim">{n.message}</p>
                    </div>
                    {!n.read && <span className="ms-auto mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fw-accent" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
