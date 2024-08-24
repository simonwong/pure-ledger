import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BillType } from "@/types";
import { useBillList, useBillStore } from "@/store/bill";
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

interface BillListProps {}

const BillList: React.FC<BillListProps> = () => {
  const removeBill = useBillStore((state) => state.removeBill);
  const billList = useBillList() || [];

  return (
    <Card className="max-w-3xl">
      <CardHeader className="relative">
        <CardTitle>账单列表</CardTitle>
        <CardDescription>总共 {billList.length} 条账单</CardDescription>
        <div className="absolute top-6 right-6 space-x-2">
          <BillFormModal defaultType={BillType.EXPEND}>
            <Button size="sm" variant="secondary" className="hover:bg-primary">
              <HandCoins className="mr-2 h-4 w-4" /> 添加支出账单
            </Button>
          </BillFormModal>
          <BillFormModal defaultType={BillType.INCOME}>
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
                <p className="text-sm text-muted-foreground">{item.remark}</p>
              </div>
              <div className="ml-auto font-medium">
                {item.type === BillType.EXPEND ? "-" : "+"}
                {item.amount}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.createAt}
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <EllipsisVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-9">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => removeBill(item)}>
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
