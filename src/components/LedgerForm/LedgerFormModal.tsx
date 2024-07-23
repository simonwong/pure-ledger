import { PropsWithChildren } from "react";
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
import { CreateLedger, Ledger } from "@/types";
import { DialogProps } from "@radix-ui/react-dialog";
import { useLedgerStore } from "@/store";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "请输入账本名称",
    })
    .trim()
    .min(1, "至少输入1个字"),
  remark: z.optional(z.string()),
});

type FormData = z.infer<typeof FormSchema>;

interface LedgerFormModalProps extends DialogProps {}

export const LedgerFormModal: React.FC<
  PropsWithChildren<LedgerFormModalProps>
> = ({ children, ...props }) => {
  const addLedger = useLedgerStore((state) => state.addLedger);
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: FormData) => {
    addLedger({
      ...data,
    });
  };

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新的账本</DialogTitle>
          <DialogDescription>新建你的账本，点击保存</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
