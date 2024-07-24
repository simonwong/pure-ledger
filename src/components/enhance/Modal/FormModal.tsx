import { ReactNode, useState } from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Button from "@/components/enhance/Button";
import { Form } from "@/components/ui/form";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface FormModalProps<T extends FieldValues = FieldValues>
  extends DialogProps {
  trigger?: ReactNode;
  title?: ReactNode;
  desc?: ReactNode;
  content?: ReactNode;
  onConfirm?: (formData: T) => Promise<void> | void;
  form: UseFormReturn<T, any, undefined>;
}

const FormModal = <T extends FieldValues = FieldValues>({
  trigger,
  title,
  desc,
  content,
  children,
  onConfirm,
  form,
  onOpenChange,
  ...props
}: FormModalProps<T>) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async (formData: T) => {
    await onConfirm?.(formData);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(op) => {
        setOpen(op);
        onOpenChange?.(op);
      }}
      {...props}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleConfirm)}>
            {content}
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
