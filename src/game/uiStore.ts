"use client";

import { create } from "zustand";

interface UiState {
  selectedPlayerId: string | null;
  offerPlayerId: string | null;
  reportPlayerId: string | null;
  resetConfirmOpen: boolean;
  openPlayer: (id: string) => void;
  closePlayer: () => void;
  openOffer: (id: string) => void;
  closeOffer: () => void;
  openReport: (id: string) => void;
  closeReport: () => void;
  setResetConfirmOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedPlayerId: null,
  offerPlayerId: null,
  reportPlayerId: null,
  resetConfirmOpen: false,
  openPlayer: (id) => set({ selectedPlayerId: id }),
  closePlayer: () => set({ selectedPlayerId: null }),
  openOffer: (id) => set({ offerPlayerId: id }),
  closeOffer: () => set({ offerPlayerId: null }),
  openReport: (id) => set({ reportPlayerId: id }),
  closeReport: () => set({ reportPlayerId: null }),
  setResetConfirmOpen: (open) => set({ resetConfirmOpen: open }),
}));
