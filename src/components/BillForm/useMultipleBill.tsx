import React, { useState } from "react";
import { Button, Switch, Tooltip } from "@easy-shadcn/react";
import { CircleAlertIcon } from "lucide-react";
import { useSubBillFormModal } from "./useSubBillFormModal";
import { getBill } from "@/infrastructure/bill/api";

interface MultipleBillProps {
  isEdit: boolean;
}

export const useMultipleBill = ({ isEdit }: MultipleBillProps) => {
  const [isMultipleBills, setIsMultipleBills] = useState(false);
  const [subBillAction] = useSubBillFormModal();
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
  const SubBillListNode =
    isEdit && isMultipleBills ? (
      <div className="border border-muted rounded-md my-4 p-4">
        {/* <div className="flex">
        <Button variant="secondary">添加子账单</Button>
      </div> */}
        <div className="flex items-center justify-center py-4">
          <Button className="border-none" variant="secondary">
            添加子账单
          </Button>
        </div>
      </div>
    ) : null;

  const isSubmitAndAddSubBill = !isEdit && isMultipleBills;
  const submitAndAddSubBill = async (billId: number | null) => {
    if (isSubmitAndAddSubBill && billId) {
      const billData = await getBill(billId);
      console.log("billData", billData);
      if (billData) {
        subBillAction.open(
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
