import React, { useEffect, useRef } from "react";
import { Button, DatePicker, Form, FormItem, Input } from "@easy-shadcn/react";
import { useMutationCreateBill, useMutationUpdateBill } from "@/store/bill";
import { BillType } from "@/domain/bill";
import { format } from "date-fns";
import SwitchType from "./SwitchType";
import FileUploader, { FileUploaderAction } from "../FileUploader";
import { Bill } from "@/domain/bill";
import { BillFormData, useBillForm } from "./form";
import { useMultipleBill } from "./useMultipleBill";

export interface BillFormProps {
  ledgerId: number;
  data?: Bill;
  defaultData?: {
    type: BillType;
  };
  onFinish?: () => void;
}

export const BillForm: React.FC<BillFormProps> = ({
  ledgerId,
  data,
  defaultData,
  onFinish,
}) => {
  const createBill = useMutationCreateBill();
  const updateBill = useMutationUpdateBill();
  const [form] = useBillForm(defaultData);
  const type = form.watch("type");
  const isEdit = !!data;
  const fileUploadRef = useRef<FileUploaderAction>(null);
  const {
    MultipleBillSwitch,
    submitAndAddSubBill,
    isSubmitAndAddSubBill,
    SubBillListNode,
  } = useMultipleBill({
    isEdit,
    data,
    defaultIsMultiple: !!data?.subBills?.length,
  });

  useEffect(() => {
    if (data) {
      const { date, ...resetData } = data;
      form.reset({
        ...resetData,
        date: new Date(date),
      });
    }
  }, []);

  const handleSubmit = async (formData: BillFormData) => {
    const filePaths = fileUploadRef.current
      ? await fileUploadRef.current.fileChanged()
      : undefined;

    const submitData = {
      ...formData,
      date: format(formData.date, "yyyy-MM-dd HH:mm:ss"),
      filePaths,
    };

    if (isEdit) {
      await updateBill.mutateAsync({
        ...data,
        ...submitData,
      });
    } else {
      const billId = await createBill.mutateAsync({
        ...submitData,
        ledgerId,
      });
      submitAndAddSubBill(billId);
    }

    onFinish?.();
  };

  const typeText = type === BillType.EXPEND ? "支出" : "收入";

  return (
    <Form form={form} onSubmit={(e) => e.preventDefault()}>
      <div className="py-4 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <SwitchType
              disabled={isEdit}
              value={type}
              onChange={(val) => {
                form.setValue("type", val);
              }}
            />
          </div>
          <div className="flex-1">{MultipleBillSwitch}</div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 space-y-4">
            <FormItem
              control={form.control}
              name="name"
              label="账单名称"
              render={({ field }) => (
                <Input placeholder="请输入账单名称" {...field} />
              )}
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
                    if (val === "") {
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
              render={({ field }) => (
                <Input placeholder="请输入备注" {...field} />
              )}
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
        <Button onClick={form.handleSubmit(handleSubmit)}>
          保存{isSubmitAndAddSubBill && "并添加子账单"}
        </Button>
      </div>
    </Form>
  );
};
