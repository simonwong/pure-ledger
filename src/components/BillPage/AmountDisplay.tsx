import { BillType } from "@/domain/bill";
import React from "react";

interface AmountDisplayProps {
  className?: string;
  type: BillType;
  amount?: string | number;
  placeholder?: string;
}

const AmountDisplay: React.FC<AmountDisplayProps> = ({
  className,
  type,
  amount,
  placeholder,
}) => {
  if (amount === 0 || amount === "0" || !amount) {
    return <span className={className}>{placeholder || "0"}</span>;
  }

  return (
    <span className={className}>
      {type === BillType.EXPEND ? `-${amount}` : amount}
    </span>
  );
};

export default AmountDisplay;
