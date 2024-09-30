import LedgerMenu from "@/components/LedgerMenu";
import BillPage from "@/components/BillPage";
import { ModalHost } from "@easy-shadcn/react";
import { Loader2Icon } from "lucide-react";
import { useQueryLedgers } from "./store/ledger";

import "./global.css";

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
      <div className="flex">
        <div className="p-8">
          <LedgerMenu ledgerList={ledgerList} />
        </div>
        <div className="flex-1 p-8">
          <BillPage />
        </div>
      </div>
      <ModalHost />
    </>
  );
}

export default App;
