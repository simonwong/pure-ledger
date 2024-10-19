import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  FormItem,
  Input,
  Switch,
  toast,
  Tooltip,
} from '@easy-shadcn/react';
import { useMutationCreateBill, useMutationUpdateBill } from '@/store/bill';
import { BillType } from '@/domain/bill';
import { format } from 'date-fns';
import SwitchType from './SwitchType';
import FileUploader, { FileUploaderAction } from '@/components/FileUploader';
import { Bill } from '@/domain/bill';
import { BillFormData, useBillForm } from './form';
import { useMultipleBill } from './useMultipleBill';
import { CircleAlertIcon } from 'lucide-react';

export interface BillFormProps {
  ledgerId: number;
  data?: Bill;
  defaultData?: {
    type: BillType;
  };
  onFinish?: () => void;
}

export const BillForm: React.FC<BillFormProps> = ({ ledgerId, data, defaultData, onFinish }) => {
  const createBill = useMutationCreateBill();
  const updateBill = useMutationUpdateBill();
  const [currentData, setCurrentData] = useState(data);
  const [form] = useBillForm(defaultData);
  const type = form.watch('type');
  const isInstallment = form.watch('isInstallment');
  const isEdit = !!currentData;
  const fileUploadRef = useRef<FileUploaderAction>(null);
  const { submitAndAddSubBill, isSubmitAndAddSubBill, SubBillListNode } = useMultipleBill({
    isInstallment,
    isEdit,
    data: currentData,
    defaultIsMultiple: !!currentData?.subBills?.length,
    beforeOpenToSaveParent: () => form.handleSubmit((d) => handleSubmit(d, false, true))(),
  });

  useEffect(() => {
    if (data) {
      const { date, ...resetData } = data;
      form.reset({
        ...resetData,
        date: new Date(date),
      });
    }
    setCurrentData(data);
  }, [data]);

  const handleSubmit = async (
    formData: BillFormData,
    nextAddSub?: boolean,
    isOnlySave?: boolean
  ) => {
    const filePaths = fileUploadRef.current ? await fileUploadRef.current.fileChanged() : undefined;

    const submitData = {
      ...formData,
      date: format(formData.date, 'yyyy-MM-dd HH:mm:ss'),
      filePaths,
    };

    if (isEdit) {
      await updateBill.mutateAsync({
        ...currentData,
        ...submitData,
      });
    } else {
      const billId = await createBill.mutateAsync({
        ...submitData,
        ledgerId,
      });
      if (nextAddSub) {
        submitAndAddSubBill(billId);
      }
    }
    if (isOnlySave) {
      return;
    }
    onFinish?.();
  };

  const typeText = type === BillType.EXPEND ? '支出' : '收入';

  return (
    <Form form={form} onSubmit={(e) => e.preventDefault()}>
      <div className="py-4 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <SwitchType
              disabled={isEdit}
              value={type}
              onChange={(val) => {
                form.setValue('type', val);
              }}
            />
          </div>
          <div className="flex-1">
            <FormItem
              control={form.control}
              name="isInstallment"
              render={({ field }) => (
                <div className="flex gap-2 items-center">
                  <Switch
                    checked={field.value}
                    onCheckedChange={(val) => {
                      if (val) {
                        setCurrentData((dt) =>
                          dt
                            ? {
                                ...dt,
                                actualAmount: 0,
                              }
                            : undefined
                        );
                        field.onChange(val);
                      } else {
                        // TODO: actualAmount set
                        if (currentData?.subBills?.length) {
                          toast.info('当前存在子账单，请删除后再切换');
                        } else {
                          field.onChange(val);
                        }
                      }
                    }}
                    disabled={field.disabled}
                    label={`分多笔的账单`}
                  />
                  <Tooltip
                    content={
                      <div className="bg-white text-black dark:bg-black dark:text-primary-foreground">
                        <div>
                          开启分多笔的账单后，当前账单的金额不会计入统计，而是子账单的金额为准。
                        </div>
                        <div>在下方添加子账单</div>
                      </div>
                    }
                    delayDuration={300}
                  >
                    <CircleAlertIcon className="w-4 h-4 cursor-pointer" />
                  </Tooltip>
                </div>
              )}
            />
          </div>
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
                      field.onChange('');
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
                  ledgerId={ledgerId}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
      {SubBillListNode}
      <div className="flex justify-end space-x-2">
        <Button
          variant={isSubmitAndAddSubBill ? 'secondary' : 'default'}
          onClick={form.handleSubmit((d) => handleSubmit(d))}
        >
          保存
        </Button>
        {isSubmitAndAddSubBill && (
          <Button onClick={form.handleSubmit((d) => handleSubmit(d, true))}>
            保存并添加一个子账单
          </Button>
        )}
      </div>
    </Form>
  );
};
