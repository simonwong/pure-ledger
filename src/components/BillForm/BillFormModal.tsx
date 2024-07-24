import { PropsWithChildren } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogProps } from "@radix-ui/react-dialog";
import { FormModal } from "@/components/enhance/Modal";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBillStore } from "@/store";
import { BillType, Ledger } from "@/types";
import SwitchType from "./SwitchType";

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
  remark: z.optional(z.string()),
});

type FormData = z.infer<typeof FormSchema>;

export interface BillFormModalProps extends DialogProps {
  data?: Ledger;
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
  const addBill = useBillStore((state) => state.addBill);
  const updateBill = useBillStore((state) => state.updateBill);
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const type = form.watch("type");

  const isEdit = !!data;

  const handleSubmit = (formData: FormData) => {
    if (isEdit) {
      updateBill({
        ...data,
        ...formData,
      });
    } else {
      addBill({
        ...formData,
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
            form.reset({ type: defaultType, ...data });
          } else {
            form.reset({ type: defaultType });
          }
        }
      }}
      content={
        <div className="py-4 space-y-6">
          <SwitchType
            value={type}
            onChange={(val) => {
              form.setValue("type", val);
            }}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>账单名称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入账单名称" {...field} />
                </FormControl>
                <FormDescription>这是你展示的账单名称</FormDescription>
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
                <FormDescription>看看你{typeText}多少金额</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>备注</FormLabel>
                <FormControl>
                  <Input placeholder="请输入备注" {...field} />
                </FormControl>
                <FormDescription>进行一些备注，方便你记忆</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      }
      {...props}
    />
  );
};
