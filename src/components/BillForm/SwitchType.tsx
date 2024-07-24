import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BillType } from "@/types";
import { DollarSign, HandCoins } from "lucide-react";

interface SwitchTypeProps {
  value: BillType;
  onChange: (val: BillType) => void;
}

const SwitchType: React.FC<SwitchTypeProps> = ({ value, onChange }) => {
  const handleChange = (val: string) => {
    onChange(Number(val));
  };

  return (
    <ToggleGroup
      type="single"
      value={String(value)}
      onValueChange={(value) => {
        console.log("onValueChange value", value);
        if (value) {
          handleChange(value);
        }
      }}
    >
      <ToggleGroupItem
        value={String(BillType.EXPEND)}
        className="cursor-pointer"
      >
        <HandCoins className="mr-2 h-4 w-4" /> 支出
      </ToggleGroupItem>
      <ToggleGroupItem
        value={String(BillType.INCOME)}
        className="cursor-pointer"
      >
        <DollarSign className="mr-2 h-4 w-4" />
        收入
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default SwitchType;
