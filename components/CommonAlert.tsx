import React, { useState } from 'react';
import styled from 'styled-components';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';

interface IAlert {
  isOpen: boolean;
  isError: boolean;
  message: string;
  handleClose: () => void;
}

export function useAlert() {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    isError: false,
    message: '',
  });

  const openAlert = (isError: boolean, message: string) => {
    setAlertState({ isOpen: true, isError, message });
  };
  const closeAlert = (action?: () => void) => {
    setAlertState((prev) => {
      return { isOpen: false, isError: prev.isError, message: prev.message };
    });

    if (action instanceof Function) {
      action();
    }
  };

  return { alertState, openAlert, closeAlert };
}

export function CommonAlert({ isOpen, isError, message, handleClose }: IAlert) {
  return (
    <Wrapper>
      <Collapse in={isOpen}>
        <Alert severity={isError ? 'error' : 'success'} onClose={handleClose}>
          {message}
        </Alert>
      </Collapse>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  bottom: 10px;
  width: 100%;
  @media (min-width: ${({ theme: { size } }) => size.mobile}) {
    width: 380px;
  }
`;
