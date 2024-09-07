import { create } from "zustand";

interface LedgerState {
  currentLedgerId: number | null;
  switchSelect: (id: number | null) => void;
}

export const useGlobalStore = create<LedgerState>()((set) => ({
  currentLedgerId: null,
  ledgerList: [],
  switchSelect: (id) => {
    set({
      currentLedgerId: id,
    });
  },
}));
