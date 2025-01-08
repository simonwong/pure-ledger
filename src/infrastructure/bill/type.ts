import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { bills } from '@/db/schema';

export type SelectBillOutput = InferSelectModel<typeof bills>;

export type InsertBillInput = InferInsertModel<typeof bills>;

export type UpdateBillInput = Partial<InsertBillInput>;

export type DeleteBillInput = Pick<InsertBillInput, 'id'>;
