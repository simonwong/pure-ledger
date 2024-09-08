import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as LedgersService from "@/infrastructure/ledger/api";

export const useQueryLedgers = () => {
  return useQuery({
    queryKey: ["ledgers"],
    queryFn: LedgersService.getLedgers,
  });
};

export const useQueryLedger = (ledgerId: number | null) => {
  return useQuery({
    queryKey: ["ledger", ledgerId],
    queryFn: ledgerId ? () => LedgersService.getLedger(ledgerId) : () => null,
  });
};

export const useMutationCreateLedger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LedgersService.createLedger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ledgers"] });
    },
  });
};

export const useMutationUpdateLedger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LedgersService.updateLedger,
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["ledgers"] });
      queryClient.invalidateQueries({ queryKey: ["ledger", data.id] });
    },
  });
};

/**
 * 删除账簿
 * 1. 删除账簿
 * 2. 删除账簿下的账单（数据库自动关联删除）
 * 3. 删除账单关联的文件
 */
export const useMutationDeleteLedger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LedgersService.deleteLedger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ledgers"] });
    },
  });
};
