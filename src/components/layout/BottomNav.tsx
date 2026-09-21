"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ITEMS } from "@/components/layout/navConfig";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-fw-border bg-fw-bg-elevated/95 backdrop-blur lg:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide",
              active ? "text-fw-accent" : "text-fw-text-faint"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
