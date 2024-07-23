import { useCurrentLedger } from "@/store/ledger";
import * as React from "react";

interface BillHeaderProps {}

const BillHeader: React.FC<BillHeaderProps> = () => {
  const ledger = useCurrentLedger();

  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">{ledger?.name}</h2>
    </div>
  );
};

export default BillHeader;
