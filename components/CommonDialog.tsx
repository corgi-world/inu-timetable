import React from 'react';
import Dialog from '@mui/material/Dialog';

export function useDialog() {
  const [dialogState, setDialogState] = React.useState({ isOpen: false });

  const openDialog = () => {
    setDialogState({ isOpen: true });
  };

  const closeDialog = () => {
    setDialogState({ isOpen: false });
  };

  return { dialogState, openDialog, closeDialog };
}

interface IDialog {
  isOpen: boolean;
  handleClose: () => void;
  children: JSX.Element;
}

export function CommonDialog({ isOpen, handleClose, children }: IDialog) {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      {children}
    </Dialog>
  );
}
