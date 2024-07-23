import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { DollarSign, HandCoins, WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBillList } from "@/store/bill";
import { BillType } from "@/types";

interface BillSummaryProps {}

const BillSummary: React.FC<BillSummaryProps> = () => {
  const billList = useBillList();

  const { balance, expend, income } = useMemo(() => {
    if (billList && billList.length > 0) {
      let expend = BigNumber(0);
      let income = BigNumber(0);

      billList.forEach((bill) => {
        if (bill.type === BillType.EXPEND) {
          expend.plus(bill.amount);
        }
        if (bill.type === BillType.INCOME) {
          income.plus(bill.amount);
        }
      });

      return {
        expend: expend.toFixed(2),
        income: expend.toFixed(2),
        balance: expend.plus(income).toFixed(2),
      };
    }
    return {
      balance: null,
      expend: null,
      income: null,
    };
  }, [billList]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">结余</CardTitle>
          <WalletCards size={18} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balance || "-"}</div>
          {/* <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总支出</CardTitle>
          <HandCoins size={18} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {expend ? `-${expend}` : "-"}
          </div>
          {/* <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总收入</CardTitle>
          <DollarSign size={18} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {income ? `+${income}` : "-"}
          </div>
          {/* <p className="text-xs text-muted-foreground">
            +180.1% from last month
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillSummary;
