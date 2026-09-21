"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AppNotification,
  Club,
  FORMATIONS,
  FormationName,
  LeagueTableRow,
  MatchResult,
  MarketMovement,
  NewsItem,
  NotificationType,
  Player,
  SquadSlot,
  TransferOffer,
  TransferRecord,
  Fixture,
} from "@/types";
import { mulberry32, pick } from "@/lib/rng";
import { makeId } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatCurrency";
import { loadInitialWorld, buildEmptyTable, buildLeagueFixtures, USER_CLUB_ID } from "@/game/repositories/worldRepository";
import { simulateFixture } from "@/game/engines/matchEngine";
import { computeTable, getClubPosition } from "@/game/engines/leagueEngine";
import { evaluateOffer, estimateAiSaleOffer, OfferOutcome } from "@/game/engines/transferEngine";
import { rollMarketMovement } from "@/lib/getMarketMovement";
import { newsFromMatch, newsFromMarketMovement, newsFromTransfer, newsFromLeagueMovement, newsFromWonderkid } from "@/lib/getNewsFromEvent";
import { calculateWeeklyWages } from "@/lib/calculateTeamRating";

export interface ClubCreationInput {
  name: string;
  shortName: string;
  nickname: string;
  country: string;
  badgeId: string;
  kitId: string;
  primaryColor: string;
  secondaryColor: string;
}

interface GameState {
  hydrated: boolean;
  onboarded: boolean;
  leagueName: string;

  club: Club | null;
  clubs: Club[];
  players: Player[];
  fixtures: Fixture[];
  results: MatchResult[];
  table: LeagueTableRow[];
  news: NewsItem[];
  notifications: AppNotification[];
  offers: TransferOffer[];
  transferHistory: TransferRecord[];
  marketMovements: MarketMovement[];
  scoutReports: { playerId: string; week: number }[];
  currentWeek: number;
  formation: FormationName;
  lineup: SquadSlot[];
  bench: string[];
  captainId: string | null;
  lastResult: MatchResult | null;

  setHydrated: () => void;
  createClub: (input: ClubCreationInput) => void;
  scoutPlayer: (playerId: string) => void;
  makeOffer: (playerId: string, offerAmount: number) => { outcome: OfferOutcome; askingPrice: number; counterOffer?: number; offerId: string };
  acceptCounterOffer: (offerId: string) => boolean;
  completeTransferInternal: (player: Player, fee: number) => void;
  sellPlayer: (playerId: string) => number;
  setFormation: (formation: FormationName) => void;
  setLineupSlot: (slotIndex: number, playerId: string | null) => void;
  autoFillLineup: () => void;
  setCaptain: (playerId: string) => void;
  setBench: (ids: string[]) => void;
  getNextUserFixture: () => Fixture | null;
  simulateNextUserMatch: () => MatchResult | null;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemo: () => void;
}

const STORAGE_KEY = "football-world-save-v1";

function addNotification(
  notifications: AppNotification[],
  type: NotificationType,
  title: string,
  message: string,
  week: number,
  relatedPlayerId?: string
): AppNotification[] {
  return [
    { id: makeId("notif"), type, title, message, week, read: false, relatedPlayerId },
    ...notifications,
  ].slice(0, 60);
}

