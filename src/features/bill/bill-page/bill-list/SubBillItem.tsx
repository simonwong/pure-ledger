import { Bill } from '@/domain/bill';
import React from 'react';
import { ImageList } from '@/components/ImageList';
import AmountDisplay from '../AmountDisplay';
import { Button, DropdownMenu, AlertModal, Modal } from '@easy-shadcn/react';
import { SubBillFormModal } from '../bill-form/SubBillForm';
import { useMutationDeleteBill } from '@/store/bill';
import { EllipsisVerticalIcon } from 'lucide-react';
import { dateShow } from '@/lib/date';

interface SubBillItemProps {
  subBill: Bill;
  parentBill: Bill;
}

const SubBillItem: React.FC<SubBillItemProps> = ({ subBill, parentBill }) => {
  const deleteBill = useMutationDeleteBill();

  return (
    <div className="flex items-center space-x-8 px-6 py-2">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{subBill.name}</p>
        <p className="text-sm text-muted-foreground">{subBill.note}</p>
      </div>
      <div>{<ImageList size="sm" data={subBill.filePaths} />}</div>
      <div className="ml-auto">
        <AmountDisplay className="font-medium" type={subBill.type} amount={subBill.amount} />
      </div>
      <div className="text-sm text-muted-foreground">{dateShow(subBill.date)}</div>
      <div>
        <DropdownMenu
          menu={[
            {
              name: '编辑',
              key: 'edit',
              onClick: () => {
                Modal.show(SubBillFormModal, {
                  data: subBill,
                  parentBillData: parentBill,
                });
              },
            },
            {
              name: '删除',
              key: 'delete',
              onClick: () => {
                AlertModal.confirm({
                  title: '是否确认删除',
                  content: '删除后无法找回',
                  onConfirm: () => {
                    deleteBill.mutateAsync(subBill);
                  },
                });
              },
            },
          ]}
          contentProps={{
            className: 'w-9',
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
