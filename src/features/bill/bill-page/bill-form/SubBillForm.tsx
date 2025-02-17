import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { Button, DatePicker, Form, FormItem, Input, Modal } from '@easy-shadcn/react';
import { useMutationCreateBill, useMutationUpdateBill } from '@/store/bill';
import { BillType } from '@/domain/bill';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import FileUploader, { FileUploaderAction } from '@/components/FileUploader';
import { Bill } from '@/domain/bill';
import BigNumber from 'bignumber.js';
import { set } from 'date-fns';

const createDynamicFormSchema = (maxAmount: number, maxTip: string) => {
  return z.object({
    name: z
      .string({
        required_error: '请输入账单名称',
      })
      .trim()
      .min(1, '至少输入1个字'),
    amount: z
      .number({
        required_error: '请输入金额',
        invalid_type_error: '请输入有效的金额',
      })
      .min(0, '最小金额填0')
      .max(maxAmount, maxTip)
      .safe('超出金额限制'),
    type: z.nativeEnum(BillType),
    isInstallment: z.boolean(),
    date: z.date(),
    note: z.optional(z.string()),
    filePaths: z.array(z.any()).optional(),
  });
};

type FormData = z.infer<ReturnType<typeof createDynamicFormSchema>>;

export type SubBillFormProps = {
  onFinish?: () => void;
  parentBillData: Bill;
  data?: Bill;
};

export const SubBillFormModal = Modal.create(({ parentBillData, data }: SubBillFormProps) => {
  const { modalProps, hide } = Modal.useModal();

  const createBill = useMutationCreateBill();
  const updateBill = useMutationUpdateBill();

  const form = Form.useForm<FormData>({
    resolver: (...props) => {
      const resetAmount = BigNumber(parentBillData?.amount).minus(parentBillData?.actualAmount);
      let maxAmount = Number.MAX_SAFE_INTEGER;
      if (data) {
        maxAmount = resetAmount.plus(data.amount).toNumber();
      } else {
        maxAmount = resetAmount.toNumber();
      }
      return zodResolver(
        createDynamicFormSchema(
          maxAmount,
          `账单总金额为${parentBillData?.amount}，最多可输入${maxAmount}`
        )
      )(...props);
    },
    defaultValues: {
      name: '',
      amount: undefined,
      type: parentBillData?.type,
      date: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
      isInstallment: false,
      note: '',
    },
  });
  const type = form.watch('type');
  const isEdit = !!data;

  const fileUploadRef = useRef<FileUploaderAction>(null);

  useEffect(() => {
    if (data) {
      const { date, ...resetData } = data;
      form.reset({
        ...resetData,
        date: new Date(date),
      });
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const filePaths = fileUploadRef.current ? await fileUploadRef.current.fileChanged() : undefined;

    const submitData = {
      ...formData,
      date: format(formData.date, 'yyyy-MM-dd HH:mm:ss'),
      filePaths,
    };

    if (isEdit) {
      await updateBill.mutateAsync({
        ...data,
        ...submitData,
      });
    } else {
      await createBill.mutateAsync({
        ...submitData,
        type: parentBillData!.type,
        ledgerId: parentBillData!.ledgerId,
        parentBillId: parentBillData!.id,
      });
    }
    hide();
  };

  const handleConfirm = async (formData: FormData) => {
    await handleSubmit?.(formData);
  };

  const typeText = type === BillType.EXPEND ? '支出' : '收入';

  const prefixText = !!data ? '修改' : '新增';

  return (
    <Modal
      {...modalProps}
      title={`${prefixText}${parentBillData.name}子账单`}
      description={`${prefixText}${parentBillData.name}子账单，点击保存`}
      contentProps={{
        className: 'sm:max-w-[725px]',
      }}
      content={
        <Form form={form} onSubmit={(e) => e.preventDefault()}>
          <div className="py-4 space-y-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1"></div>
              <div className="flex-1"></div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <FormItem
                  control={form.control}
                  name="name"
                  label="账单名称"
                  render={({ field }) => <Input placeholder="请输入账单名称" {...field} />}
                />
                <FormItem
                  control={form.control}
                  name="amount"
                  label={`${typeText}金额`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="请输入金额"
                      {...field}
                      onChange={(event) => {
                        const val = event.target.value;
                        if (val === '') {
                          field.onChange(undefined);
                        } else {
                          field.onChange(+val);
                        }
                      }}
                    />
                  )}
                />
                <FormItem
                  control={form.control}
                  name="date"
                  label="时间"
                  render={({ field }) => (
                    <DatePicker
                      buttonClassName="w-full"
                      selected={field.value}
                      onSelect={(val) => {
                        if (val) {
                          field.onChange(val);
                        }
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex-1 space-y-4">
                <FormItem
                  control={form.control}
                  name="note"
                  label="备注"
                  render={({ field }) => <Input placeholder="请输入备注" {...field} />}
                />
                <FormItem
                  control={form.control}
                  name="filePaths"
                  label="文件"
                  render={({ field }) => (
                    <FileUploader
                      ref={fileUploadRef}
                      ledgerId={(parentBillData?.ledgerId || data?.ledgerId)!}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </Form>
      }
      footer={
        <div className="flex justify-end">
          <Button onClick={form.handleSubmit(handleConfirm)}>保存</Button>
        </div>
      }
    />
  );
});
