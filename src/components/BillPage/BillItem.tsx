import React from "react";
import { ImageList } from "../ImageList";
import { Bill } from "@/domain/bill";
import { Button, DropdownMenu, modalAction } from "@easy-shadcn/react";
import { useMutationDeleteBill } from "@/store/bill";
import { EllipsisVerticalIcon } from "lucide-react";
import AmountDisplay from "./AmountDisplay";
import { useBillFormModal } from "../BillForm/actions";
import SubBillItem from "./SubBillItem";

interface BillItemProps {
  ledgerId: number;
  bill: Bill;
}

const BillItem: React.FC<BillItemProps> = ({ ledgerId, bill }) => {
  const deleteBill = useMutationDeleteBill();
  const hasSubBill = !!bill.subBills?.length;

  const renderSubBillList = (list: Bill[], parentBill: Bill) => {
    return (
      <div className="bg-gray-100 p-6 space-y-4">
        {list.map((item) => (
          <SubBillItem key={item.id} subBill={item} parentBill={parentBill} />
        ))}
      </div>
    );
  };
  const billFormModal = useBillFormModal(
    {
      ledgerId,
      data: bill,
    },
    [ledgerId, bill]
  );

  return (
    <div>
      <div className="flex items-center space-x-12 p-6">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">{bill.name}</p>
          <p className="text-sm text-muted-foreground">{bill.note}</p>
        </div>
        <div>{<ImageList data={bill.filePaths} />}</div>
        <div className="ml-auto">
          <AmountDisplay
            className="font-medium"
            type={bill.type}
            amount={bill.isInstallment ? bill.actualAmount : bill.amount}
          />
          {bill.isInstallment && (
            <span className="text-muted-foreground"> ({bill.amount})</span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{bill.date}</div>
        <div>
          <DropdownMenu
            menu={[
              {
                name: "编辑",
                key: "edit",
                onClick: () => {
                  billFormModal.open();
                },
              },
              {
                name: "删除",
                key: "delete",
                onClick: () => {
                  modalAction.confirm({
                    title: "是否确认删除",
                    content: "删除后无法找回",
                    onConfirm: () => {
                      deleteBill.mutateAsync(bill);
                    },
                  });
                },
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
      {hasSubBill && renderSubBillList(bill.subBills!, bill)}
    </div>
  );
};

export default BillItem;
