import * as React from 'react';
import BillSummary from './Summary';
import BillHeader from './Header';
import BillList from './bill-list';
import EmptyPage from '@/features/empty/empty-page';
import { useGlobalStore } from '@/store/global';
import { useQueryLedger } from '@/store/ledger';
import { Loader2Icon } from 'lucide-react';

interface BillPageProps {}

const BillPage: React.FC<BillPageProps> = () => {
  const currentLedgerId = useGlobalStore((state) => state.currentLedgerId);
  const { data: ledger, isLoading } = useQueryLedger(currentLedgerId);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (!currentLedgerId || ledger == null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <EmptyPage />
      </div>
    );
  }

  return (
    <div className="space-y-4 h-screen overflow-auto p-8">
      <BillHeader ledger={ledger} />
      <BillSummary ledgerId={currentLedgerId} />
      <BillList ledgerId={currentLedgerId} />
    </div>
  );
};

export default BillPage;
