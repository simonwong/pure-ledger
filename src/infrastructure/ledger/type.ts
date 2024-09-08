import {
  BaseDBData,
  CreateDBData,
  UpdateDBData,
} from "@/infrastructure/dbType";

export interface LedgerDTO extends BaseDBData {
  name: string;
  note?: string;
}

export type CreateLedgerInput = CreateDBData<LedgerDTO>;

export type UpdateLedgerInput = UpdateDBData<LedgerDTO>;

export type DeleteLedgerInput = LedgerDTO["id"];
