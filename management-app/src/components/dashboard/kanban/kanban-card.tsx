import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import {
  CheckIcon,
  ChatAltIcon,
  DocumentTextIcon,
  EyeIcon,
} from '../../../icons';
import toast from 'react-hot-toast';
import { useSelector } from '../../../store';
import type { RootState } from '../../../store';
import type { Card as CardType, Column, Member } from '../../../types';
import KanbanCardModal from './kanban-card-modal';
import Tags from '../../tags';
import { columnSelector, matchedData, priorityDecider } from '../../../utils';
import { unAssignPriority } from '../../../slices';
import { useDispatch } from '../../../store';

interface KanbanCardProps {
  cardId: string;
  dragging: boolean;
  index?: number;
  column: Column;
  style?: Record<any, any>;
}

interface PopulatedCard extends CardType {
  members: Member[];
}

const cardSelector = (state: RootState, cardId: string): PopulatedCard => {
  const { cards, members } = state.kanban;
  const card = cards.byId[cardId];

  return {
    ...card,
    members: card?.memberIds?.map((memberId: string) => members.byId[memberId]),
  };
};

const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>((props, ref) => {
  const { cardId, dragging, column, ...other } = props;
  const card = useSelector((state) => cardSelector(state, cardId));
  const state = useSelector((state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const onPriorityRemove = async (): Promise<void> => {
    try {
      await dispatch(unAssignPriority(card._id));
      toast.success('Priority removed!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const labels = columnSelector(state, 'labels');
  const selectedLabels = matchedData(labels, card.labelIds);

  return (
    <Box
      ref={ref}
      sx={{
        outline: 'none',
        py: 1,
      }}
      {...other}
    >
      <Card
        onClick={handleOpen}
        raised={dragging}
        sx={{
          ...(dragging && {
            backgroundColor: 'background.paper',
          }),
          '&:hover': {
            backgroundColor: 'background.default',
          },
        }}
        variant={dragging ? 'elevation' : 'outlined'}
      >
        {/* {card?.cover && <CardMedia image={card.cover} sx={{ height: 200 }} />} */}
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography color="textPrimary" variant="subtitle2">
              {card.name}
            </Typography>
            {card?.priority && (
              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  color={priorityDecider(card?.priority)}
                  variant="filled"
                  label={card?.priority}
                  onDelete={onPriorityRemove}
                />
              </Stack>
            )}
          </Box>

          {selectedLabels?.length > 0 && (
            <Box sx={{ my: 1 }}>
              <Tags labels={selectedLabels} cardId={card._id} />
            </Box>
          )}

          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              mt: 2,
              '& svg:not(:first-of-type)': {
                ml: 2,
              },
            }}
          >
            {card?.isSubscribed && <EyeIcon fontSize="small" />}
            {card?.attachments?.length > 0 && (
              <DocumentTextIcon fontSize="small" />
            )}
            {card?.checklists?.length > 0 && <CheckIcon fontSize="small" />}
            {card?.comments?.length > 0 && <ChatAltIcon fontSize="small" />}
            <Box sx={{ flexGrow: 1 }} />
            {card?.members?.length > 0 && (
              <AvatarGroup max={4}>
                {card?.members?.map((member) => (
                  <Avatar key={member._id} src={member?.avatar ?? ''} />
                ))}
              </AvatarGroup>
            )}
          </Box>
        </CardContent>
      </Card>

      <KanbanCardModal
        card={card}
        column={column}
        onClose={handleClose}
        open={open}
      />
    </Box>
  );
});

KanbanCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  dragging: PropTypes.bool.isRequired,
  index: PropTypes.number,
  // @ts-ignore
  column: PropTypes.object.isRequired,
  style: PropTypes.object,
};

KanbanCard.defaultProps = {
  dragging: true,
};

export default KanbanCard;
