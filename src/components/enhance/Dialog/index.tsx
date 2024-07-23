import { useEffect, useState } from "react";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ToastState, dialog } from "./state";
import { DialogState } from "./types";

const Dialog = () => {
  const [
    { title, content, confirmText, onConfirm, cancelText, onCancel },
    setDialog,
  ] = useState<DialogState>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = ToastState.subscribe((state) => {
      setDialog(state);
      setOpen(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setDialog({});
  };

  return (
    <AlertDialog
      onOpenChange={(op) => {
        setOpen(op);
        if (op === false) {
          setDialog({});
        }
      }}
      open={open}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {content && (
            <AlertDialogDescription>{content}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel?.();
              handleClose();
            }}
          >
            {cancelText || "取消"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm?.();
              handleClose();
            }}
          >
            {confirmText || "确认"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { dialog, Dialog, type ToastState };
