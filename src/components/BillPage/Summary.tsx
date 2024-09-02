import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { DollarSign, HandCoins, WalletCards } from "lucide-react";
import { Card } from "@easy-shadcn/react";
import { BillType } from "@/types";
import { useQueryBills } from "@/store/bill";

interface BillSummaryProps {
  ledgerId: number;
}

const BillSummary: React.FC<BillSummaryProps> = ({ ledgerId }) => {
  const { data: billList } = useQueryBills(ledgerId);

  const { balance, expend, income } = useMemo(() => {
    if (billList && billList.length > 0) {
      let expend = BigNumber(0);
      let income = BigNumber(0);

      billList.forEach((bill) => {
        if (bill.type === BillType.EXPEND) {
          expend = expend.plus(bill.amount);
        }
        if (bill.type === BillType.INCOME) {
          income = income.plus(bill.amount);
        }
      });

      return {
        expend: expend.toFixed(2),
        income: income.toFixed(2),
        balance: income.minus(expend).toFixed(2),
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
      <Card
        className="space-y-0"
        title={
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium">结余</span>
            <WalletCards size={18} className="text-muted-foreground" />
          </div>
        }
        content={
          <div className="text-2xl font-bold">{balance || "-"}</div>
          /* <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p> */
        }
      />
      <Card
        className="space-y-0"
        title={
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium">总支出</span>
            <HandCoins size={18} className="text-muted-foreground" />
          </div>
        }
        content={
          <div className="text-2xl font-bold">
            {expend ? `-${expend}` : "-"}
          </div>
        }
      />
      <Card
        className="space-y-0"
        title={
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium">总收入</span>
            <DollarSign size={18} className="text-muted-foreground" />
          </div>
        }
        content={
          <div className="text-2xl font-bold">
            {income ? `+${income}` : "-"}
          </div>
        }
      />
    </div>
  );
};

export default BillSummary;
