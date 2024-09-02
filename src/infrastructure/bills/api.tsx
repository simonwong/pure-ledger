import { CreateBillInput, DeleteBillInput, UpdateBillInput } from "./type";

import { ORM } from "@/infrastructure/orm";

export const getBills = async (ledgerId: number) => {
  const res = await ORM.selectAll("bills", {
    ledger_id: ledgerId,
  });

  return res;
};

export const getBill = async (billId: number) => {
  const res = await ORM.selectById("bills", billId);
  return res;
};

export const createBill = async (data: CreateBillInput) => {
  await ORM.insert("bills", data);
};

export const updateBill = async (data: UpdateBillInput) => {
  await ORM.updateById("bills", data, data.id);
};

export const deleteBill = async (bill: DeleteBillInput) => {
  await ORM.deleteById("bills", bill.id);
  // TODO: 删除文件
  // bill.remarkFiles && removeStorageFileBatch(bill.remarkFiles);
};
