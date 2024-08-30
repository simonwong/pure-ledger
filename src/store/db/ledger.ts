import { removeStorageFoldByLedgerId } from "@/lib/storageFile";
import { CreateLedger, DeleteLedger, UpdateLedger } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ORM } from "./orm";

export const useQueryLedgers = () => {
  return useQuery({
    queryKey: ["ledgers"],
    queryFn: async () => {
      const res = await ORM.selectAll("ledgers");

      return res;
    },
  });
};

export const useQueryLedger = (ledgerId: number | null) => {
  return useQuery({
    queryKey: ["ledger", ledgerId],
    queryFn: async () => {
      if (ledgerId == null) {
        return null;
      }
      const res = await ORM.selectById("ledgers", ledgerId);
      return res;
    },
  });
};

export const useMutationCreateLedger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLedger) => {
      await ORM.insert("ledgers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ledgers"] });
    },
  });
};

export const useMutationUpdateLedger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLedger) => {
      await ORM.updateById("ledgers", data, data.id);
    },
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
    mutationFn: async (id: DeleteLedger) => {
      await ORM.deleteById("ledgers", id);
    },
    onSuccess: async (_, id) => {
      await removeStorageFoldByLedgerId(String(id));
      queryClient.invalidateQueries({ queryKey: ["ledgers"] });
    },
  });
};
