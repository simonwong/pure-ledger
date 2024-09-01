import React, { PropsWithChildren, ReactNode, useState } from "react";
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
import { Button } from "@easy-shadcn/react";

export interface ModalProps extends DialogProps {
  title?: ReactNode;
  desc?: ReactNode;
  content?: ReactNode;
  onConfirm?: () => Promise<void> | void;
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  title,
  desc,
  content,
  children,
  onConfirm,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button onClick={handleConfirm} type="submit">
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
