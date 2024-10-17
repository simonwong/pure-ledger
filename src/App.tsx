import LedgerMenu from '@/features/ledger/ledger-menu';
import BillPage from '@/features/bill/bill-page';
import { ModalHost } from '@easy-shadcn/react';
import { Loader2Icon } from 'lucide-react';
import { useQueryLedgers } from './store/ledger';

import './global.css';

function App() {
  const { data: ledgerList, isLoading } = useQueryLedgers();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex max-h-screen">
        <div>
          <LedgerMenu ledgerList={ledgerList} />
        </div>
        <div className="flex-1">
          <BillPage />
        </div>
      </div>
      <ModalHost />
    </>
  );
}

export default App;
