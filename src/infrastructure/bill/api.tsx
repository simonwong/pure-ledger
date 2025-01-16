import { removeStorageFileBatch } from '@/lib/storageFile';
import { createBillToInput, dtoListToBills, dtoToBill, updateBillToInput } from './transform';
import { Bill, CreateBill, UpdateBill } from '@/domain/bill';
import { db } from '@/db';
import { bills } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const getBills = async (ledgerId: number) => {
  const billList = await db
    .select()
    .from(bills)
    .where(eq(bills.ledgerId, ledgerId))
    .orderBy(desc(bills.date), desc(bills.createdAt));

  // date > createdAt
  return dtoListToBills(billList);
};

export const getBill = async (billId: number) => {
  const bill = await db.select().from(bills).where(eq(bills.id, billId)).get();

  return bill ? dtoToBill(bill) : null;
};

export const createBill = async (data: CreateBill) => {
  const res = (await db.insert(bills).values(createBillToInput(data))) as {
    lastInsertId: number;
  };
  // TODO: 处理 lastInsertId 类型
  return res.lastInsertId;
};

export const updateBill = async (data: UpdateBill) => {
  await db.update(bills).set(updateBillToInput(data)).where(eq(bills.id, data.id));
};

export const deleteBill = async (bill: Bill) => {
  await db.delete(bills).where(eq(bills.id, bill.id));
  bill.filePaths && (await removeStorageFileBatch(bill.filePaths));
};
