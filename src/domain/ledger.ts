import { BaseDomain, CreateDomain, UpdateDomain } from "./base";

export interface Ledger extends BaseDomain {
  name: string;
  note?: string;
}

export type CreateLedger = CreateDomain<Ledger>;

export type UpdateLedger = UpdateDomain<Ledger>;

export type DeleteLedger = Ledger["id"];
