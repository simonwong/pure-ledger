import { modalAction, useModalAction } from "@easy-shadcn/react";
import { SubBillForm, SubBillFormProps } from "./SubBillForm";
import { BillForm, BillFormProps } from "./BillForm";

export const useBillFormModal = (props: BillFormProps, deps: any[]) => {
  const prefixText = !!props.data ? "修改" : "新增";

  const [hookModalAction, modalInstanceRef] = useModalAction(
    {
      title: `${prefixText}账单`,
      description: `${prefixText}账单，点击保存`,
      contentProps: {
        className: "sm:max-w-[725px]",
      },
      content: (
        <BillForm
          {...props}
          onFinish={() => {
            modalInstanceRef.current?.close();
          }}
        />
      ),
    },
    deps
  );

  return {
    open: () => {
      hookModalAction.open();
    },
  };
};

export const BillFormModal = {
  open: (props: BillFormProps) => {
    const prefixText = !!props.data ? "修改" : "新增";

    const modalInstance = modalAction.open({
      title: `${prefixText}账单`,
      description: `${prefixText}账单，点击保存`,
      contentProps: {
        className: "sm:max-w-[725px]",
      },
      content: (
        <BillForm
          {...props}
          onFinish={() => {
            modalInstance.close();
          }}
        />
      ),
    });
  },
};

export const SubBillFormModal = {
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
};
