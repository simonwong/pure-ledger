import * as React from "react";
import { Card } from "@easy-shadcn/react";
import { BillType } from "@/types";
import { Button, DropdownMenu } from "@easy-shadcn/react";
import { DollarSign, EllipsisVertical, HandCoins } from "lucide-react";
import { ImageList } from "../ImageList";
import { useQueryBills, useMutationDeleteBill } from "@/store/bill";
import { useBillFormModal } from "../BillForm/useBillFormModal";

interface BillListProps {
  ledgerId: number;
}

const BillList: React.FC<BillListProps> = ({ ledgerId }) => {
  const { data: billList = [] } = useQueryBills(ledgerId);
  const deleteBill = useMutationDeleteBill();

  const [billFormModalHost, billFormModalAction] = useBillFormModal();

  return (
    <>
      <Card
        className="max-w-3xl"
        title={
          <div className="flex justify-between items-center">
            <span>账单列表</span>
            <div className="top-6 right-6 space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-primary"
                onClick={() => {
                  billFormModalAction.open({
                    ledgerId,
                    defaultData: {
                      type: BillType.EXPEND,
                    },
                  });
                }}
              >
                <HandCoins className="mr-2 h-4 w-4" /> 添加支出账单
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-primary"
                onClick={() => {
                  billFormModalAction.open({
                    ledgerId,
                    defaultData: {
                      type: BillType.INCOME,
                    },
                  });
                }}
              >
                <DollarSign className="mr-2 h-4 w-4" /> 添加收入账单
              </Button>
            </div>
          </div>
        }
        description={`总共 ${billList.length} 条账单`}
        content={
          <div className="space-y-8 min-w-96">
            {billList.map((item) => (
              <div key={item.id} className="flex items-center space-x-12">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.note}</p>
                </div>
                <div>{<ImageList data={item.file_path?.split(",")} />}</div>
                <div className="ml-auto font-medium">
                  {item.type === BillType.EXPEND ? "-" : "+"}
                  {item.amount}
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
                      <EllipsisVertical size={16} />
                    </Button>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        }
      />
      {billFormModalHost}
    </>
  );
};

export default BillList;
