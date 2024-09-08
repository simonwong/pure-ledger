import { CreateBill, Bill, UpdateBill } from "@/domain/bill";
import { CreateBillInput, BillTDO, UpdateBillInput } from "./type";

export const dtoToBill = (dto: BillTDO): Bill => {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    amount: dto.amount,
    date: dto.date,
    note: dto.note,
    filePaths: dto.file_path ? dto.file_path.split(",") : undefined,
    ledgerId: dto.ledger_id,
    parentBillId: dto.parent_bill_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
};

export const dtoListToBills = (dtoList: BillTDO[]): Bill[] => {
  return dtoList.map((item) => dtoToBill(item));
};

export const createBillToInput = (data: CreateBill): CreateBillInput => {
  return {
    name: data.name,
    type: data.type,
    amount: data.amount,
    date: data.date,
    note: data.note,
    ledger_id: data.ledgerId,
    parent_bill_id: data.parentBillId,
    file_path: data.filePaths?.filter(Boolean).join(","),
  };
};

export const updateBillToInput = (data: UpdateBill): UpdateBillInput => {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    amount: data.amount,
    date: data.date,
    note: data.note,
    ledger_id: data.ledgerId,
    parent_bill_id: data.parentBillId,
    file_path: data.filePaths?.filter(Boolean).join(","),
  };
};
