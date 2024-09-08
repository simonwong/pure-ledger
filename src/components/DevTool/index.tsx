import { Button, DropdownMenu } from "@easy-shadcn/react";
import * as React from "react";
import { resetAndInit } from "./seeds";
import { LandPlotIcon } from "lucide-react";

interface DevToolProps {}

const DevTool: React.FC<DevToolProps> = () => {
  const handleResetAndGen = async () => {
    await resetAndInit();
  };

  return (
    <div className="fixed left-8 bottom-8">
      <DropdownMenu
        menu={[
          {
            name: "重制&生成测试数据",
            key: "reset&gen",
            onClick: handleResetAndGen,
          },
        ]}
      >
        <Button size="icon" variant="secondary">
          <LandPlotIcon />
        </Button>
      </DropdownMenu>
    </div>
  );
};

export default DevTool;
