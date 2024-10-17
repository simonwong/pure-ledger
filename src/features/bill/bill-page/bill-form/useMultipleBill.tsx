import { useMemo } from 'react';
import { Button } from '@easy-shadcn/react';
import { getBill } from '@/infrastructure/bill/api';
import { Bill } from '@/domain/bill';
import { SubBillFormModal } from './actions';
import SubBillItem from '../bill-list/SubBillItem';
import BigNumber from 'bignumber.js';

interface MultipleBillProps {
  isInstallment: boolean;
  isEdit: boolean;
  data?: Bill;
  defaultIsMultiple?: boolean;
  beforeOpenToSaveParent: () => Promise<any>;
}

export const useMultipleBill = ({
  isInstallment,
  isEdit,
  data,
  beforeOpenToSaveParent,
}: MultipleBillProps) => {
  const resetAmount = useMemo(() => {
    if (data) {
      return BigNumber(data.amount).minus(data.actualAmount).toNumber();
    }
    return null;
  }, [data?.amount, data?.actualAmount]);

  const SubBillListNode =
    isEdit && isInstallment ? (
      <div className="border border-muted rounded-md my-4 p-4">
        <div className="space-y-2">
          {data?.subBills?.map((subBill) => (
            <SubBillItem key={subBill.id} subBill={subBill} parentBill={data} />
          ))}
        </div>
        {data && data.amount > data.actualAmount && (
          <div className="py-4 text-center">
            <Button
              onClick={async () => {
                if (data) {
                  await beforeOpenToSaveParent();
                  await new Promise<void>((resolve) => {
                    setTimeout(() => {
                      SubBillFormModal.open(
                        {
                          parentBillData: data,
                        },
                        {
                          billName: data.name,
                        }
                      );
                      resolve();
                    }, 300);
                  });
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

  const isSubmitAndAddSubBill = !isEdit && isInstallment;
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
    SubBillListNode,
    submitAndAddSubBill,
    isSubmitAndAddSubBill,
  };
};
