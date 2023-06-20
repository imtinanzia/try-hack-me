import { useState } from 'react';
import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { Box, Button, Card, Chip, Divider, Input } from '@mui/material';
import { SearchIcon } from '../icons';
import MultiSelect from './multi-select';
import { useSelector, useDispatch } from '../store';
import { Label, Member, Priority } from '../types';
import { columnSelector } from '../utils';
import { filterTasks, getBoard } from '../slices';
import toast from 'react-hot-toast';

const createFilterSchema = (
  labels: Label[],
  priority: Priority[],
  members: Member[]
) => {
  const filters = [
    {
      label: 'Labels',
      options: labels?.map((label: Label) => {
        return {
          id: label._id,
          name: label.name,
          type: 'labels',
        };
      }),
    },
    {
      label: 'Priority',
      options: priority?.map((item: Priority) => {
        return {
          id: item._id,
          name: item.name,
          type: 'priority',
        };
      }),
    },

    {
      label: 'Members',
      options: members?.map((member: Member) => {
        return {
          id: member._id,
          name: member.name,
          type: 'members',
        };
      }),
    },
  ];

  return filters;
};

interface FieldProps {
  labelIds: string[];
  memberIds: string[];
  priority: string[];
  name: string[];
}

enum Labels {
  LABELS = 'LABELS',
  MEMBERS = 'MEMBERS',
  PRIORITY = 'PRIORITY',
}

const Filter: FC = (props) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>('');
  const [chips, setChips] = useState<string[]>([]);
  const [fields, setFields] = useState<FieldProps>({
    labelIds: [],
    memberIds: [],
    priority: [],
    name: [],
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setInputValue(value);
  };

  const handleInputKeyup = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.code.toUpperCase() === 'ENTER' && inputValue) {
      if (!chips.includes(inputValue)) {
        setFields((prevFields) => ({
          ...prevFields,
          name: prevFields.name.includes(inputValue)
            ? prevFields.name
            : [...prevFields.name, inputValue],
        }));
        setChips((prevChips) => [...prevChips, inputValue]);
        setInputValue('');
      }
    }
  };

  const handleChipDelete = (chip: string): void => {
    setChips((prevChips) => prevChips.filter((prevChip) => chip !== prevChip));
  };

  const handleMultiSelectChange = (value: string[], option: any): void => {
    console.log(option);
    if (option.type.toUpperCase() === Labels.LABELS.toUpperCase()) {
      setFields((prevFields) => ({
        ...prevFields,
        labelIds: prevFields.labelIds.includes(option?.id)
          ? prevFields.labelIds.filter((id) => id !== option?.id)
          : [...prevFields.labelIds, option?.id],
      }));
    } else if (option.type.toUpperCase() === Labels.MEMBERS.toUpperCase()) {
      console.log(option.type, 'dat');
      setFields((prevFields) => ({
        ...prevFields,
        memberIds: prevFields.memberIds.includes(option?.id)
          ? prevFields.memberIds.filter((id) => id !== option?.id)
          : [...prevFields.memberIds, option?.id],
      }));
    } else {
      setFields((prevFields) => ({
        ...prevFields,
        priority: prevFields.priority.includes(option?.name)
          ? prevFields.priority.filter((name) => name !== option?.name)
          : [...prevFields.priority, option?.name],
      }));
    }

    setChips(value);
  };

  const options = createFilterSchema(
    columnSelector(state, 'labels'),
    columnSelector(state, 'priority'),
    columnSelector(state, 'members')
  );

  const onFilterSubmit = async (): Promise<void> => {
    try {
      await dispatch(
        filterTasks(
          fields.labelIds,
          fields.memberIds,
          fields.priority,
          fields.name
        )
      );

      toast.success('Filtered!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleFilterReset = async (): Promise<void> => {
    try {
      await dispatch(getBoard());
      setFields({
        labelIds: [],
        memberIds: [],
        name: [],
        priority: [],
      });
      setChips([]);
      toast.success('Reset!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Card {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 2,
        }}
      >
        <SearchIcon fontSize="small" />
        <Box
          sx={{
            flexGrow: 1,
            ml: 3,
          }}
        >
          <Input
            disableUnderline
            fullWidth
            onChange={handleInputChange}
            onKeyUp={handleInputKeyup}
            placeholder="Enter a keyword"
            value={inputValue}
          />
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          p: 2,
        }}
      >
        {chips?.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            onDelete={(): void => handleChipDelete(chip)}
            sx={{ m: 1 }}
            variant="outlined"
          />
        ))}
      </Box>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {options?.map((option) => (
            <MultiSelect
              key={option.label}
              label={option.label}
              onChange={handleMultiSelectChange}
              options={option.options}
              value={chips}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={handleFilterReset} color="error" variant="outlined">
            Reset
          </Button>
          <Button onClick={onFilterSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default Filter;
