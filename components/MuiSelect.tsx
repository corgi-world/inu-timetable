import React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const MenuProps = {
  style: {
    maxHeight: 355,
  },
};

interface IMuiSelect {
  items: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function MuiSelect({ items, value, onChange }: IMuiSelect) {
  const handleSelectChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    onChange(value);
  };

  const sx = { fontSize: '15px', fontFamily: 'Nanum Gothic' };

  return (
    <Select
      sx={sx}
      size='small'
      value={value}
      onChange={handleSelectChange}
      MenuProps={MenuProps}
    >
      {items.map((item: string) => (
        <MenuItem key={item} value={item} sx={sx}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );
}
