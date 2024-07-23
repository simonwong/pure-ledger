import { storage, StorageKey } from "@/lib/storageToResource";
import { Bill, BillData } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useLedgerStore } from "./ledger";

interface BillState {
  billData: BillData;
  getBillList: (ledgerId: string | null) => Bill[] | null;
}

export const useBillStore = create<BillState>()(
  persist(
    (set, get) => ({
      billData: {},
      getBillList: (ledgerId) => {
        if (ledgerId) {
          const billData = get().billData;
          return billData[ledgerId] || null;
        }
        return null;
      },
    }),
    {
      name: StorageKey.Bill,
      storage: createJSONStorage(() => storage),
    }
  )
);

export const useBillList = () => {
  const currentSelectId = useLedgerStore((state) => state.currentSelectId);
  const getBillList = useBillStore((state) => state.getBillList);
  const billList = getBillList(currentSelectId);

  return billList;
};
