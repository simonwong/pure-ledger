import { CreateBill, Bill, UpdateBill } from '@/domain/bill';
import BigNumber from 'bignumber.js';
import { InsertBillInput, SelectBillOutput, UpdateBillInput } from './type';

export const dtoToBill = (dto: SelectBillOutput): Bill => {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    amount: dto.amount,
    actualAmount: dto.isInstallment ? 0 : dto.amount,
    date: dto.date,
    note: dto.note || undefined,
    filePaths: dto.filePath ? dto.filePath.split(',') : undefined,
    ledgerId: dto.ledgerId!,
    parentBillId: dto.parentBillId || undefined,
    createdAt: dto.createdAt!,
    updatedAt: dto.updatedAt!,
    isInstallment: !!dto.isInstallment,
  };
};

export const dtoListToBills = (dtoList: SelectBillOutput[]): Bill[] => {
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

export const createBillToInput = (data: CreateBill): InsertBillInput => {
  return {
    name: data.name,
    type: data.type,
    amount: data.amount,
    date: data.date,
    note: data.note,
    ledgerId: data.ledgerId,
    parentBillId: data.parentBillId,
    filePath: data.filePaths?.filter(Boolean).join(','),
    isInstallment: data.isInstallment ? 1 : 0,
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
    ledgerId: data.ledgerId,
    parentBillId: data.parentBillId,
    filePath: data.filePaths?.filter(Boolean).join(','),
    isInstallment: data.isInstallment ? 1 : 0,
  };
};
