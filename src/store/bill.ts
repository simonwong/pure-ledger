import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as BillsService from "@/infrastructure/bills/api";

export const useQueryBills = (ledgerId: number) => {
  return useQuery({
    queryKey: ["bills", ledgerId],
    queryFn: async () => BillsService.getBills(ledgerId),
  });
};

export const useQueryBill = (billId: number | null) => {
  return useQuery({
    queryKey: ["bill", billId],
    queryFn: billId ? () => BillsService.getBill(billId) : () => null,
  });
};

export const useMutationCreateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BillsService.createBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};

export const useMutationUpdateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BillsService.updateBill,
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
    mutationFn: BillsService.deleteBill,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};
