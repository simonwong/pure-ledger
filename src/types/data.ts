import { Bill } from "./Bill";
import { Ledger } from "./Ledger";

export type LedgerData = Ledger[];

export type BillData = {
  [key: string]: Bill[];
};
