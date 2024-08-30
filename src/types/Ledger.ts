import { BaseDBData, CreateDBData, UpdateDBData } from "./db";

export interface Ledger extends BaseDBData {
  name: string;
  note?: string;
}

export type CreateLedger = CreateDBData<Ledger>;

export type UpdateLedger = UpdateDBData<Ledger>;

export type DeleteLedger = Ledger["id"];