function freshWorldState() {
  return {
    hydrated: true,
    onboarded: false,
    leagueName: "Premier League",
    club: null,
    clubs: [],
    players: [],
    fixtures: [],
    results: [],
    table: [],
    news: [],
    notifications: [],
    offers: [],
    transferHistory: [],
    marketMovements: [],
    scoutReports: [],
    currentWeek: 1,
    formation: "4-3-3" as FormationName,
    lineup: [],
    bench: [],
    captainId: null,
    lastResult: null,
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...freshWorldState(),
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      createClub: (input) => {
        // The whole league (AI clubs, players, news) is generated fresh here,
        // themed to the country chosen during onboarding.
        const { aiClubs, players, news, transferBuzz, leagueName } = loadInitialWorld(input.country);

        const userClub: Club = {
          id: USER_CLUB_ID,
          name: input.name,
          shortName: input.shortName || input.name.slice(0, 3).toUpperCase(),
          nickname: input.nickname || "The Club",
          country: input.country,
          city: input.name,
          stadium: `${input.shortName || input.name} Arena`,
          primaryColor: input.primaryColor,
          secondaryColor: input.secondaryColor,
          badgeId: input.badgeId,
          kitId: input.kitId,
          reputation: 65,
          budget: 8_400_000,
          weeklyWages: 0,
          identity: "USER",
          isUserClub: true,
        };

        const allClubs = [...aiClubs, userClub];
        const fixtures = buildLeagueFixtures(allClubs);
        const table = buildEmptyTable(allClubs);
        const userPlayers = players.filter((p) => p.clubId === USER_CLUB_ID);
        userClub.weeklyWages = calculateWeeklyWages(userPlayers);

        const notifications = addNotification(
          [],
          "CLUB_NEWS",
          `Welcome to the ${leagueName}`,
          `${userClub.name} are ready for Matchday 1. Your squad, transfer targets and first fixture are waiting.`,
          1
        );

        set({
          club: userClub,
          clubs: allClubs,
          players,
          news,
          transferHistory: transferBuzz,
          leagueName,
          fixtures,
          table,
          onboarded: true,
          currentWeek: 1,
          notifications,
        });

        get().autoFillLineup();
      },

      scoutPlayer: (playerId) => {
        const state = get();
        const player = state.players.find((p) => p.id === playerId);
        if (!player || player.scouted) return;
        set({
          players: state.players.map((p) => (p.id === playerId ? { ...p, scouted: true } : p)),
          scoutReports: [{ playerId, week: state.currentWeek }, ...state.scoutReports],
          notifications: addNotification(
            state.notifications,
            "SCOUT_REPORT_READY",
            "Scout report ready",
            `Your scouts have finished their assessment of ${player.firstName} ${player.lastName}.`,
            state.currentWeek,
            playerId
          ),
        });
      },

      makeOffer: (playerId, offerAmount) => {
        const state = get();
        const player = state.players.find((p) => p.id === playerId);
        const club = state.club;
        const offerId = makeId("offer");
        if (!player || !club) {
          return { outcome: "REJECTED" as OfferOutcome, askingPrice: 0, offerId };
        }
        const rng = mulberry32(Date.now() % 2147483647);
        const decision = evaluateOffer(player, offerAmount, rng);

        const offer: TransferOffer = {
          id: offerId,
          playerId,
          playerName: `${player.firstName} ${player.lastName}`,
          fromClubId: club.id,
          toClubId: player.clubId,
          askingPrice: decision.askingPrice,
          offerAmount,
          status:
            decision.outcome === "ACCEPTED" ? "ACCEPTED" : decision.outcome === "CLUB_WANTS_MORE" ? "NEGOTIATING" : "REJECTED",
          week: state.currentWeek,
          counterOffer: decision.counterOffer,
        };

        if (decision.outcome === "ACCEPTED") {
          get().completeTransferInternal(player, offerAmount);
        }

        set((s) => ({ offers: [offer, ...s.offers].slice(0, 40) }));
        return { outcome: decision.outcome, askingPrice: decision.askingPrice, counterOffer: decision.counterOffer, offerId };
      },

      acceptCounterOffer: (offerId) => {
        const state = get();
        const offer = state.offers.find((o) => o.id === offerId);
        const player = offer ? state.players.find((p) => p.id === offer.playerId) : undefined;
        if (!offer || !player || !offer.counterOffer || !state.club) return false;
        if (state.club.budget < offer.counterOffer) return false;

        get().completeTransferInternal(player, offer.counterOffer);
        set((s) => ({
          offers: s.offers.map((o) => (o.id === offerId ? { ...o, status: "ACCEPTED" } : o)),
        }));
        return true;
      },

      completeTransferInternal: (player, fee) => {
        const s = get();
        if (!s.club) return;
        const updatedClub = { ...s.club, budget: s.club.budget - fee };
        const updatedPlayers = s.players.map((p) =>
          p.id === player.id ? { ...p, clubId: USER_CLUB_ID, previousMarketValue: p.marketValue } : p
        );
        const record: TransferRecord = {
          id: makeId("transfer"),
          playerId: player.id,
          playerName: `${player.firstName} ${player.lastName}`,
          fromClubId: player.clubId,
          toClubId: USER_CLUB_ID,
          fee,
          week: s.currentWeek,
        };
        const alreadyPlaced = s.lineup.some((slot) => slot.playerId === player.id) || s.bench.includes(player.id);
        set({
          club: updatedClub,
          clubs: s.clubs.map((c) => (c.id === USER_CLUB_ID ? updatedClub : c)),
          players: updatedPlayers,
          bench: alreadyPlaced ? s.bench : [...s.bench, player.id],
          transferHistory: [record, ...s.transferHistory],
          news: [newsFromTransfer(record, s.clubs, s.currentWeek), ...s.news],
          notifications: addNotification(
            s.notifications,
            "TRANSFER_COMPLETED",
            "Transfer completed",
            `${player.firstName} ${player.lastName} has signed for ${formatCurrency(fee)}.`,
            s.currentWeek,
            player.id
          ),
        });
      },

      sellPlayer: (playerId) => {
        const state = get();
        const player = state.players.find((p) => p.id === playerId);
        if (!player || !state.club || player.clubId !== USER_CLUB_ID) return 0;
        const rng = mulberry32(Date.now() % 2147483647);
        const fee = estimateAiSaleOffer(player, rng);
        const buyer = pick(
          rng,
          state.clubs.filter((c) => c.id !== USER_CLUB_ID)
        );

        const record: TransferRecord = {
          id: makeId("transfer"),
          playerId: player.id,
          playerName: `${player.firstName} ${player.lastName}`,
          fromClubId: USER_CLUB_ID,
          toClubId: buyer.id,
          fee,
          week: state.currentWeek,
        };

        const updatedClub = { ...state.club, budget: state.club.budget + fee };
        const updatedPlayers = state.players.map((p) => (p.id === playerId ? { ...p, clubId: buyer.id } : p));

        set({
          club: updatedClub,
          clubs: state.clubs.map((c) => (c.id === USER_CLUB_ID ? updatedClub : c)),
          players: updatedPlayers,
          transferHistory: [record, ...state.transferHistory],
          lineup: state.lineup.map((s) => (s.playerId === playerId ? { ...s, playerId: null } : s)),
          bench: state.bench.filter((id) => id !== playerId),
          news: [newsFromTransfer(record, state.clubs, state.currentWeek), ...state.news],
          notifications: addNotification(
            state.notifications,
            "TRANSFER_COMPLETED",
            "Transfer completed",
            `${player.firstName} ${player.lastName} was sold for ${formatCurrency(fee)}.`,
            state.currentWeek,
            playerId
          ),
        });
        return fee;
      },

      setFormation: (formation) => {
        set({ formation });
        get().autoFillLineup();
      },

      setLineupSlot: (slotIndex, playerId) => {
        const state = get();
        const lineup = state.lineup.map((s) => {
          if (s.slotIndex === slotIndex) return { ...s, playerId };
          if (playerId && s.playerId === playerId) return { ...s, playerId: null };
          return s;
        });
        set({
          lineup,
          bench: playerId ? state.bench.filter((id) => id !== playerId) : state.bench,
        });
      },

      autoFillLineup: () => {
        const state = get();
        if (!state.club) return;
        const squad = state.players.filter((p) => p.clubId === USER_CLUB_ID);
        const positions = FORMATIONS[state.formation];
        const used = new Set<string>();
        const lineup: SquadSlot[] = positions.map((pos, idx) => {
          const candidate = squad
            .filter((p) => p.position === pos && !used.has(p.id))
            .sort((a, b) => b.overallRating - a.overallRating)[0];
          if (candidate) used.add(candidate.id);
          return { slotIndex: idx, position: pos, playerId: candidate?.id ?? null };
        });
        const bench = squad.filter((p) => !used.has(p.id)).map((p) => p.id).slice(0, 7);
        const captain = squad.filter((p) => used.has(p.id)).sort((a, b) => b.overallRating - a.overallRating)[0];
        set({ lineup, bench, captainId: captain?.id ?? null });
      },

      setCaptain: (playerId) => set({ captainId: playerId }),
      setBench: (ids) => set({ bench: ids }),

      getNextUserFixture: () => {
        const state = get();
        if (!state.club) return null;
        return (
          state.fixtures
            .filter((f) => !f.played && (f.homeClubId === state.club!.id || f.awayClubId === state.club!.id))
            .sort((a, b) => a.matchday - b.matchday)[0] ?? null
        );
      },

      simulateNextUserMatch: () => {
        const state = get();
        if (!state.club) return null;
        const nextUserFixture = get().getNextUserFixture();
        if (!nextUserFixture) return null;

        const matchdaysToProcess = Array.from(
          new Set(
            state.fixtures
              .filter((f) => !f.played && f.matchday <= nextUserFixture.matchday)
              .map((f) => f.matchday)
          )
        ).sort((a, b) => a - b);

        const rng = mulberry32((Date.now() % 2147483647) ^ nextUserFixture.matchday);
        let players = [...state.players];
        let fixtures = [...state.fixtures];
        const newResults: MatchResult[] = [];
        let featuredResult: MatchResult | null = null;

        matchdaysToProcess.forEach((matchday) => {
          const dayFixtures = fixtures.filter((f) => f.matchday === matchday && !f.played);
          dayFixtures.forEach((fixture) => {
            const homeClub = state.clubs.find((c) => c.id === fixture.homeClubId)!;
            const awayClub = state.clubs.find((c) => c.id === fixture.awayClubId)!;

            const homePlayers =
              fixture.homeClubId === USER_CLUB_ID
                ? (state.lineup.map((s) => players.find((p) => p.id === s.playerId)).filter(Boolean) as Player[])
                : players.filter((p) => p.clubId === fixture.homeClubId).sort((a, b) => b.overallRating - a.overallRating).slice(0, 11);
            const awayPlayers =
              fixture.awayClubId === USER_CLUB_ID
                ? (state.lineup.map((s) => players.find((p) => p.id === s.playerId)).filter(Boolean) as Player[])
                : players.filter((p) => p.clubId === fixture.awayClubId).sort((a, b) => b.overallRating - a.overallRating).slice(0, 11);

            if (homePlayers.length < 7 || awayPlayers.length < 7) return;

            const result = simulateFixture({
              fixtureId: fixture.id,
              matchday,
              homeClub,
              awayClub,
              homePlayers,
              awayPlayers,
              week: state.currentWeek,
              rng,
            });
            newResults.push(result);
            fixtures = fixtures.map((f) => (f.id === fixture.id ? { ...f, played: true } : f));
            if (fixture.id === nextUserFixture.id) featuredResult = result;

            result.goals.forEach((g) => {
              players = players.map((p) => (p.id === g.playerId ? { ...p, goals: p.goals + 1 } : p));
            });
          });
        });

        const allResults = [...state.results, ...newResults];
        const table = computeTable(state.clubs, allResults, state.table);

        let news = [...state.news];
        let notifications = [...state.notifications];

        const sampledPlayers = [...players].sort(() => rng() - 0.5).slice(0, 24);
        const movementsThisWeek: MarketMovement[] = [];
        sampledPlayers.forEach((p) => {
          const movement = rollMarketMovement(p, state.currentWeek, rng);
          if (movement) movementsThisWeek.push(movement);
        });
        movementsThisWeek.forEach((m) => {
          players = players.map((p) =>
            p.id === m.playerId ? { ...p, previousMarketValue: p.marketValue, marketValue: m.newValue } : p
          );
        });
        const marketMovements = [...movementsThisWeek, ...state.marketMovements].slice(0, 80);
        movementsThisWeek
          .filter((m) => Math.abs(m.changePercent) >= 8)
          .slice(0, 3)
          .forEach((m) => {
            news = [newsFromMarketMovement(m, state.currentWeek), ...news];
          });
        movementsThisWeek
          .filter((m) => players.find((p) => p.id === m.playerId)?.clubId === USER_CLUB_ID)
          .forEach((m) => {
            notifications = addNotification(
              notifications,
              m.changePercent >= 0 ? "VALUE_UP" : "VALUE_DOWN",
              m.changePercent >= 0 ? "Player value increased" : "Player value decreased",
              `${m.playerName} is now valued at ${formatCurrency(m.newValue)}.`,
              state.currentWeek,
              m.playerId
            );
          });

        if (featuredResult) {
          const fr: MatchResult = featuredResult;
          news = [newsFromMatch(fr, state.clubs, state.currentWeek, USER_CLUB_ID), ...news];
          const userWon =
            (fr.homeClubId === USER_CLUB_ID && fr.homeGoals > fr.awayGoals) ||
            (fr.awayClubId === USER_CLUB_ID && fr.awayGoals > fr.homeGoals);
          const userLost =
            (fr.homeClubId === USER_CLUB_ID && fr.homeGoals < fr.awayGoals) ||
            (fr.awayClubId === USER_CLUB_ID && fr.awayGoals < fr.homeGoals);
          notifications = addNotification(
            notifications,
            "CLUB_NEWS",
            userWon ? "Full time: Victory" : userLost ? "Full time: Defeat" : "Full time: Draw",
            `${fr.homeGoals} - ${fr.awayGoals} at full time.`,
            state.currentWeek
          );
        }
        newResults
          .filter((r) => r.id !== featuredResult?.id)
          .slice(0, 2)
          .forEach((r) => {
            news = [newsFromMatch(r, state.clubs, state.currentWeek, USER_CLUB_ID), ...news];
          });

        if (rng() < 0.4) {
          const wonderkid = players.find((p) => p.age <= 19 && p.potential >= 84 && p.clubId !== USER_CLUB_ID);
          if (wonderkid) news = [newsFromWonderkid(wonderkid, state.currentWeek), ...news];
        }

        const newPosition = getClubPosition(table, USER_CLUB_ID);
        const oldPosition = getClubPosition(state.table, USER_CLUB_ID);
        if (state.table.some((r) => r.played > 0) && newPosition !== oldPosition) {
          const userClub = state.clubs.find((c) => c.id === USER_CLUB_ID)!;
          news = [
            newsFromLeagueMovement(userClub, newPosition, newPosition < oldPosition ? "up" : "down", state.currentWeek, state.leagueName),
            ...news,
          ];
        }

        const nextWeek = nextUserFixture.matchday + 1;
        notifications = addNotification(
          notifications,
          "MATCHDAY_STARTING",
          `Matchday ${nextWeek} approaches`,
          "Check your squad and prepare for the next fixture.",
          nextWeek
        );

        const updatedClub = state.club
          ? { ...state.club, weeklyWages: calculateWeeklyWages(players.filter((p) => p.clubId === USER_CLUB_ID)) }
          : state.club;

        set({
          players,
          fixtures,
          results: allResults,
          table,
          marketMovements,
          news: news.slice(0, 120),
          notifications,
          currentWeek: nextWeek,
          lastResult: featuredResult,
          club: updatedClub,
          clubs: updatedClub ? state.clubs.map((c) => (c.id === USER_CLUB_ID ? updatedClub : c)) : state.clubs,
        });

        return featuredResult;
      },

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),

      resetDemo: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        set(freshWorldState());
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
