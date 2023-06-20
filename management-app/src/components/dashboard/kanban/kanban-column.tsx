import { useRef, useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Draggable } from 'react-beautiful-dnd';
import {
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { DotsHorizontalIcon } from '../../../icons';
import {
  clearColumn,
  deleteColumn,
  updateColumn,
} from '../../../slices/kanban';
import { useDispatch, useSelector } from '../../../store';
import type { RootState } from '../../../store';
import type { Column } from '../../../types';
import KanbanCard from './kanban-card';
import KanbanCardAdd from './kanban-card-add';
import StrictModeDroppable from '../../strict-mode-droppable';

interface KanbanColumnProps {
  columnId: string;
}

const columnSelector = (state: RootState, columnId: string): Column => {
  const { columns } = state.kanban;

  return columns.byId[columnId];
};

const KanbanColumn: FC<KanbanColumnProps> = (props) => {
  const { columnId, ...other } = props;
  const dispatch = useDispatch();
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const column = useSelector((state) => columnSelector(state, columnId));
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [name, setName] = useState<string>(column.name);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  const handleMenuOpen = (): void => {
    setOpenMenu(true);
  };

  const handleMenuClose = (): void => {
    setOpenMenu(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleRenameInit = (): void => {
    setIsRenaming(true);
    setOpenMenu(false);
  };

  const handleRename = async (): Promise<void> => {
    try {
      if (!name) {
        setName(column.name);
        setIsRenaming(false);
        return;
      }

      const update = { name };

      setIsRenaming(false);
      await dispatch(updateColumn(column._id, update));
      toast.success('Column updated!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      setOpenMenu(false);
      await dispatch(deleteColumn(column._id));
      toast.success('Column deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleClear = async (): Promise<void> => {
    try {
      setOpenMenu(false);
      await dispatch(clearColumn(column._id));
      toast.success('Column cleared!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div {...other}>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          mx: 1,
          overflowX: 'hidden',
          overflowY: 'hidden',
          width: {
            xs: 300,
            sm: 380,
          },
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            px: 2,
            py: 1,
          }}
        >
          {isRenaming ? (
            <ClickAwayListener onClickAway={handleRename}>
              <TextField
                margin="dense"
                onBlur={handleRename}
                onChange={handleChange}
                value={name}
                variant="outlined"
              />
            </ClickAwayListener>
          ) : (
            <Typography color="inherit" onClick={handleRenameInit} variant="h6">
              {column.name}
            </Typography>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleMenuOpen}
            ref={moreRef}
          >
            <DotsHorizontalIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
        <StrictModeDroppable droppableId={column._id} type="card">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              sx={{
                flexGrow: 1,
                minHeight: 80,
                overflowY: 'auto',
                px: 2,
                py: 1,
              }}
            >
              {column?.cardIds?.map((cardId, index) => {
                // Check if cardId is valid and truthy
                if (!cardId) return null;

                // Check if card exists in the column object
                const card = column?.cardIds.find((car) => car === cardId);
                if (!card) return null;

                return (
                  <Draggable draggableId={cardId} index={index} key={cardId}>
                    {(provided, snapshot) => (
                      <KanbanCard
                        cardId={cardId}
                        dragging={snapshot.isDragging}
                        index={index}
                        key={cardId}
                        column={column}
                        ref={provided.innerRef}
                        style={{ ...provided.draggableProps.style }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </StrictModeDroppable>

        <Divider />
        <Box sx={{ p: 2 }}>
          <KanbanCardAdd columnId={column._id} />
        </Box>
        <Menu
          anchorEl={moreRef.current}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
          keepMounted
          onClose={handleMenuClose}
          open={openMenu}
        >
          <MenuItem onClick={handleRenameInit}>Rename</MenuItem>
          <MenuItem onClick={handleClear}>Clear</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Paper>
    </div>
  );
};

KanbanColumn.propTypes = {
  columnId: PropTypes.string.isRequired,
};

export default KanbanColumn;
