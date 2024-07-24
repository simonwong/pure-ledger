// import { useState } from "react";
// import { BillFormModal, BillFormModalProps } from "./BillFormModal";

// export const useLedgerFormModal = () => {
//   const [open, setOpen] = useState(false);
//   const [props, setProps] = useState<BillFormModalProps | null>(null);

//   const openLedgerFormModal = (props: BillFormModalProps | null = null) => {
//     setOpen(true);
//     setProps(props);
//   };

//   const handleClose = () => {
//     setProps(null);
//     setOpen(false);
//   };

//   return {
//     openLedgerFormModal,
//     ledgerFormModal: (
//       <BillFormModal
//         {...props}
//         open={open}
//         onOpenChange={(op) => {
//           setOpen(op);
//           if (op === false) {
//             setProps(null);
//           }
//         }}
//         onSubmit={() => {
//           handleClose();
//         }}
//       />
//     ),
//   };
// };
