import * as React from "react";
import BillSummary from "./Summary";
import BillHeader from "./Header";
import BillList from "./BillList";

interface BillPageProps {}

const BillPage: React.FC<BillPageProps> = () => {
  return (
    <div className="space-y-4">
      <BillHeader />
      <BillSummary />
      <BillList />
    </div>
  );
};

export default BillPage;
