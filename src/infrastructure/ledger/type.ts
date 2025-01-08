import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { ledgers } from '@/db/schema';

export type SelectLedgerOutput = InferSelectModel<typeof ledgers>;

export type InsertLedgerInput = InferInsertModel<typeof ledgers>;

export type UpdateLedgerInput = Partial<InsertLedgerInput>;

export type DeleteLedgerInput = Pick<InsertLedgerInput, 'id'>;
