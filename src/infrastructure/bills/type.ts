import {
  BaseDBData,
  CreateDBData,
  UpdateDBData,
} from "@/infrastructure/dbType";

export enum BillType {
  /** 支出 */
  EXPEND = 1,
  /** 收入 */
  INCOME = 2,
}

export interface BillTDO extends BaseDBData {
  ledger_id?: number;
  parent_bill_id?: number;
  name: string;
  type: BillType;
  amount: number;
  date: string;
  note?: string;
  file_path?: string;
}

export type CreateBillInput = CreateDBData<BillTDO>;

export type UpdateBillInput = UpdateDBData<BillTDO>;

export type DeleteBillInput = BillTDO;
