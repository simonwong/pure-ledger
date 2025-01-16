import * as React from 'react';
import { Button, DropdownMenu } from '@easy-shadcn/react';
import { LandPlotIcon } from 'lucide-react';
import { runPreviewSeed, runTestSeed } from '@/db/seed';

interface DevToolProps {}

const DevTool: React.FC<DevToolProps> = () => {
  return (
    <div className="fixed left-8 bottom-8">
      <DropdownMenu
        menu={[
          {
            name: '重置&生成预览数据',
            key: 'reset',
            onClick: () => runPreviewSeed(),
          },
          {
            name: '重置&生成测试数据',
            key: 'reset&gen',
            onClick: () => runTestSeed(),
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
