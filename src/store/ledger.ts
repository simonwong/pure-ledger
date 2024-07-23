import { storage, StorageKey } from "@/lib/storageToResource";
import { CreateLedger, Ledger } from "@/types";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist, createJSONStorage } from "zustand/middleware";
import { useMemo } from "react";

interface LedgerState {
  currentSelectId: string | null;
  ledgerList: Ledger[];
  switchSelect: (id: string) => void;
  addLedger: (ledger: CreateLedger) => void;
  updateLedger: (ledger: Ledger) => void;
  removeLedger: (ledger: Ledger) => void;
}

export const useLedgerStore = create<LedgerState>()(
  persist(
    (set, get) => ({
      currentSelectId: null,
      ledgerList: [],
      addLedger: (ledger) => {
        const newId = uuidv4();
        set({
          ledgerList: [
            ...get().ledgerList,
            {
              ...ledger,
              id: newId,
              createAt: new Date().toLocaleDateString(),
            },
          ],
          currentSelectId: newId,
        });
      },
      switchSelect: (id: string) => {
        set({
          currentSelectId: id,
        });
      },
      updateLedger: (ledger) => {
        const newList = get().ledgerList.map((item) => {
          if (item.id === ledger.id) {
            return {
              ...ledger,
            };
          }
          return {
            ...item,
          };
        });
        set({
          ledgerList: newList,
        });
      },
      removeLedger: (ledger) =>
        set({
          ledgerList: [...get().ledgerList].filter(
            (item) => item.id !== ledger.id
          ),
          currentSelectId: null,
        }),
    }),
    {
      name: StorageKey.Ledger,
      storage: createJSONStorage(() => storage),
    }
  )
);

export const useCurrentLedger = () => {
  const ledgerList = useLedgerStore((state) => state.ledgerList);
  const currentSelectId = useLedgerStore((state) => state.currentSelectId);

  const currentLedger = useMemo(() => {
    if (currentSelectId) {
      return ledgerList.find((item) => item.id === currentSelectId) || null;
    }
    return null;
  }, [ledgerList, currentSelectId]);

  return currentLedger;
};
