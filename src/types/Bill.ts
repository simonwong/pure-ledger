import { BaseDBData, CreateDBData, UpdateDBData } from "./db";

export enum BillType {
  /** 支出 */
  EXPEND = 1,
  /** 收入 */
  INCOME = 2,
}

export interface Bill extends BaseDBData {
  ledger_id?: number;
  parent_bill_id?: number;
  name: string;
  type: BillType;
  amount: number;
  date: string;
  note?: string;
  file_path?: string;
}

export type CreateBill = CreateDBData<Bill>;

export type UpdateBill = UpdateDBData<Bill>;

export type DeleteBill = Bill["id"];
