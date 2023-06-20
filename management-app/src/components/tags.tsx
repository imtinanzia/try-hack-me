import type { FC } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Label } from '../types';
import { useDispatch } from '../store';
import toast from 'react-hot-toast';
import { removeLabelFromCard } from '../slices';

interface TagProps {
  labels: Label[];
  cardId: string;
}

const Tags: FC<TagProps> = ({ labels, cardId }) => {
  const dispatch = useDispatch();

  const handleDelete = (labelId: string) => async (): Promise<void> => {
    try {
      await dispatch(removeLabelFromCard(cardId, labelId));
      toast.success('Label removed!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      {labels?.map((label: Label) => (
        <Chip
          key={label._id}
          color="primary"
          size="small"
          label={label.name}
          onDelete={handleDelete(label._id)}
        />
      ))}
    </Stack>
  );
};

export default Tags;
