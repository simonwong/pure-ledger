import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BillType } from "@/types";
import { Button } from "@/components/ui/button";
import { BillFormModal } from "@/components/BillForm";
import { DollarSign, EllipsisVertical, HandCoins } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ImageList } from "../ImageList";
import { useQueryBills, useMutationDeleteBill } from "@/store/db/bill";

interface BillListProps {
  ledgerId: number;
}

const BillList: React.FC<BillListProps> = ({ ledgerId }) => {
  const { data: billList = [] } = useQueryBills(ledgerId);
  const deleteBill = useMutationDeleteBill();

  return (
    <Card className="max-w-3xl">
      <CardHeader className="relative">
        <CardTitle>账单列表</CardTitle>
        <CardDescription>总共 {billList.length} 条账单</CardDescription>
        <div className="absolute top-6 right-6 space-x-2">
          <BillFormModal ledgerId={ledgerId} defaultType={BillType.EXPEND}>
            <Button size="sm" variant="secondary" className="hover:bg-primary">
              <HandCoins className="mr-2 h-4 w-4" /> 添加支出账单
            </Button>
          </BillFormModal>
          <BillFormModal ledgerId={ledgerId} defaultType={BillType.INCOME}>
            <Button size="sm" variant="secondary" className="hover:bg-primary">
              <DollarSign className="mr-2 h-4 w-4" /> 添加收入账单
            </Button>
          </BillFormModal>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 min-w-96">
          {billList.map((item) => (
            <div key={item.id} className="flex items-center space-x-12">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.note}</p>
              </div>
              <div>{<ImageList data={item.remarkFiles} />}</div>
              <div className="ml-auto font-medium">
                {item.type === BillType.EXPEND ? "-" : "+"}
                {item.amount}
              </div>
              <div className="text-sm text-muted-foreground">{item.date}</div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <EllipsisVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-9">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => deleteBill.mutateAsync(item)}
                      >
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillList;
