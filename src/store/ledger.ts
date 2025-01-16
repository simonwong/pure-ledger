import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as LedgersService from '@/infrastructure/ledger/api';
import { useGlobalStore } from './global';

export const useQueryLedgers = () => {
  return useQuery({
    queryKey: ['ledgers'],
    queryFn: async () => {
      const res = await LedgersService.getLedgers();
      return res;
    },
  });
};

export const useQueryLedger = (ledgerId: number | null) => {
  return useQuery({
    queryKey: ['ledger', ledgerId],
    queryFn: ledgerId ? () => LedgersService.getLedger(ledgerId) : () => null,
  });
};

export const useMutationCreateLedger = () => {
  const queryClient = useQueryClient();
  const switchSelect = useGlobalStore((state) => state.switchSelect);

  return useMutation({
    mutationFn: LedgersService.createLedger,
    onSuccess: (createdId) => {
      queryClient.invalidateQueries({ queryKey: ['ledgers'] });
      switchSelect(createdId);
    },
  });
};

export const useMutationUpdateLedger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LedgersService.updateLedger,
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['ledgers'] });
      queryClient.invalidateQueries({ queryKey: ['ledger', data.id] });
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
  const switchSelect = useGlobalStore((state) => state.switchSelect);

  return useMutation({
    mutationFn: LedgersService.deleteLedger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledgers'] });
      switchSelect(null);
    },
  });
};
