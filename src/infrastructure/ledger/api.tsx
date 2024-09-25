import { ORM } from "@/infrastructure/orm";
import { removeStorageFoldByLedgerId } from "@/lib/storageFile";
import {
  createLedgerToInput,
  dtoListToLedgers,
  dtoToLedger,
  updateLedgerToInput,
} from "./transform";
import { CreateLedger, DeleteLedger, UpdateLedger } from "@/domain/ledger";

export const getLedgers = async () => {
  const res = await ORM.selectAll("ledgers");

  return dtoListToLedgers(res);
};

export const getLedger = async (ledgerId: number) => {
  const res = await ORM.selectById("ledgers", ledgerId);

  return res ? dtoToLedger(res) : null;
};

export const createLedger = async (data: CreateLedger) => {
  const id = await ORM.insert("ledgers", createLedgerToInput(data));
  return id;
};

export const updateLedger = async (data: UpdateLedger) => {
  await ORM.updateById("ledgers", updateLedgerToInput(data), data.id);
};

export const deleteLedger = async (id: DeleteLedger) => {
  await ORM.deleteById("ledgers", id);
  await removeStorageFoldByLedgerId(String(id));
};
