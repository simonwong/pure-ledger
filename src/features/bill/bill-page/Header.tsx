import * as React from 'react';
import { AlertModal, Modal } from '@easy-shadcn/react';
import { DropdownMenu } from '@easy-shadcn/react';
import { FilePenLine, Settings2, Trash2 } from 'lucide-react';
import { LedgerFormModal } from '@/features/ledger/ledger-form';
import { useMutationDeleteLedger } from '@/store/ledger';
import { Ledger } from '@/domain/ledger';

interface BillHeaderProps {
  ledger: Ledger;
}

const BillHeader: React.FC<BillHeaderProps> = ({ ledger }) => {
  const deleteLedger = useMutationDeleteLedger();

  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{ledger.name}</h2>
        {ledger.note && <p>{ledger.note}</p>}
      </div>
      <DropdownMenu
        menu={[
          {
            prefix: <FilePenLine className="mr-2 h-4 w-4" />,
            name: '编辑',
            key: 'edit',
            onClick: () => {
              Modal.show(LedgerFormModal, {
                data: ledger,
              });
            },
          },
          {
            groupName: '危险操作',
            key: 'danger',
            items: [
              {
                prefix: <Trash2 className="mr-2 h-4 w-4" />,
                name: '删除',
                key: 'trash',
                className: 'focus:bg-red-500',
                onClick: () => {
                  AlertModal.confirm({
                    title: '是否确认删除',
                    content: '危险操作哦，删除后这个账本的数据将无法恢复',
                    onConfirm: async () => {
                      await deleteLedger.mutateAsync(ledger.id);
                    },
                  });
                },
              },
            ],
          },
        ]}
      >
        <Settings2 />
      </DropdownMenu>
    </div>
  );
};

export default BillHeader;
