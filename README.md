# FOOTBALL WORLD — Stage 1: UI-First Prototype

A premium football-management game prototype. This stage focuses entirely on
UI/UX and a believable fictional football world — clubs, players, transfers,
scouting, matches, a league table and a news feed — all powered by local mock
data and `localStorage`. There is no backend, authentication or real-time
simulation yet; that comes in a later stage.

All clubs, players, badges and competitions are fictional. No real-world
football data, names, crests or copyrighted assets are used.

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Zustand (with `localStorage` persistence)
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On first launch you'll
go through a short onboarding flow to create your club, then land on the
Home dashboard.

## Project structure

```text
src/
  app/              route pages (Home, My Club, Squad, Transfers, Scouting,
                     Match, League, News, Onboarding)
  components/       reusable UI, organized by domain (player, club, transfer,
                     scouting, match, league, news, layout, onboarding, ui)
  data/             fictional seed data generators (clubs, players, fixtures,
                     news, transfer buzz, name pools, badge templates)
  game/
    store.ts        the client-side game state (Zustand + persist)
    uiStore.ts       transient UI state (open modals, etc.)
    engines/         pure simulation logic (match, transfers, league table)
    repositories/    assembles seed data into the initial game world
  lib/              pure utility/formatting helpers
  types/            shared domain types
```

## Persistence

Your club, squad, transfers, results, league table, news and notifications
are saved to `localStorage` automatically. Use **Reset Demo** on the My Club
page to wipe your save and start over (with confirmation).

## Scope

See the product brief for the full Stage 1 spec. In short: this build is
UI-first — the football "engine" behind it is intentionally shallow
(deterministic mock logic), but every screen is fully clickable and stateful.
