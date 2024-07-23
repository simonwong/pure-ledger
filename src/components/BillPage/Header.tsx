import { useCurrentLedger } from "@/store/ledger";
import * as React from "react";
import { dialog } from "@/components/enhance/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2, Trash2 } from "lucide-react";

interface BillHeaderProps {}

const BillHeader: React.FC<BillHeaderProps> = () => {
  const ledger = useCurrentLedger();

  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">{ledger?.name}</h2>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Settings2 />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              console.log("1", 1);
            }}
          >
            编辑
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>危险操作</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              dialog.confirm({
                title: "是否确认删除",
                content: "危险操作哦，删除后这个账本的数据将无法恢复",
                onConfirm: () => {
                  console.log("1111", 1111);
                },
              });
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BillHeader;
