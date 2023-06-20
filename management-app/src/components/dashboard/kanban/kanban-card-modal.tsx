import type { FC } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';
import {
  Box,
  Dialog,
  Divider,
  Grid,
  SelectChangeEvent,
  TextField,
  Typography,
  AvatarGroup,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import {
  EyeIcon,
  EyeOffIcon,
  UsersIcon,
  ArchiveIcon,
  ArrowRightIcon,
  CheckIcon,
  DuplicateIcon,
} from '../../../icons';
import {
  addChecklist,
  deleteCard,
  updateCard,
  copyCard,
  moveCardToColumn,
  unAssignPriority,
} from '../../../slices';
import { useSelector, useDispatch } from '../../../store';
import type { Card, Column } from '../../../types';
import KanbanCardAction from './kanban-card-action';
import KanbanChecklist from './kanban-checklist';
import KanbanComment from './kanban-comment';
import KanbanCommentAdd from './kanban-comment-add';
import MoveDropdown from '../../move-dropdown';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Tags from '../../tags';
import LabelAutoComplete from '../../label-autocomplete';
import MemberAutoComplete from '../../member-autocomplete';
import { columnSelector, matchedData, priorityDecider } from '../../../utils';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PriorityAutoComplete from '../../priority-autocomplete';

interface KanbanCardModalProps {
  card: Card;
  column: Column;
  onClose?: () => void;
  open: boolean;
}

const KanbanCardModal: FC<KanbanCardModalProps> = (props) => {
  const state = useSelector((state) => state);
  const { card, column, onClose, open, ...other } = props;
  const [isMoveDropdownOpen, setIsMoveDropdownOpen] = useState<boolean>(false);
  const [isLabelDropdownOpen, setIsLabelDropdownOpen] =
    useState<boolean>(false);
  const [isMemberOpen, setIsMemberOpen] = useState<boolean>(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleMoveToggle = (): void => {
    setIsMoveDropdownOpen((prevState: boolean) => !prevState);
  };
  const handleLabelToggle = (): void => {
    setIsLabelDropdownOpen((prevState: boolean) => !prevState);
  };
  const handleMemberToggle = (): void => {
    setIsMemberOpen((prevState: boolean) => !prevState);
  };
  const handlePriorityToggle = (): void => {
    setIsPriorityOpen((prevState: boolean) => !prevState);
  };

  const handleDetailsUpdate = debounce(async (update): Promise<void> => {
    try {
      await dispatch(updateCard(card._id, update));
      toast.success('Card updated!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }, 1000);

  const handleSubscribe = async (): Promise<void> => {
    try {
      await dispatch(updateCard(card._id, { isSubscribed: true }));
      toast.success('Unsubscribed!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleUnsubscribe = async (): Promise<void> => {
    try {
      await dispatch(updateCard(card._id, { isSubscribed: false }));
      toast.success('Subscribed!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteCard(card._id));
      toast.success('Card deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleAddChecklist = async (): Promise<void> => {
    try {
      await dispatch(addChecklist(card._id, 'Untitled Checklist'));
      toast.success('Checklist added!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };
  const handleCopyCard = async (): Promise<void> => {
    try {
      await dispatch(copyCard(card._id));
      toast.success('Card copied');
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleMove = async (
    event: SelectChangeEvent<string>
  ): Promise<void> => {
    const { value } = event.target;
    try {
      await dispatch(moveCardToColumn(card._id, value));
      toast.success('Card moved');
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
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

  const columns = columnSelector(state, 'columns');
  const labels = columnSelector(state, 'labels');
  const members = columnSelector(state, 'members');
  const priority = columnSelector(state, 'priority');

  const selectedLabels = matchedData(labels, card?.labelIds);
  const selectedMembers = matchedData(members, card?.memberIds);

  console.log();
  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open} {...other}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={5}>
          <Grid item sm={8} xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              {selectedLabels?.length > 0 && (
                <Box>
                  <Tags labels={selectedLabels} cardId={card._id} />
                </Box>
              )}

              <Box sx={{ flexGrow: 1 }} />

              {selectedMembers?.length > 0 && (
                <AvatarGroup max={4}>
                  {selectedMembers?.map((member) => (
                    <Avatar key={member._id} src={member?.avatar ?? ''} />
                  ))}
                </AvatarGroup>
              )}
            </Box>

            <TextField
              defaultValue={card.name}
              fullWidth
              label="Title"
              onChange={(event): Promise<void> =>
                handleDetailsUpdate({ name: event.target.value }) as any
              }
              variant="outlined"
            />
            <Box sx={{ mt: 3 }}>
              <TextField
                defaultValue={card.description}
                fullWidth
                multiline
                onChange={(event): Promise<void> =>
                  handleDetailsUpdate({
                    description: event.target.value,
                  }) as any
                }
                placeholder="Leave a message"
                label="Description"
                rows={6}
                variant="outlined"
              />
            </Box>
            {card?.checklists?.length > 0 && (
              <Box sx={{ mt: 5 }}>
                {card?.checklists?.map((checklist) => (
                  <KanbanChecklist
                    card={card}
                    checklist={checklist}
                    key={checklist._id}
                    sx={{ mb: 3 }}
                  />
                ))}
              </Box>
            )}
            <Box sx={{ mt: 3 }}>
              <Typography color="textPrimary" variant="h6">
                Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <KanbanCommentAdd cardId={card?._id ?? ''} />
                {card.comments?.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    {card?.comments?.map((comment) => (
                      <KanbanComment
                        replies={comment?.replies ?? []}
                        cardId={card._id}
                        createdAt={comment?.createdAt}
                        key={comment._id}
                        memberId={comment?.memberId}
                        message={comment?.message}
                        _id={comment._id}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                color="textPrimary"
                component="h4"
                sx={{
                  fontWeight: 600,
                }}
                variant="overline"
              >
                Add to card
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

            <KanbanCardAction
              icon={
                isPriorityOpen ? (
                  <ArrowDownwardIcon fontSize="small" />
                ) : (
                  <PriorityHighIcon fontSize="small" />
                )
              }
              onClick={handlePriorityToggle}
            >
              Priority
            </KanbanCardAction>
            {isPriorityOpen && (
              <Box sx={{ my: 3 }}>
                <PriorityAutoComplete
                  handlePriorityToggle={handlePriorityToggle}
                  options={priority}
                  cardId={card._id}
                />
              </Box>
            )}
            <KanbanCardAction
              icon={<CheckIcon fontSize="small" />}
              onClick={handleAddChecklist}
            >
              Checklist
            </KanbanCardAction>
            <KanbanCardAction
              icon={
                isMemberOpen ? (
                  <ArrowDownwardIcon fontSize="small" />
                ) : (
                  <UsersIcon fontSize="small" />
                )
              }
              onClick={handleMemberToggle}
            >
              Members
            </KanbanCardAction>
            {isMemberOpen && (
              <Box sx={{ my: 3 }}>
                <MemberAutoComplete options={members} cardId={card._id} />
              </Box>
            )}
            <KanbanCardAction
              onClick={handleLabelToggle}
              icon={
                isLabelDropdownOpen ? (
                  <ArrowDownwardIcon fontSize="small" />
                ) : (
                  <LabelIcon fontSize="small" />
                )
              }
            >
              Labels
            </KanbanCardAction>
            {isLabelDropdownOpen && (
              <Box sx={{ mt: 3 }}>
                <LabelAutoComplete options={labels} cardId={card._id} />
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography
                color="textPrimary"
                component="h4"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                }}
                variant="overline"
              >
                Actions
              </Typography>
              <KanbanCardAction
                onClick={handleMoveToggle}
                icon={
                  isMoveDropdownOpen ? (
                    <ArrowDownwardIcon fontSize="small" />
                  ) : (
                    <ArrowRightIcon fontSize="small" />
                  )
                }
              >
                Move
              </KanbanCardAction>

              {isMoveDropdownOpen && (
                <Box sx={{ my: 2 }}>
                  <MoveDropdown
                    column={column}
                    columns={columns}
                    onChange={handleMove}
                  />
                </Box>
              )}

              <KanbanCardAction
                onClick={handleCopyCard}
                icon={<DuplicateIcon fontSize="small" />}
              >
                Copy
              </KanbanCardAction>

              <Divider sx={{ my: 2 }} />
              {card.isSubscribed ? (
                <KanbanCardAction
                  icon={<EyeOffIcon fontSize="small" />}
                  onClick={handleUnsubscribe}
                >
                  Unwatch
                </KanbanCardAction>
              ) : (
                <KanbanCardAction
                  icon={<EyeIcon fontSize="small" />}
                  onClick={handleSubscribe}
                >
                  Watch
                </KanbanCardAction>
              )}
              <KanbanCardAction
                icon={<ArchiveIcon fontSize="small" />}
                onClick={handleDelete}
              >
                Delete
              </KanbanCardAction>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

KanbanCardModal.propTypes = {
  // @ts-ignore
  card: PropTypes.object.isRequired,
  // @ts-ignore
  column: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

KanbanCardModal.defaultProps = {
  open: false,
};

export default KanbanCardModal;
