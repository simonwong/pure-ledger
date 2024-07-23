import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { useLedgerStore } from "@/store";
import { LedgerFormModal } from "./LedgerForm";

interface LedgerMenuProps {
  className?: string;
}

const LedgerMenu: React.FC<LedgerMenuProps> = ({ className, ...props }) => {
  const { ledgerList, currentSelectId, switchSelect } = useLedgerStore();

  if (ledgerList.length === 0) {
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
              item.id === currentSelectId
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
