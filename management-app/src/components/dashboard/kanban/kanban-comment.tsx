import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Avatar, Box, Paper, Typography, TextField } from '@mui/material';
import { useSelector, useDispatch } from '../../../store';
import type { RootState } from '../../../store';
import type { Member, CommentWithReplies } from '../../../types';
import { deleteComment, updateComment } from '../../../slices';
import toast from 'react-hot-toast';

interface KanbanCommentProps extends CommentWithReplies {}

const memberSelector = (state: RootState, memberId: string): Member => {
  const { members } = state.kanban;
  return members.byId[memberId];
};

const KanbanComment: FC<KanbanCommentProps> = (props) => {
  const { createdAt, memberId, message, cardId, _id, replies, ...other } =
    props;
  const member = useSelector((state) => memberSelector(state, memberId));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedMessage, setEditedMessage] = useState<string>(message);

  const dispatch = useDispatch();

  const handleEditClick = (): void => {
    setIsEditing(true);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEditedMessage(event.target.value);
  };

  const handleDeleteComment = async (): Promise<void> => {
    try {
      await dispatch(deleteComment(cardId, _id));
      toast.success('Comment deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleKeyUp = async (
    event: KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    const update = {
      message: editedMessage,
      cardId,
      _id,
      createdAt,
      memberId,
    };
    try {
      if (event.code.toUpperCase() === 'ENTER' && editedMessage) {
        await dispatch(updateComment(cardId, _id, update));
        setIsEditing(false);
        toast.success('Comment updated!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };
  const handleSaveClick = async (): Promise<void> => {
    const update = {
      message: editedMessage,
      cardId,
      _id,
      createdAt,
      memberId,
    };
    try {
      await dispatch(updateComment(cardId, _id, update));
      setIsEditing(false);
      toast.success('Comment updated!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2,
      }}
      {...other}
    >
      <Avatar src={member?.avatar ?? ''} />
      <Box
        sx={{
          ml: 2,
          flexGrow: 1,
        }}
      >
        <Typography color="textPrimary" variant="subtitle2">
          {member.name}
        </Typography>
        <Paper
          sx={{
            backgroundColor: 'background.default',
            mt: 1,
            p: 2,
          }}
          variant="outlined"
        >
          {isEditing ? (
            <TextField
              fullWidth
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              placeholder="Write a comment..."
              size="small"
              value={editedMessage}
              variant="outlined"
            />
          ) : (
            <Typography color="textPrimary" variant="body2">
              {message}
            </Typography>
          )}
        </Paper>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 0.5,
          }}
        >
          <Box>
            <Box>
              {isEditing ? (
                <>
                  <Typography
                    color="textSecondary"
                    component="span"
                    variant="caption"
                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={handleSaveClick}
                  >
                    Save
                  </Typography>
                  <Typography
                    color="textSecondary"
                    component="span"
                    variant="caption"
                    sx={{
                      ml: 1,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    color="textSecondary"
                    component="span"
                    variant="caption"
                    sx={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      ml: 1,
                    }}
                    onClick={handleEditClick}
                  >
                    Edit
                  </Typography>
                  <Typography
                    color="textSecondary"
                    component="span"
                    variant="caption"
                    sx={{
                      ml: 1,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={handleDeleteComment}
                  >
                    Delete
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          {createdAt && (
            <Box>
              <Typography color="textSecondary" component="p" variant="caption">
                {format(createdAt, "MMM dd, yyyy 'at' hh:mm a")}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

KanbanComment.propTypes = {
  createdAt: PropTypes.number.isRequired,
  memberId: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default KanbanComment;
