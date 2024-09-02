import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@easy-shadcn/react";
import { buttonVariants } from "@easy-shadcn/react";
import { LedgerFormModal } from "./LedgerForm";
import { useQueryLedgers } from "@/store/ledger";
import { useGlobalStore } from "@/store/global";

interface LedgerMenuProps {
  className?: string;
}

const LedgerMenu: React.FC<LedgerMenuProps> = ({ className, ...props }) => {
  const { currentLedgerId, switchSelect } = useGlobalStore();

  const ledgerData = useQueryLedgers();

  const ledgerList = ledgerData.data;

  React.useEffect(() => {
    if (currentLedgerId == null && ledgerList && ledgerList.length > 0) {
      switchSelect(ledgerList[0].id);
    }
  }, [currentLedgerId, ledgerList]);

  if (!ledgerList || ledgerList.length === 0) {
    return null;
  }

  return (
    <div>
      <LedgerFormModal>
        <Button className="mb-4">新建一个账本</Button>
      </LedgerFormModal>
      <nav className={cn("flex-col", className)} {...props}>
        {ledgerList.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              switchSelect(item.id);
            }}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              item.id === currentLedgerId
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent",
              "justify-start cursor-pointer block whitespace-pre text-wrap h-auto max-w-[200px]"
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
