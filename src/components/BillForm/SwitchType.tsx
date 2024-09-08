import * as React from "react";
import { BillType } from "@/domain/bill";
import { DollarSign, HandCoins } from "lucide-react";
import { Toggle } from "@easy-shadcn/react";

interface SwitchTypeProps {
  value: BillType;
  onChange: (val: BillType) => void;
}

const SwitchType: React.FC<SwitchTypeProps> = ({ value, onChange }) => {
  const handleChange = (val: string) => {
    onChange(Number(val));
  };

  return (
    <Toggle
      type="single"
      value={String(value)}
      onValueChange={(value) => {
        if (value) {
          handleChange(value);
        }
      }}
      options={[
        {
          value: String(BillType.EXPEND),
          className: "cursor-pointer",
          label: (
            <>
              <HandCoins className="mr-2 h-4 w-4" /> 支出
            </>
          ),
        },
        {
          value: String(BillType.INCOME),
          className: "cursor-pointer",
          label: (
            <>
              <DollarSign className="mr-2 h-4 w-4" /> 收入
            </>
          ),
        },
      ]}
    />
  );
};

export default SwitchType;
