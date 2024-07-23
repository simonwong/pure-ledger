import * as React from "react";
import BillSummary from "./Summary";
import BillHeader from "./Header";
import BillList from "./BillList";
import { useLedgerStore } from "@/store";
import EmptyPage from "@/components/EmptyPage";

interface BillPageProps {}

const BillPage: React.FC<BillPageProps> = () => {
  const currentSelectId = useLedgerStore((state) => state.currentSelectId);
  if (!currentSelectId) {
    return (
      <div className="h-full flex justify-center items-center">
        <EmptyPage />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BillHeader />
      <BillSummary />
      <BillList />
    </div>
  );
};

export default BillPage;
