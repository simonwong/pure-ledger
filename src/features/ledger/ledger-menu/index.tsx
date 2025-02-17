import React from 'react';
import { cn } from '@easy-shadcn/utils';
import { Button, buttonVariants, Modal } from '@easy-shadcn/react';
import { LedgerFormModal } from '@/features/ledger/ledger-form';
import { useGlobalStore } from '@/store/global';
import { Ledger } from '@/domain/ledger';

interface LedgerMenuProps {
  className?: string;
  ledgerList?: Ledger[];
}

const LedgerMenu: React.FC<LedgerMenuProps> = ({ className, ledgerList, ...props }) => {
  const { currentLedgerId, switchSelect } = useGlobalStore();

  if (!ledgerList || ledgerList.length === 0) {
    return null;
  }

  return (
    <div className="p-8 pr-0">
      <Button
        className="mb-4"
        onClick={() => {
          Modal.show(LedgerFormModal);
        }}
      >
        新建一个账本
      </Button>
      <nav className={cn('flex-col', className)} {...props}>
        {ledgerList.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              switchSelect(item.id);
            }}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              item.id === currentLedgerId ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent',
              'justify-start cursor-pointer block whitespace-pre text-wrap h-auto max-w-[200px]'
            )}
          >
            {item.name}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default LedgerMenu;
