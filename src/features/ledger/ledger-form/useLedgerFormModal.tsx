import { useModal } from "@/hooks/useModal";
import { LedgerForm, LedgerFormProps } from "./LedgerForm";

export const useLedgerFormModal = () => {
  const [modalHost, actions] = useModal();

  return [
    modalHost,
    {
      open: (props?: LedgerFormProps) => {
        const isEdit = !!props?.data;

        actions.open({
          title: isEdit ? "修改账本" : "新的账本",
          description: `${isEdit ? "修改" : "新建"}你的账本，点击保存`,
          contentProps: {
            className: "sm:max-w-[425px]",
          },
          content: (
            <LedgerForm
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
