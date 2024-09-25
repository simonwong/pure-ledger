import { modalAction } from "@easy-shadcn/react";
import { BillForm, BillFormProps } from "./BillForm";

export const useBillFormModal = () => {
  return [
    {
      open: (props: BillFormProps) => {
        const prefixText = !!props.data ? "修改" : "新增";

        const currentModal = modalAction.open({
          title: `${prefixText}账单`,
          description: `${prefixText}账单，点击保存`,
          contentProps: {
            className: "sm:max-w-[725px]",
          },
          content: (
            <BillForm
              {...props}
              onFinish={() => {
                currentModal.close();
              }}
            />
          ),
        });
      },
    },
  ] as const;
};
