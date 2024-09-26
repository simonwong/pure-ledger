import { BaseDomain, CreateDomain, UpdateDomain } from "./base";

export enum BillType {
  /** 支出 */
  EXPEND = 1,
  /** 收入 */
  INCOME = 2,
}

export interface Bill extends BaseDomain {
  ledgerId: number;
  parentBillId?: number;
  name: string;
  type: BillType;
  amount: number;
  date: string;
  note?: string;
  filePaths?: string[];
  subBills?: Bill[];
  actualAmount: number;
}

export type CreateBill = Omit<CreateDomain<Bill>, "actualAmount" | "subBills">;

export type UpdateBill = Omit<UpdateDomain<Bill>, "actualAmount" | "subBills">;

export type DeleteBill = Bill;
