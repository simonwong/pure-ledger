import { useState } from "react";
import { LedgerFormModal, LedgerFormModalProps } from "./LedgerFormModal";

export const useLedgerFormModal = () => {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<LedgerFormModalProps | null>(null);

  const openLedgerFormModal = (props: LedgerFormModalProps | null = null) => {
    setOpen(true);
    setProps(props);
  };

  const handleClose = () => {
    setProps(null);
    setOpen(false);
  };

  return {
    openLedgerFormModal,
    ledgerFormModal: (
      <LedgerFormModal
        {...props}
        open={open}
        onOpenChange={(op) => {
          setOpen(op);
          if (op === false) {
            setProps(null);
          }
        }}
        onSubmit={() => {
          handleClose();
        }}
      />
    ),
  };
};
