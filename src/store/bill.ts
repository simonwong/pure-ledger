import { storage, StorageKey } from "@/lib/storageToResource";
import { Bill, BillData, CreateBill } from "@/types";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist, createJSONStorage } from "zustand/middleware";
import { useLedgerStore } from "./ledger";

interface BillState {
  billData: BillData;
  addBill: (bill: CreateBill) => void;
  updateBill: (bill: Bill) => void;
  removeBill: (bill: Bill) => void;
}

const getBillList = (billData: BillData, ledgerId: string | null) => {
  return ledgerId ? billData[ledgerId] || null : null;
};

export const useBillStore = create<BillState>()(
  persist(
    (set, get) => ({
      billData: {},
      addBill: (bill: CreateBill) => {
        const ledgerId = useLedgerStore.getState().currentSelectId;
        if (ledgerId) {
          const billList = getBillList(get().billData, ledgerId) || [];
          set({
            billData: {
              ...get().billData,
              [ledgerId]: [
                ...billList,
                {
                  ...bill,
                  id: uuidv4(),
                  createAt: new Date().toLocaleString(),
                },
              ],
            },
          });
        }
      },
      updateBill: (bill) => {
        const ledgerId = useLedgerStore.getState().currentSelectId;
        if (ledgerId) {
          const billList = (getBillList(get().billData, ledgerId) || []).map(
            (item) => {
              if (item.id === bill.id) {
                return {
                  ...bill,
                };
              }
              return {
                ...item,
              };
            }
          );
          set({
            billData: {
              ...get().billData,
              [ledgerId]: billList,
            },
          });
        }
      },
      removeBill: (bill) => {
        const ledgerId = useLedgerStore.getState().currentSelectId;
        if (ledgerId) {
          const billList = (getBillList(get().billData, ledgerId) || []).filter(
            (item) => item.id !== bill.id
          );
          set({
            billData: {
              ...get().billData,
              [ledgerId]: billList,
            },
          });
        }
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
  const billData = useBillStore((state) => state.billData);

  return getBillList(billData, currentSelectId);
};
