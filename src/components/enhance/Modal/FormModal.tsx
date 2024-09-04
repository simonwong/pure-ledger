import { ReactNode, useState } from "react";
import { Button, Form, FormProps, Modal, ModalProps } from "@easy-shadcn/react";
import { FieldValues } from "react-hook-form";
import { cn } from "@easy-shadcn/utils";
import { Loader2 } from "lucide-react";

export interface FormModalProps<T extends FieldValues = FieldValues>
  extends ModalProps {
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
    <Modal
      open={open}
      onOpenChange={(op) => {
        setOpen(op);
        onOpenChange?.(op);
      }}
      title={title}
      description={desc}
      contentProps={{
        className: cn("sm:max-w-[425px]", contentClassName),
      }}
      content={
        <Form form={form} onSubmit={form.handleSubmit(handleConfirm)}>
          {content}
        </Form>
      }
      footer={
        <Button disabled={loading} type="submit">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          保存
        </Button>
      }
      {...props}
    >
      {trigger}
    </Modal>
  );
};

export default FormModal;
