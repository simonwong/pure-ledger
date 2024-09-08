import * as React from "react";
import BillSummary from "./Summary";
import BillHeader from "./Header";
import BillList from "./BillList";
import EmptyPage from "@/components/EmptyPage";
import { useGlobalStore } from "@/store/global";
import { useQueryLedger } from "@/store/ledger";
import { Loader2Icon } from "lucide-react";

interface BillPageProps {}

const BillPage: React.FC<BillPageProps> = () => {
  const currentLedgerId = useGlobalStore((state) => state.currentLedgerId);
  const { data: ledger, isLoading } = useQueryLedger(currentLedgerId);

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (!currentLedgerId || ledger == null) {
    return (
      <div className="h-full flex justify-center items-center">
        <EmptyPage />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BillHeader ledger={ledger} />
      <BillSummary ledgerId={currentLedgerId} />
      <BillList ledgerId={currentLedgerId} />
    </div>
  );
};

export default BillPage;
