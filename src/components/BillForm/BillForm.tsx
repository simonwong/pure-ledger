import React, { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { Button, DatePicker, Form, FormItem, Input } from "@easy-shadcn/react";
import { useMutationCreateBill, useMutationUpdateBill } from "@/store/bill";
import { BillType } from "@/domain/bill";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import SwitchType from "./SwitchType";
import FileUploader, { FileUploaderAction } from "../FileUploader";
import { Loader2 } from "lucide-react";
import { Bill } from "@/domain/bill";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "请输入账单名称",
    })
    .trim()
    .min(1, "至少输入1个字"),
  amount: z
    .number({
      required_error: "请输入金额",
      invalid_type_error: "请输入有效的金额",
    })
    .min(0, "最小金额填0")
    .safe("超出金额限制"),
  type: z.nativeEnum(BillType),
  date: z.date(),
  note: z.optional(z.string()),
  filePaths: z.array(z.any()).optional(),
});

type FormData = z.infer<typeof FormSchema>;

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
  const [loading, setLoading] = useState(false);
  const createBill = useMutationCreateBill();
  const updateBill = useMutationUpdateBill();

  const form = Form.useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: 0,
      type: defaultData?.type,
      date: new Date(),
      note: "",
    },
  });
  const type = form.watch("type");
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
      await createBill.mutateAsync({
        ...submitData,
        ledgerId,
      });
    }
    onFinish?.();
  };

  const handleConfirm = async (formData: FormData) => {
    setLoading(true);
    try {
      await handleSubmit?.(formData);
    } finally {
      setLoading(false);
    }
  };

  const typeText = type === BillType.EXPEND ? "支出" : "收入";

  return (
    <Form form={form} onSubmit={form.handleSubmit(handleConfirm)}>
      <div className="py-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <SwitchType
              value={type}
              onChange={(val) => {
                form.setValue("type", val);
              }}
            />
          </div>
          <div className="flex-1"></div>
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
      <div className="flex justify-end">
        <Button disabled={loading} type="submit">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          保存
        </Button>
      </div>
    </Form>
  );
};
