import { PropsWithChildren } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogProps } from "@radix-ui/react-dialog";
import { FormModal } from "@/components/enhance/Modal";
import { Form, FormItem, Input, DatePicker } from "@easy-shadcn/react";
import { BillTDO, BillType, CreateBillInput } from "@/types";
import SwitchType from "./SwitchType";
import FileUploader from "../FileUploader";
import { useMutationCreateBill, useMutationUpdateBill } from "@/store/bill";
import { useGlobalStore } from "@/store/global";
import { format } from "date-fns";

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
  file_path: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof FormSchema>;

export interface BillFormModalProps extends DialogProps {
  ledgerId: number;
  data?: BillTDO;
  onSubmit?: () => void;
  defaultType: BillType;
}

export const BillFormModal: React.FC<PropsWithChildren<BillFormModalProps>> = ({
  children,
  ledgerId,
  data,
  onSubmit,
  defaultType,
  ...props
}) => {
  const currentSelectId = useGlobalStore((state) => state.currentLedgerId);
  const createBill = useMutationCreateBill();
  const updateBill = useMutationUpdateBill();

  const form = Form.useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const type = form.watch("type");

  const isEdit = !!data;

  const handleSubmit = async (formData: FormData) => {
    const submitData: CreateBillInput = {
      ...formData,
      ledger_id: ledgerId,
      date: format(formData.date, "yyyy-MM-dd HH:mm:ss"),
      file_path: formData.file_path?.join(","),
    };

    if (isEdit) {
      await updateBill.mutateAsync({
        ...data,
        ...submitData,
      });
    } else {
      await createBill.mutateAsync({
        ...submitData,
      });
    }
    onSubmit?.();
  };

  const typeText = type === BillType.EXPEND ? "支出" : "收入";
  const prefixText = isEdit ? "修改" : "新增";

  return (
    <FormModal
      trigger={children}
      title={`${prefixText}${typeText}账单`}
      desc={`${prefixText}${typeText}账单，点击保存`}
      form={form}
      onConfirm={handleSubmit}
      onOpenChange={(op) => {
        if (op) {
          if (data) {
            const { file_path, date, ...resetData } = data;
            form.reset({
              ...resetData,
              date: new Date(date),
              file_path: file_path?.split(","),
            });
          } else {
            form.reset({ type: defaultType, date: new Date() });
          }
        }
      }}
      contentClassName="sm:max-w-[725px]"
      content={
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
                    onSelect={field.onChange}
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
                name="file_path"
                label="文件"
                render={({ field }) => (
                  <FileUploader
                    ledgerId={currentSelectId!}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>
      }
      {...props}
    />
  );
};
