import { CreateBill, Bill, UpdateBill } from "@/domain/bill";
import { CreateBillInput, BillTDO, UpdateBillInput } from "./type";
import BigNumber from "bignumber.js";

export const dtoToBill = (dto: BillTDO): Bill => {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    amount: dto.amount,
    actualAmount: dto.amount,
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
  const res: Bill[] = [];
  const parentBillMap: Record<string, Bill[]> = {};

  const billList = dtoList.map((item) => dtoToBill(item));

  billList.forEach((item) => {
    if (item.parentBillId) {
      parentBillMap[item.parentBillId] ||= [];
      parentBillMap[item.parentBillId].push(item);
    }
  });

  billList.forEach((item) => {
    if (!item.parentBillId) {
      const subBills = parentBillMap[item.id];

      if (subBills) {
        item.subBills = subBills;
        let amount = BigNumber(0);
        subBills.forEach((bill) => (amount = amount.plus(bill.amount)));
        item.actualAmount = amount.toNumber();
      }
      res.push(item);
    }
  });

  return res;
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
