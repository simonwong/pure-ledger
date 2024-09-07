import React, { useEffect } from "react";
import { cn } from "@easy-shadcn/utils";
import { Button, buttonVariants } from "@easy-shadcn/react";
import { useLedgerFormModal } from "./LedgerForm";
import { useQueryLedgers } from "@/store/ledger";
import { useGlobalStore } from "@/store/global";

interface LedgerMenuProps {
  className?: string;
}

const LedgerMenu: React.FC<LedgerMenuProps> = ({ className, ...props }) => {
  const { currentLedgerId, switchSelect } = useGlobalStore();
  const [ledgerFormModalHost, ledgerFormModalAction] = useLedgerFormModal();
  const ledgerData = useQueryLedgers();

  const ledgerList = ledgerData.data;

  useEffect(() => {
    if (currentLedgerId == null && ledgerList && ledgerList.length > 0) {
      switchSelect(ledgerList[0].id);
    }
  }, [currentLedgerId, ledgerList]);

  if (!ledgerList || ledgerList.length === 0) {
    return null;
  }

  return (
    <div>
      <Button className="mb-4" onClick={() => ledgerFormModalAction.open()}>
        新建一个账本
      </Button>
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
      {ledgerFormModalHost}
    </div>
  );
};

export default LedgerMenu;
