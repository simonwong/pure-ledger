import { useMemo, useState } from "react";
import { Button, Switch, Tooltip } from "@easy-shadcn/react";
import { CircleAlertIcon } from "lucide-react";
import { getBill } from "@/infrastructure/bill/api";
import { Bill } from "@/domain/bill";
import { SubBillFormModal } from "./actions";
import SubBillItem from "../BillPage/SubBillItem";
import BigNumber from "bignumber.js";

interface MultipleBillProps {
  isEdit: boolean;
  data?: Bill;
  defaultIsMultiple?: boolean;
}

export const useMultipleBill = ({
  isEdit,
  data,
  defaultIsMultiple,
}: MultipleBillProps) => {
  const [isMultipleBills, setIsMultipleBills] = useState(
    defaultIsMultiple || false
  );
  const MultipleBillSwitch = (
    <div className="flex gap-2 items-center">
      <Switch
        checked={isMultipleBills}
        onCheckedChange={setIsMultipleBills}
        disabled={isEdit}
        label={`分多笔的账单`}
      />
      <Tooltip
        content={
          <div className="bg-white text-black dark:bg-black dark:text-primary-foreground">
            <div>
              开启分多笔的账单后，当前账单的金额不会计入统计，而是子账单的金额为准。
            </div>
            <div>在下方添加子账单</div>
          </div>
        }
        delayDuration={300}
      >
        <CircleAlertIcon className="w-4 h-4 cursor-pointer" />
      </Tooltip>
    </div>
  );

  const resetAmount = useMemo(() => {
    if (data) {
      return BigNumber(data.amount).minus(data.actualAmount).toNumber();
    }
    return null;
  }, [data?.amount, data?.actualAmount]);

  const SubBillListNode =
    isEdit && isMultipleBills ? (
      <div className="border border-muted rounded-md my-4 p-4">
        <div className="space-y-2">
          {data?.subBills?.map((subBill) => (
            <SubBillItem key={subBill.id} subBill={subBill} parentBill={data} />
          ))}
        </div>
        {data && data.amount > data.actualAmount && (
          <div className="py-4 text-center">
            <Button
              onClick={() => {
                if (data) {
                  SubBillFormModal.open(
                    {
                      parentBillData: data,
                    },
                    {
                      billName: data.name,
                    }
                  );
                }
              }}
              className="border-none"
              variant="secondary"
            >
              添加子账单
            </Button>
            <p className="mt-2">还有 {resetAmount} 元未记录</p>
          </div>
        )}
      </div>
    ) : null;

  const isSubmitAndAddSubBill = !isEdit && isMultipleBills;
  const submitAndAddSubBill = async (billId: number | null) => {
    if (isSubmitAndAddSubBill && billId) {
      const billData = await getBill(billId);
      if (billData) {
        SubBillFormModal.open(
          {
            parentBillData: billData,
          },
          {
            billName: billData.name,
          }
        );
      }
    }
  };

  return {
    MultipleBillSwitch,
    SubBillListNode,
    submitAndAddSubBill,
    isMultipleBills,
    isSubmitAndAddSubBill,
  };
};
