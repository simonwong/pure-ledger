import { create } from "zustand";

interface LedgerState {
  currentLedgerId: number | null;
  switchSelect: (id: number) => void;
}

export const useGlobalStore = create<LedgerState>()((set) => ({
  currentLedgerId: null,
  ledgerList: [],
  switchSelect: (id: number) => {
    set({
      currentLedgerId: id,
    });
  },
}));
