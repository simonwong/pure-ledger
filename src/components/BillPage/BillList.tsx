import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BillType } from "@/types";
import { useBillList } from "@/store/bill";

interface BillListProps {}

const BillList: React.FC<BillListProps> = () => {
  const billList = useBillList();
  if (!billList) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>账单列表</CardTitle>
        <CardDescription>总共 {billList.length} 条账单</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 min-w-96">
          {billList.map((item) => (
            <div className="flex items-center space-x-12">
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillList;
