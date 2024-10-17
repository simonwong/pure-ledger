import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, modalAction } from '@easy-shadcn/react';
import { Form, FormItem, Input } from '@easy-shadcn/react';
import { useMutationCreateLedger, useMutationUpdateLedger } from '@/store/ledger';
import { Ledger } from '@/domain/ledger';

const FormSchema = z.object({
  name: z
    .string({
      required_error: '请输入账本名称',
    })
    .trim()
    .min(1, '至少输入1个字'),
  note: z.optional(z.string()),
});

type FormData = z.infer<typeof FormSchema>;

export interface LedgerFormProps {
  data?: Ledger;
  onFinish?: () => void;
}

export const LedgerForm: React.FC<LedgerFormProps> = ({ data, onFinish }) => {
  const form = Form.useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      note: '',
    },
  });

  const updateMutation = useMutationUpdateLedger();
  const createMutation = useMutationCreateLedger();

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
    onFinish?.();
  };

  return (
    <Form
      form={form}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="py-4 space-y-6">
        <FormItem
          control={form.control}
          name="name"
          label="账本名称"
          description="这是你展示的账本名称"
          render={({ field }) => <Input placeholder="请输入账本名称" {...field} />}
        />
        <FormItem
          control={form.control}
          name="note"
          label="备注"
          description="进行一些备注，方便你记忆"
          render={({ field }) => <Input placeholder="请输入备注" {...field} />}
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={async () => {
            await form.handleSubmit(handleSubmit)();
          }}
        >
          保存
        </Button>
      </div>
    </Form>
  );
};

export const LedgerFormAction = {
  open: (props?: LedgerFormProps) => {
    const isEdit = !!props?.data;
    const actionIns = modalAction.open({
      title: isEdit ? '修改账本' : '新的账本',
      description: `${isEdit ? '修改' : '新建'}你的账本，点击保存`,
      contentProps: {
        className: 'sm:max-w-[425px]',
      },
      content: (
        <LedgerForm
          {...props}
          onFinish={() => {
            actionIns.close();
          }}
        />
      ),
    });
    return actionIns;
  },
};
