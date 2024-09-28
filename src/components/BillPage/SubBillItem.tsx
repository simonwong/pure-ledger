import { Bill } from "@/domain/bill";
import React from "react";
import { ImageList } from "../ImageList";
import AmountDisplay from "./AmountDisplay";
import { Button, DropdownMenu } from "@easy-shadcn/react";
import { SubBillFormModal } from "../BillForm/actions";
import { useMutationDeleteBill } from "@/store/bill";
import { EllipsisVerticalIcon } from "lucide-react";

interface SubBillItemProps {
  subBill: Bill;
  parentBill: Bill;
}

const SubBillItem: React.FC<SubBillItemProps> = ({ subBill, parentBill }) => {
  const deleteBill = useMutationDeleteBill();

  return (
    <div className="flex items-center space-x-12">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{subBill.name}</p>
        <p className="text-sm text-muted-foreground">{subBill.note}</p>
      </div>
      <div>{<ImageList data={subBill.filePaths} />}</div>
      <div className="ml-auto">
        <AmountDisplay
          className="font-medium"
          type={subBill.type}
          amount={subBill.amount}
        />
      </div>
      <div className="text-sm text-muted-foreground">{subBill.date}</div>
      <div>
        <DropdownMenu
          menu={[
            {
              name: "编辑",
              key: "edit",
              onClick: () => {
                SubBillFormModal.open(
                  {
                    data: subBill,
                    parentBillData: parentBill,
                  },
                  {
                    billName: parentBill.name,
                  }
                );
              },
            },
            {
              name: "删除",
              key: "delete",
              onClick: () => deleteBill.mutateAsync(subBill),
            },
          ]}
          contentProps={{
            className: "w-9",
          }}
        >
          <Button variant="outline" size="icon">
            <EllipsisVerticalIcon size={16} />
          </Button>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SubBillItem;
