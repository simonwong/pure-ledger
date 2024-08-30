import * as React from "react";
import { alertModalAction } from "@easy-shadcn/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilePenLine, Settings2, Trash2 } from "lucide-react";
import { useLedgerFormModal } from "@/components/LedgerForm";
import { Ledger } from "@/types";
import { useMutationDeleteLedger } from "@/store/db/ledger";

interface BillHeaderProps {
  ledger: Ledger;
}

const BillHeader: React.FC<BillHeaderProps> = ({ ledger }) => {
  const deleteLedger = useMutationDeleteLedger();

  const { openLedgerFormModal, ledgerFormModal } = useLedgerFormModal();

  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{ledger.name}</h2>
        {ledger.note && <p>{ledger.note}</p>}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Settings2 />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              openLedgerFormModal({
                data: ledger,
              });
            }}
          >
            <FilePenLine className="mr-2 h-4 w-4" />
            <span>编辑</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>危险操作</DropdownMenuLabel>
          <DropdownMenuItem
            className="focus:bg-red-500"
            onClick={() => {
              alertModalAction.confirm({
                title: "是否确认删除",
                content: "危险操作哦，删除后这个账本的数据将无法恢复",
                onConfirm: async () => {
                  await deleteLedger.mutateAsync(ledger.id);
                },
              });
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {ledgerFormModal}
    </div>
  );
};

export default BillHeader;
