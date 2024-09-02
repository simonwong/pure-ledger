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
import { Button, Form, FormProps } from "@easy-shadcn/react";
import { FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface FormModalProps<T extends FieldValues = FieldValues>
  extends DialogProps {
  trigger?: ReactNode;
  title?: ReactNode;
  desc?: ReactNode;
  content?: ReactNode;
  onConfirm?: (formData: T) => Promise<void> | void;
  form: FormProps<T>["form"];
  contentClassName?: string;
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
  contentClassName,
  ...props
}: FormModalProps<T>) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (formData: T) => {
    setLoading(true);
    try {
      await onConfirm?.(formData);
      setOpen(false);
    } finally {
      setLoading(false);
    }
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
      <DialogContent className={cn("sm:max-w-[425px]", contentClassName)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={form.handleSubmit(handleConfirm)}>
          {content}
          <DialogFooter>
            <Button disabled={loading} type="submit">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              保存
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
