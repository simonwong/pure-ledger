import React, { useState } from "react";
import { Bill } from "@/domain/bill";
import {
  Button,
  DropdownMenu,
  DropdownMenuProps,
  modalAction,
} from "@easy-shadcn/react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutationDeleteBill } from "@/store/bill";
import { EllipsisVerticalIcon } from "lucide-react";
import AmountDisplay from "./AmountDisplay";
import { SubBillFormModal, useBillFormModal } from "../BillForm/actions";
import SubBillItem from "./SubBillItem";
import { ImageList } from "../ImageList";

interface BillItemProps {
  ledgerId: number;
  bill: Bill;
}

const BillItem: React.FC<BillItemProps> = ({ ledgerId, bill }) => {
  const deleteBill = useMutationDeleteBill();
  // 还款清
  const isClean = bill.amount === bill.actualAmount;
  // 是个分期账单且有子账单
  const hasSubBill = !!bill.subBills?.length && bill.isInstallment;
  // 还款完了就默认折叠
  const [isFold, setIsFold] = useState(isClean ? true : false);

  const renderSubBillList = (list: Bill[], parentBill: Bill) => {
    return (
      <AnimatePresence>
        {hasSubBill && !isFold && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-100 p-6 space-y-4"
          >
            {list.map((item) => (
              <SubBillItem
                key={item.id}
                subBill={item}
                parentBill={parentBill}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
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
            menu={
              [
                bill.isInstallment
                  ? {
                      groupName: "子账单操作",
                      items: [
                        {
                          name: "添加子账单",
                          key: "fold",
                          disabled: isClean,
                          onClick: () => {
                            SubBillFormModal.open(
                              { parentBillData: bill },
                              { billName: bill.name }
                            );
                          },
                        },
                        {
                          name: isFold ? "展开子账单" : "收起子账单",
                          disabled: !hasSubBill,
                          key: "fold",
                          onClick: () => {
                            setIsFold((f) => !f);
                          },
                        },
                      ],
                    }
                  : undefined,
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
              ].filter(Boolean) as DropdownMenuProps["menu"]
            }
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
      {renderSubBillList(bill.subBills!, bill)}
    </div>
  );
};

export default BillItem;
