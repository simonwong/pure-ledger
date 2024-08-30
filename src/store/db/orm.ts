import { db } from "./database";
import {
  Bill,
  CreateBill,
  CreateLedger,
  Ledger,
  UpdateBill,
  UpdateLedger,
} from "@/types";

type TableName = "ledgers" | "bills";

type SelectResult = {
  ledgers: Ledger;
  bills: Bill;
};

type InsertParams = {
  ledgers: CreateLedger;
  bills: CreateBill;
};

type UpdateParams = {
  ledgers: UpdateLedger;
  bills: UpdateBill;
};

export class ORM {
  static async selectAll<T extends TableName>(
    tableName: T,
    where?: Partial<SelectResult[T]>
  ) {
    const bindValues: unknown[] = [];
    let whereText = "";
    let replaceCount = 0;

    if (where) {
      const whereKeys = Object.keys(where) as Array<keyof SelectResult[T]>;
      const whereTexts: string[] = [];

      whereKeys.forEach((key) => {
        whereTexts.push(`${String(key)} = $${++replaceCount}`);
        bindValues.push(where[key]);
      });
      if (whereTexts.length) {
        whereText = ` WHERE ${whereTexts.join(", ")}`;
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

  static async insert<T extends TableName>(
    tableName: T,
    data: InsertParams[T]
  ) {
    const keys = Object.keys(data) as Array<keyof InsertParams[T]>;

    if (keys.length === 0) {
      return;
    }

    const queryCols = keys.join(", ");
    const queryValReplaces = keys.map((_, idx) => `$${idx + 1}`).join(", ");

    console.log(
      "`INSERT INTO ${tableName} (${queryCols}) VALUES (${queryValReplaces})`",
      `INSERT INTO ${tableName} (${queryCols}) VALUES (${queryValReplaces})`
    );
    await db.execute(
      `INSERT INTO ${tableName} (${queryCols}) VALUES (${queryValReplaces})`,
      keys.map((key) => data[key])
    );
  }

  static async updateById<T extends TableName>(
    tableName: T,
    data: UpdateParams[T],
    id: unknown
  ) {
    if (Object.keys(data).length === 0) {
      return;
    }

    delete data.updated_at;

    const keys = Object.keys(data) as Array<keyof UpdateParams[T]>;
    let replaceCount = 0;
    const queryValReplaces = keys
      .map((key) => `${String(key)} = $${++replaceCount}`)
      .join(", ");

    await db.execute(
      `UPDATE ${tableName} SET ${queryValReplaces}, updated_at = datetime('now', 'localtime') WHERE id = $${++replaceCount}`,
      [...keys.map((key) => data[key]), id]
    );
  }

  static async deleteById<T extends TableName>(tableName: T, id: unknown) {
    await db.execute(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
  }
}
