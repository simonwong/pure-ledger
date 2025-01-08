// No longer used

import Database from '@tauri-apps/plugin-sql';

const db = await Database.load('sqlite:test.db');

import { BaseDBData, CreateDBData, UpdateDBData } from '@/infrastructure/dbType';

enum BillType {
  /** 支出 */
  EXPEND = 1,
  /** 收入 */
  INCOME = 2,
}

interface BillTDO extends BaseDBData {
  ledger_id: number;
  parent_bill_id?: number;
  name: string;
  type: BillType;
  amount: number;
  date: string;
  note?: string;
  file_path?: string;
  is_installment: 0 | 1;
}

type CreateBillInput = CreateDBData<BillTDO>;

type UpdateBillInput = UpdateDBData<BillTDO>;

type DeleteBillInput = BillTDO;

interface LedgerDTO extends BaseDBData {
  name: string;
  note?: string;
}

type CreateLedgerInput = CreateDBData<LedgerDTO>;

type UpdateLedgerInput = UpdateDBData<LedgerDTO>;

type DeleteLedgerInput = LedgerDTO['id'];

type TableName = 'ledgers' | 'bills';

type SelectResult = {
  ledgers: LedgerDTO;
  bills: BillTDO;
};

type InsertParams = {
  ledgers: CreateLedgerInput;
  bills: CreateBillInput;
};

type UpdateParams = {
  ledgers: UpdateLedgerInput;
  bills: UpdateBillInput;
};

export class ORM {
  static async selectAll<T extends TableName>(tableName: T, where?: Partial<SelectResult[T]>) {
    const bindValues: unknown[] = [];
    let whereText = '';
    let replaceCount = 0;

    if (where) {
      const whereKeys = Object.keys(where) as Array<keyof SelectResult[T]>;
      const whereTexts: string[] = [];

      whereKeys.forEach((key) => {
        whereTexts.push(`${String(key)} = $${++replaceCount}`);
        bindValues.push(where[key]);
      });
      if (whereTexts.length) {
        whereText = ` WHERE ${whereTexts.join(', ')}`;
      }
    }

    const res = await db.select<Array<SelectResult[T]>>(
      `SELECT * FROM ${tableName}${whereText}`,
      bindValues
    );
    return res;
  }

  static async selectById<T extends TableName>(tableName: T, id: unknown) {
    const res = await db.select<Array<SelectResult[T]>>(
      `SELECT * FROM ${tableName} WHERE id = $1`,
      [id]
    );
    if (res.length > 0) {
      return res[0];
    }
    return null;
  }

  static async insert<T extends TableName>(tableName: T, data: InsertParams[T]) {
    const keys = Object.keys(data) as Array<keyof InsertParams[T]>;

    if (keys.length === 0) {
      return null;
    }

    const queryCols = keys.join(', ');
    const queryValReplaces = keys.map((_, idx) => `$${idx + 1}`).join(', ');

    const res = await db.execute(
      `INSERT INTO ${tableName} (${queryCols}) VALUES (${queryValReplaces})`,
      keys.map((key) => data[key])
    );
    return res.lastInsertId;
  }

  static async updateById<T extends TableName>(tableName: T, data: UpdateParams[T], id: unknown) {
    if (Object.keys(data).length === 0) {
      return;
    }

    delete data.updated_at;

    const keys = Object.keys(data) as Array<keyof UpdateParams[T]>;
    let replaceCount = 0;
    const queryValReplaces = keys.map((key) => `${String(key)} = $${++replaceCount}`).join(', ');

    await db.execute(
      `UPDATE ${tableName} SET ${queryValReplaces}, updated_at = datetime('now', 'localtime') WHERE id = $${++replaceCount}`,
      [...keys.map((key) => data[key]), id]
    );
  }

  static async deleteById<T extends TableName>(tableName: T, id: unknown) {
    await db.execute(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
  }
}
