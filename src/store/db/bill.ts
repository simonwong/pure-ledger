import { Bill, CreateBill, UpdateBill } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ORM } from "./orm";

export const useQueryBills = (ledgerId: number) => {
  return useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const res = await ORM.selectAll("bills", {
        ledger_id: ledgerId,
      });

      return res;
    },
  });
};

export const useQueryBill = (billId: number | null) => {
  return useQuery({
    queryKey: ["bill", billId],
    queryFn: async () => {
      if (billId == null) {
        return null;
      }
      const res = await ORM.selectById("bills", billId);
      return res;
    },
  });
};

export const useMutationCreateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBill) => {
      await ORM.insert("bills", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};

export const useMutationUpdateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateBill) => {
      await ORM.updateById("bills", data, data.id);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill", data.id] });
    },
  });
};

/**
 * 删除账单
 * 1. 删除账单
 * 2. 删除账单关联的文件
 */
export const useMutationDeleteBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bill: Bill) => {
      await ORM.deleteById("bills", bill.id);
    },
    onSuccess: async (_, bill) => {
      // TODO: 删除文件
      // bill.remarkFiles && removeStorageFileBatch(bill.remarkFiles);
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};
