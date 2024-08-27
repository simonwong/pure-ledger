import { PropsWithChildren } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogProps } from "@radix-ui/react-dialog";
import { FormModal } from "@/components/enhance/Modal";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLedgerStore } from "@/store";
import { Bill, BillType, CreateBill } from "@/types";
import SwitchType from "./SwitchType";
import DatePicker from "../enhance/DatePicker";
import { dateToString } from "../enhance/DatePicker/utils";
import FileUploader from "../FileUploader";
import { useAddBill, useUpdateBill } from "@/store/actionSet";

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
  createAt: z.date(),
  remark: z.optional(z.string()),
  remarkFiles: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof FormSchema>;

export interface BillFormModalProps extends DialogProps {
  data?: Bill;
  onSubmit?: () => void;
  defaultType: BillType;
}

export const BillFormModal: React.FC<PropsWithChildren<BillFormModalProps>> = ({
  children,
  data,
  onSubmit,
  defaultType,
  ...props
}) => {
  const currentSelectId = useLedgerStore((state) => state.currentSelectId)!;
  const addBill = useAddBill();
  const updateBill = useUpdateBill();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      createAt: new Date(),
    },
  });

  const type = form.watch("type");

  const isEdit = !!data;

  const handleSubmit = async (formData: FormData) => {
    const submitData: CreateBill = {
      ...formData,
      createAt: dateToString(formData.createAt),
    };
    if (isEdit) {
      updateBill({
        ...data,
        ...submitData,
      });
    } else {
      addBill({
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
            form.reset({ ...data, createAt: new Date(data.createAt) });
          } else {
            form.reset({ type: defaultType, createAt: new Date() });
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>账单名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入账单名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{typeText}金额</FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="createAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>时间</FormLabel>
                    <DatePicker {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>备注</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入备注" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remarkFiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>文件</FormLabel>
                    <FormControl>
                      <FileUploader
                        ledgerId={currentSelectId}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
