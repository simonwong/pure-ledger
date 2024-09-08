import { CreateLedger, Ledger, UpdateLedger } from "@/domain/ledger";
import { CreateLedgerInput, LedgerDTO, UpdateLedgerInput } from "./type";

export const dtoToLedger = (dto: LedgerDTO): Ledger => {
  return {
    id: dto.id,
    name: dto.name,
    note: dto.note,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
};

export const dtoListToLedgers = (dtoList: LedgerDTO[]): Ledger[] => {
  return dtoList.map((item) => dtoToLedger(item));
};

export const createLedgerToInput = (data: CreateLedger): CreateLedgerInput => {
  return data;
};

export const updateLedgerToInput = (data: UpdateLedger): UpdateLedgerInput => {
  return {
    id: data.id,
    name: data.name,
    note: data.note,
  };
};
