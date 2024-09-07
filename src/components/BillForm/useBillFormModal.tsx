import { useModal } from "@/hooks/useModal";
import { BillForm, BillFormProps } from "./BillForm";

export const useBillFormModal = () => {
  const [modalHost, actions] = useModal();

  return [
    modalHost,
    {
      open: (props: BillFormProps) => {
        const prefixText = !!props.data ? "修改" : "新增";

        actions.open({
          title: `${prefixText}账单`,
          description: `${prefixText}账单，点击保存`,
          contentProps: {
            className: "sm:max-w-[725px]",
          },
          content: (
            <BillForm
              {...props}
              onFinish={() => {
                actions.close();
              }}
            />
          ),
        });
      },
      close: () => {
        actions.close();
      },
    },
  ] as const;
};
