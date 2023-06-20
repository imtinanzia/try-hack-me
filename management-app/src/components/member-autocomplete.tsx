import type { FC, SyntheticEvent } from 'react';
import { TextField, Stack, Autocomplete } from '@mui/material';
import { Member } from '../types';
import toast from 'react-hot-toast';
import { useDispatch } from '../store';
import { addMemberToCard } from '../slices';

interface MemberProps {
  options: Member[];
  cardId: string;
}

const MemberAutoComplete: FC<MemberProps> = (props) => {
  const { options, cardId } = props;
  const dispatch = useDispatch();

  const onMemberAdd = async (memberId: string): Promise<void> => {
    try {
      await dispatch(addMemberToCard(cardId, memberId));
      toast.success('Member added!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const onChange = (event: SyntheticEvent<Element, Event>, value: any) => {
    if (!value) {
      return null;
    }
    onMemberAdd(value?._id);
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

export default MemberAutoComplete;
