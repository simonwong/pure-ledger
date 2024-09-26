import React from "react";
import { ImageList } from "../ImageList";
import { Bill } from "@/domain/bill";
import { Button, DropdownMenu } from "@easy-shadcn/react";
import { useMutationDeleteBill } from "@/store/bill";
import { EllipsisVerticalIcon } from "lucide-react";
import { useBillFormModal } from "../BillForm";
import AmountDisplay from "./AmountDisplay";

interface BillItemProps {
  ledgerId: number;
  bill: Bill;
}

const BillItem: React.FC<BillItemProps> = ({ ledgerId, bill }) => {
  const deleteBill = useMutationDeleteBill();
  const [billFormModalAction] = useBillFormModal();

  const hasSubBill = !!bill.subBills?.length;

  const renderSubBillList = (list: Bill[]) => {
    return (
      <div className="bg-gray-100 p-6 space-y-4">
        {list.map((item) => (
          <div key={item.id} className="flex items-center space-x-12">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.note}</p>
            </div>
            <div>{<ImageList data={item.filePaths} />}</div>
            <div className="ml-auto">
              <AmountDisplay
                className="font-medium"
                type={item.type}
                amount={item.amount}
              />
            </div>
            <div className="text-sm text-muted-foreground">{item.date}</div>
            <div>
              <DropdownMenu
                menu={[
                  {
                    name: "编辑",
                    key: "edit",
                    onClick: () => {
                      billFormModalAction.open({
                        ledgerId,
                        data: item,
                      });
                    },
                  },
                  {
                    name: "删除",
                    key: "delete",
                    onClick: () => deleteBill.mutateAsync(item),
                  },
                ]}
                contentProps={{
                  className: "w-9",
                }}
              >
                <Button variant="outline" size="sm">
                  <EllipsisVerticalIcon size={16} />
                </Button>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
            amount={hasSubBill ? bill.actualAmount : bill.amount}
          />
          {hasSubBill && (
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
                  billFormModalAction.open({
                    ledgerId,
                    data: bill,
                  });
                },
              },
              {
                name: "删除",
                key: "delete",
                onClick: () => deleteBill.mutateAsync(bill),
              },
            ]}
            contentProps={{
              className: "w-9",
            }}
          >
            <Button variant="outline" size="sm">
              <EllipsisVerticalIcon size={16} />
            </Button>
          </DropdownMenu>
        </div>
      </div>
      {hasSubBill && renderSubBillList(bill.subBills!)}
    </div>
  );
};

export default BillItem;
