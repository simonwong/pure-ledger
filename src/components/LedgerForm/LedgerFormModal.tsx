import { PropsWithChildren, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogProps } from "@radix-ui/react-dialog";
import { Ledger } from "@/types";
import {
  useMutationCreateLedger,
  useMutationUpdateLedger,
} from "@/store/db/ledger";

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

export interface LedgerFormModalProps extends DialogProps {
  data?: Ledger;
  onSubmit?: () => void;
}

export const LedgerFormModal: React.FC<
  PropsWithChildren<LedgerFormModalProps>
> = ({ children, data, onSubmit, ...props }) => {
  const form = useForm<FormData>({
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
    <Dialog {...innerForm.props} {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "修改账本" : "新的账本"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "修改" : "新建"}你的账本，点击保存
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="py-4 space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>账本名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入账本名称" {...field} />
                    </FormControl>
                    <FormDescription>这是你展示的账本名称</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
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
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
