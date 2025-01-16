import { removeStorageFoldByLedgerId } from '@/lib/storageFile';
import {
  createLedgerToInput,
  dtoListToLedgers,
  dtoToLedger,
  updateLedgerToInput,
} from './transform';
import { CreateLedger, DeleteLedger, Ledger, UpdateLedger } from '@/domain/ledger';
import { db } from '@/db';
import { ledgers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getLedgers = async () => {
  const res = await db.select().from(ledgers);

  return dtoListToLedgers(res) as Ledger[];
};

export const getLedger = async (ledgerId: number) => {
  const res = await db.select().from(ledgers).where(eq(ledgers.id, ledgerId)).get();

  return res ? dtoToLedger(res) : undefined;
};

export const createLedger = async (data: CreateLedger) => {
  const res = (await db.insert(ledgers).values(createLedgerToInput(data))) as {
    lastInsertId: number;
  };

  // TODO: 处理 lastInsertId 类型
  return res.lastInsertId;
};

export const updateLedger = async (data: UpdateLedger) => {
  await db.update(ledgers).set(updateLedgerToInput(data)).where(eq(ledgers.id, data.id));
};

export const deleteLedger = async (id: DeleteLedger) => {
  await db.delete(ledgers).where(eq(ledgers.id, id));
  await removeStorageFoldByLedgerId(String(id));
};
