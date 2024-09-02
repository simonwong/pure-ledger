import { CreateLedger, DeleteLedger, UpdateLedger } from "@/types";

import { ORM } from "@/infrastructure/orm";
import { removeStorageFoldByLedgerId } from "@/lib/storageFile";

export const getLedgers = async () => {
  const res = await ORM.selectAll("ledgers");

  return res;
};

export const getLedger = async (ledgerId: number) => {
  const res = await ORM.selectById("ledgers", ledgerId);
  return res;
};

export const createLedger = async (data: CreateLedger) => {
  await ORM.insert("ledgers", data);
};

export const updateLedger = async (data: UpdateLedger) => {
  await ORM.updateById("ledgers", data, data.id);
};

export const deleteLedger = async (id: DeleteLedger) => {
  await ORM.deleteById("ledgers", id);
  await removeStorageFoldByLedgerId(String(id));
};
