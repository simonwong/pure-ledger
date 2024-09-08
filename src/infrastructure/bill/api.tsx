import { removeStorageFileBatch } from "@/lib/storageFile";
import { ORM } from "@/infrastructure/orm";
import {
  createBillToInput,
  dtoListToBills,
  dtoToBill,
  updateBillToInput,
} from "./transform";
import { Bill, CreateBill, UpdateBill } from "@/domain/bill";

export const getBills = async (ledgerId: number) => {
  const res = await ORM.selectAll("bills", {
    ledger_id: ledgerId,
  });

  return dtoListToBills(res);
};

export const getBill = async (billId: number) => {
  const res = await ORM.selectById("bills", billId);
  return res ? dtoToBill(res) : null;
};

export const createBill = async (data: CreateBill) => {
  await ORM.insert("bills", createBillToInput(data));
};

export const updateBill = async (data: UpdateBill) => {
  await ORM.updateById("bills", updateBillToInput(data), data.id);
};

export const deleteBill = async (bill: Bill) => {
  await ORM.deleteById("bills", bill.id);
  bill.filePaths && (await removeStorageFileBatch(bill.filePaths));
};