import { PropsWithChildren, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Modal, ModalProps } from "@easy-shadcn/react";
import { Form, FormItem, Input } from "@easy-shadcn/react";
import { LedgerDTO } from "@/types";
import {
  useMutationCreateLedger,
  useMutationUpdateLedger,
} from "@/store/ledger";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "请输入账本名称",
    })
    .trim()
    .min(1, "至少输入1个字"),
  note: z.optional(z.string()),
});

type FormData = z.infer<typeof FormSchema>;

const useLedgerFormProps = () => {
  const [open, setOpen] = useState(false);

  return {
    props: {
      open,
      onOpenChange: (op: boolean) => {
        setOpen(op);
      },
    },
    onSubmit: () => {
      setOpen(false);
    },
  };
};

export interface LedgerFormModalProps extends ModalProps {
  data?: LedgerDTO;
  onSubmit?: () => void;
}

export const LedgerFormModal: React.FC<
  PropsWithChildren<LedgerFormModalProps>
> = ({ children, data, onSubmit, ...props }) => {
  const form = Form.useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const updateMutation = useMutationUpdateLedger();
  const createMutation = useMutationCreateLedger();

  const innerForm = useLedgerFormProps();

  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      form.reset({ ...data });
    }
  }, [data]);

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateMutation.mutateAsync({
        ...data,
        ...formData,
      });
    } else {
      await createMutation.mutateAsync({
        ...formData,
      });
    }
    onSubmit?.();
    innerForm.onSubmit();
  };

  return (
    <Modal
      {...innerForm.props}
      {...props}
      title={isEdit ? "修改账本" : "新的账本"}
      description={`${isEdit ? "修改" : "新建"}你的账本，点击保存`}
      contentProps={{
        className: "sm:max-w-[425px]",
      }}
      content={
        <Form form={form}>
          <div className="py-4 space-y-6">
            <FormItem
              control={form.control}
              name="name"
              label="账本名称"
              description="这是你展示的账本名称"
              render={({ field }) => (
                <Input placeholder="请输入账本名称" {...field} />
              )}
            />
            <FormItem
              control={form.control}
              name="note"
              label="备注"
              description="进行一些备注，方便你记忆"
              render={({ field }) => (
                <Input placeholder="请输入备注" {...field} />
              )}
            />
          </div>
        </Form>
      }
      footer={
        <Button
          onClick={() => {
            form.handleSubmit(handleSubmit)();
          }}
        >
          保存
        </Button>
      }
    >
      {children}
    </Modal>
  );
};
