import React from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';

interface IMUITextField {
  placeholder: string;
  fontSize: number;
  value: string;
  onChange: (value: string) => void;
}

export default function MUITextField({
  placeholder,
  fontSize,
  value,
  onChange,
}: IMUITextField) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    onChange(value);
  };
  return (
    <StyledTextField
      size='small'
      placeholder={placeholder}
      InputProps={{ style: { fontSize, fontFamily: 'Nanum Gothic' } }}
      value={value}
      onChange={handleChange}
      autoComplete='off'
    />
  );
}

const StyledTextField = styled(TextField)`
  width: 100%;
`;
