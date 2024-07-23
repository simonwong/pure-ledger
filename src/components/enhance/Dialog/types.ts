import { ReactNode } from "react";

export type DialogState = {
  title?: ReactNode;
  content?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
};
