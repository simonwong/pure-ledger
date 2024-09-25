import { BillType } from "@/domain/bill";
import { Form } from "@easy-shadcn/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const BillFormSchema = z.object({
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

export type BillFormData = z.infer<typeof BillFormSchema>;

export const useBillForm = (defaultData?: Partial<BillFormData>) => {
  const form = Form.useForm<BillFormData>({
    resolver: zodResolver(BillFormSchema),
    defaultValues: {
      name: "",
      amount: 0,
      date: new Date(),
      note: "",
      ...defaultData,
    },
  });

  return [form];
};
