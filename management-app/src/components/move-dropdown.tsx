import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import type { Column } from '../types';

interface MoveDropdownProps {
  columns: Column[];
  column: Column;
  onChange: (event: SelectChangeEvent<string>) => void;
}

const MoveDropdown: React.FC<MoveDropdownProps> = ({
  columns,
  onChange,
  column,
}) => {
  console.log(columns);
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>Move to Column</InputLabel>
      <Select
        defaultValue={column.name}
        value={column._id}
        onChange={onChange}
        label="Move to Column"
      >
        {columns?.map((column) => (
          <MenuItem key={column._id} value={column._id}>
            {column.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MoveDropdown;
