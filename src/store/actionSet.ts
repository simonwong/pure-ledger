import { Bill, CreateBill, Ledger } from "@/types";
import { useBillStore } from "./bill";
import { useLedgerStore } from "./ledger";
import {
  removeStorageFileBatch,
  removeStorageFoldByLedgerId,
} from "@/lib/storageFile";

export const useAddBill = () => {
  const currentSelectId = useLedgerStore((state) => state.currentSelectId);
  const addBill = useBillStore((state) => state.addBill);

  return (bill: CreateBill) => {
    if (currentSelectId) {
      addBill(currentSelectId, bill);
    }
  };
};

export const useUpdateBill = () => {
  const currentSelectId = useLedgerStore((state) => state.currentSelectId);
  const updateBill = useBillStore((state) => state.updateBill);

  return (bill: Bill) => {
    if (currentSelectId) {
      updateBill(currentSelectId, bill);
    }
  };
};

/**
 * 删除账单
 * 1. 删除账单
 * 2. 删除账单关联的文件
 */
export const useRemoveBill = () => {
  const currentSelectId = useLedgerStore((state) => state.currentSelectId);
  const removeBill = useBillStore((state) => state.removeBill);

  return (bill: Bill) => {
    if (currentSelectId) {
      // 删除账单需要连同文件一起删掉
      bill.remarkFiles && removeStorageFileBatch(bill.remarkFiles);
      removeBill(currentSelectId, bill);
    }
  };
};

/**
 * 删除账簿
 * 1. 删除账簿
 * 2. 删除账簿下的账单
 * 3. 删除账单关联的文件
 */
export const useRemoveLedger = () => {
  const removeLedger = useLedgerStore((state) => state.removeLedger);
  const removeBillsOnLedger = useBillStore(
    (state) => state.removeBillsOnLedger
  );

  return (ledger: Ledger) => {
    removeLedger(ledger);
    removeBillsOnLedger(ledger.id);
    removeStorageFoldByLedgerId(ledger.id);
  };
};
