import * as React from 'react';
import { Card, Modal } from '@easy-shadcn/react';
import { Bill, BillType } from '@/domain/bill';
import { Button } from '@easy-shadcn/react';
import { DollarSignIcon, HandCoinsIcon } from 'lucide-react';
import { useQueryBills } from '@/store/bill';
import BillItem from './BillItem';
import { BillFormModal } from '../bill-form/BillForm';

interface BillListProps {
  ledgerId: number;
}

const BillList: React.FC<BillListProps> = ({ ledgerId }) => {
  const { data: billList = [] } = useQueryBills(ledgerId);
  const renderBillList = (list: Bill[]) => {
    return list.map((item) => <BillItem key={item.id} bill={item} ledgerId={ledgerId} />);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card
        className="col-span-full lg:col-span-3"
        title={
          <div className="flex justify-between items-center">
            <span>账单列表</span>
            <div className="top-6 right-6 space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-primary"
                onClick={() => {
                  Modal.show(BillFormModal, {
                    ledgerId,
                    defaultData: {
                      type: BillType.EXPEND,
                    },
                  });
                }}
                icon={<HandCoinsIcon />}
              >
                添加支出账单
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-primary"
                onClick={() => {
                  Modal.show(BillFormModal, {
                    ledgerId,
                    defaultData: {
                      type: BillType.INCOME,
                    },
                  });
                }}
                icon={<DollarSignIcon />}
              >
                添加收入账单
              </Button>
            </div>
          </div>
        }
        description={`总共 ${billList.length} 条账单`}
        contentProps={{
          className: 'p-0',
        }}
        content={<div className="min-w-96">{renderBillList(billList)}</div>}
      />
    </div>
  );
};

export default BillList;
