export interface CreateLedger {
  name: string;
  remark?: string;
}

export interface Ledger extends CreateLedger {
  id: string;
  createAt: string;
}
