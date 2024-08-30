// ========= Ledger
interface Legacy_V0_CreateLedger {
  name: string;
  remark?: string;
}

interface Legacy_V0_Ledger extends Legacy_V0_CreateLedger {
  id: string;
  createAt: string;
}

// ========= Bill
enum Legacy_V0_BillType {
  /** 支出 */
  EXPEND = 1,
  /** 收入 */
  INCOME = 2,
}

interface Legacy_V0_CreateBill {
  /** 账单名称 */
  name: string;
  /** 账单类型 */
  type: Legacy_V0_BillType;
  /** 账单金额 */
  amount: number;
  /** 分批次到账金额 */
  amountBatch?: number[];
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createAt: string;
  /** 备注文件缓存 */
  remarkFiles?: string[];
}

interface Legacy_V0_Bill extends Legacy_V0_CreateBill {
  id: string;
}
