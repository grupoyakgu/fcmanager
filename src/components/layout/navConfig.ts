import { Home, ShieldHalf, Users, ArrowLeftRight, Binoculars, Trophy, Newspaper, Goal } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/my-club", label: "My Club", icon: ShieldHalf },
  { href: "/squad", label: "Squad", icon: Users },
  { href: "/transfers", label: "Transfers", icon: ArrowLeftRight },
  { href: "/scouting", label: "Scouting", icon: Binoculars },
  { href: "/match", label: "Match", icon: Goal },
  { href: "/league", label: "League", icon: Trophy },
  { href: "/news", label: "News", icon: Newspaper },
] as const;

export const MOBILE_NAV_ITEMS = [
  NAV_ITEMS[0],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  NAV_ITEMS[5],
  NAV_ITEMS[6],
] as const;
