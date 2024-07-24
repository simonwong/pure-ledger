export enum BillType {
  /** 支出 */
  EXPEND = 1,
  /** 收入 */
  INCOME = 2,
}

export interface CreateBill {
  /** 账单名称 */
  name: string;
  /** 账单类型 */
  type: BillType;
  /** 账单金额 */
  amount: number;
  /** 分批次到账金额 */
  amountBatch?: number[];
  /** 备注 */
  remark?: string;
}

export interface Bill extends CreateBill {
  id: string;
  /** 创建时间 */
  createAt: string;
}
