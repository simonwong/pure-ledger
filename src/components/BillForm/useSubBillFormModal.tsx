import { modalAction } from "@easy-shadcn/react";
import { SubBillForm, SubBillFormProps } from "./SubBillForm";

export const useSubBillFormModal = () => {
  return [
    {
      open: (props: SubBillFormProps, modalProps: { billName: string }) => {
        const prefixText = !!props.data ? "修改" : "新增";

        const currentModal = modalAction.open({
          title: `${prefixText}${modalProps.billName}子账单`,
          description: `${prefixText}${modalProps.billName}子账单，点击保存`,
          contentProps: {
            className: "sm:max-w-[725px]",
          },
          content: (
            <SubBillForm
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
