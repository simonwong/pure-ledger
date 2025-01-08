import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  real,
  check,
  AnySQLiteColumn,
  index,
} from 'drizzle-orm/sqlite-core';

export const ledgers = sqliteTable('ledgers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  note: text('note'),
  createdAt: text('created_at').default(sql`datetime('now', 'localtime')`),
  updatedAt: text('updated_at').default(sql`datetime('now', 'localtime')`),
});

export const bills = sqliteTable(
  'bills',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ledgerId: integer('ledger_id').references(() => ledgers.id, { onDelete: 'cascade' }),
    parentBillId: integer('parent_bill_id').references((): AnySQLiteColumn => bills.id, {
      onDelete: 'cascade',
    }),
    name: text('name').notNull(),
    type: integer('bill_type', { mode: 'number' }).notNull(),
    isInstallment: integer('is_installment', { mode: 'number' }).default(0),
    amount: real('amount').notNull(),
    date: text('date').notNull(),
    note: text('note'),
    filePath: text('file_path'),
    createdAt: text('created_at').default(sql`datetime('now', 'localtime')`),
    updatedAt: text('updated_at').default(sql`datetime('now', 'localtime')`),
  },
  (table) => ({
    billTypeCheck: check('billTypeCheck', sql`${table.type} IN (1, 2)`),
    isInstallmentCheck: check('isInstallmentCheck', sql`${table.isInstallment} IN (0, 1)`),
    idxBillsLedgerId: index('idx_bills_ledger_id').on(table.ledgerId),
  })
);
