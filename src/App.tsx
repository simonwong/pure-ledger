import { useLedgerStore } from "@/store";
import LedgerMenu from "@/components/LedgerMenu";
import { LedgerFormModal } from "@/components/LedgerForm";
import BillPage from "@/components/BillPage";

import "./global.css";

function App() {
  const { ledgerList, addLedger } = useLedgerStore();

  if (ledgerList.length === 0) {
    return <LedgerFormModal open onConfirm={addLedger} />;
  }

  return (
    <div className="flex">
      <div className="p-8">
        <LedgerMenu />
      </div>
      <div className="flex-1 p-8">
        <BillPage />
      </div>
    </div>
  );
}

export default App;
