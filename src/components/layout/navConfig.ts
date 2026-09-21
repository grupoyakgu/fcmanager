import { Home, ShieldHalf, Users, ArrowLeftRight, Binoculars, Trophy, Newspaper, Goal } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", labelKey: "nav.home", icon: Home },
  { href: "/my-club", labelKey: "nav.myClub", icon: ShieldHalf },
  { href: "/squad", labelKey: "nav.squad", icon: Users },
  { href: "/transfers", labelKey: "nav.transfers", icon: ArrowLeftRight },
  { href: "/scouting", labelKey: "nav.scouting", icon: Binoculars },
  { href: "/match", labelKey: "nav.match", icon: Goal },
  { href: "/league", labelKey: "nav.league", icon: Trophy },
  { href: "/news", labelKey: "nav.news", icon: Newspaper },
] as const;

export const MOBILE_NAV_ITEMS = [
  NAV_ITEMS[0],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  NAV_ITEMS[5],
  NAV_ITEMS[6],
] as const;
