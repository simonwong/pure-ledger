import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { DollarSign, HandCoins, WalletCards } from "lucide-react";
import { Card } from "@easy-shadcn/react";
import { BillType } from "@/domain/bill";
import { useQueryBills } from "@/store/bill";
import AmountDisplay from "./AmountDisplay";

interface BillSummaryProps {
  ledgerId: number;
}

const BillSummary: React.FC<BillSummaryProps> = ({ ledgerId }) => {
  const { data: billList } = useQueryBills(ledgerId);

  const { balance, expend, income, resetExpend, resetIncome } = useMemo(() => {
    if (billList && billList.length > 0) {
      let expectExpend = BigNumber(0);
      let expectIncome = BigNumber(0);
      let expend = BigNumber(0);
      let income = BigNumber(0);

      billList.forEach((bill) => {
        if (bill.type === BillType.EXPEND) {
          expend = expend.plus(bill.actualAmount);
          expectExpend = expectExpend.plus(bill.amount);
        }
        if (bill.type === BillType.INCOME) {
          income = income.plus(bill.actualAmount);
          expectIncome = expectIncome.plus(bill.amount);
        }
      });

      const resetExpend = expectExpend.minus(expend);
      const resetIncome = expectIncome.minus(income);

      return {
        expend: expend.toNumber(),
        income: income.toNumber(),
        balance: income.minus(expend).toNumber(),
        resetExpend: resetExpend.toNumber(),
        resetIncome: resetIncome.toNumber(),
      };
    }
    return {
      balance: 0,
      expend: 0,
      income: 0,
      resetExpend: 0,
      resetIncome: 0,
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
          <AmountDisplay
            className="text-2xl font-bold"
            type={balance > 0 ? BillType.EXPEND : BillType.INCOME}
            amount={Math.abs(balance)}
            placeholder="-"
          />
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
          <AmountDisplay
            className="text-2xl font-bold"
            type={BillType.EXPEND}
            amount={expend}
            placeholder="-"
          />
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
          <AmountDisplay
            className="text-2xl font-bold"
            type={BillType.INCOME}
            amount={income}
            placeholder="-"
          />
        }
      />
      <Card
        className="space-y-0"
        hidden={!(resetExpend || resetIncome)}
        content={
          <div className="space-y-2">
            {resetExpend ? (
              <div className="flex items-center">
                <div className="text-sm font-medium mr-2">待支出</div>
                <AmountDisplay
                  className="text-xl font-bold"
                  type={BillType.EXPEND}
                  amount={resetExpend}
                  placeholder="-"
                />
              </div>
            ) : null}
            {resetIncome ? (
              <div className="flex items-center">
                <div className="text-sm font-medium mr-2">待收入</div>
                <AmountDisplay
                  className="text-xl font-bold"
                  type={BillType.INCOME}
                  amount={resetIncome}
                  placeholder="-"
                />
              </div>
            ) : null}
          </div>
        }
      />
    </div>
  );
};

export default BillSummary;
