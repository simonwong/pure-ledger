import { storage, StorageKey } from "@/lib/storageToResource";
import { Bill, BillData, CreateBill } from "@/types";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist, createJSONStorage } from "zustand/middleware";
import { useLedgerStore } from "./ledger";
import dayjs from "dayjs";

interface BillState {
  billData: BillData;
  addBill: (ledgerId: string, bill: CreateBill) => void;
  updateBill: (ledgerId: string, bill: Bill) => void;
  removeBill: (ledgerId: string, bill: Bill) => void;
  removeBillsOnLedger: (ledgerId: string) => void;
}

const getBillList = (billData: BillData, ledgerId: string | null) => {
  return ledgerId ? billData[ledgerId] || null : null;
};

export const useBillStore = create<BillState>()(
  persist(
    (set, get) => ({
      billData: {},
      addBill: (ledgerId, bill) => {
        const billList = getBillList(get().billData, ledgerId) || [];
        set({
          billData: {
            ...get().billData,
            [ledgerId]: [
              ...billList,
              {
                ...bill,
                id: uuidv4(),
              },
            ],
          },
        });
      },
      updateBill: (ledgerId, bill) => {
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
      },
      removeBill: (ledgerId, bill) => {
        const billList = (getBillList(get().billData, ledgerId) || []).filter(
          (item) => item.id !== bill.id
        );

        set({
          billData: {
            ...get().billData,
            [ledgerId]: billList,
          },
        });
      },
      removeBillsOnLedger: (ledgerId) => {
        const billData = { ...get().billData };
        if (billData[ledgerId]) {
          delete billData[ledgerId];
          set({
            billData,
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

  return getBillList(billData, currentSelectId)?.sort((aBill, bBill) =>
    dayjs(aBill.createAt).isBefore(bBill.createAt) ? 1 : -1
  );
};
