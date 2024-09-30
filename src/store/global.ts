import { create } from "zustand";

interface LedgerState {
  currentLedgerId: number | null;
  switchSelect: (id: number | null) => void;
  initCurrentLedger: (id: number) => void;
}

export const useGlobalStore = create<LedgerState>()((set, get) => ({
  currentLedgerId: null,
  ledgerList: [],
  switchSelect: (id) => {
    set({
      currentLedgerId: id,
    });
  },
  initCurrentLedger: (id) => {
    const currentLedgerId = get().currentLedgerId;

    if (!currentLedgerId) {
      set({
        currentLedgerId: id,
      });
    }
  },
}));
