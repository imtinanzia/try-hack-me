import type { FC, SyntheticEvent } from 'react';
import { TextField, Stack, Autocomplete } from '@mui/material';
import { Priority } from '../types';
import toast from 'react-hot-toast';
import { useDispatch } from '../store';
import { assignPriority } from '../slices';

interface PriorityProps {
  options: Priority[];
  cardId: string;
  handlePriorityToggle: () => void;
}

const PriorityAutoComplete: FC<PriorityProps> = (props) => {
  const { options, cardId, handlePriorityToggle } = props;
  const dispatch = useDispatch();

  const onPriorityAdd = async (priority: Priority): Promise<void> => {
    try {
      await dispatch(assignPriority(cardId, priority));
      toast.success('Priority added!');
      handlePriorityToggle();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const onChange = (event: SyntheticEvent<Element, Event>, value: any) => {
    if (!value) {
      return null;
    }
    onPriorityAdd(value);
  };
  return (
    <Stack>
      <Autocomplete
        id="multiple-limit-tags"
        onChange={onChange}
        options={options}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField value={null} {...params} label="Members" />
        )}
      />
    </Stack>
  );
};

export default PriorityAutoComplete;
