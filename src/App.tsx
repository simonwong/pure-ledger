import LedgerMenu from "@/components/LedgerMenu";
import BillPage from "@/components/BillPage";
import { AlertModalHost } from "@easy-shadcn/react";

import "./global.css";

function App() {
  return (
    <>
      <div className="flex">
        <div className="p-8">
          <LedgerMenu />
        </div>
        <div className="flex-1 p-8">
          <BillPage />
        </div>
      </div>
      <AlertModalHost />
    </>
  );
}

export default App;
