import { CreateLedger, UpdateLedger, Ledger } from '@/domain/ledger';
import { InsertLedgerInput, SelectLedgerOutput, UpdateLedgerInput } from './type';

export const dtoToLedger = (dto: SelectLedgerOutput): Ledger => {
  return {
    id: dto.id,
    name: dto.name,
    note: dto.note || undefined,
    createdAt: dto.createdAt!,
    updatedAt: dto.updatedAt!,
  };
};

export const dtoListToLedgers = (dtoList: SelectLedgerOutput[]): Ledger[] => {
  return dtoList.map((dto) => dtoToLedger(dto));
};

export const createLedgerToInput = (data: CreateLedger): InsertLedgerInput => {
  return data;
};

export const updateLedgerToInput = (data: UpdateLedger): UpdateLedgerInput => {
  return {
    id: data.id,
    name: data.name,
    note: data.note,
  };
};
