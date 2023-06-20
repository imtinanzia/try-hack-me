import { useState } from 'react';
import type { FC } from 'react';
import {
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useDispatch } from '../store';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Label } from '../types';
import { createLabel, addLabelToCard } from '../slices';
import { createResourceId } from '../utils';

interface OptionType {
  inputValue?: string;
  title: string;
  id: string;
}
interface LabelProps {
  options: Label[];
  cardId: string;
}
interface Option {
  id: string;
  title: string;
}

const filter = createFilterOptions<OptionType>();

const modifiedData = (labels: Label[]): Option[] => {
  return labels?.map((item: Label) => {
    return {
      id: item._id,
      title: item.name,
    };
  });
};

const LabelAutoComplete: FC<LabelProps> = (props) => {
  const [value, setValue] = useState<OptionType | null>(null);
  const [open, toggleOpen] = useState(false);
  const dispatch = useDispatch();

  const options = modifiedData(props.options);

  const handleClose = () => {
    setDialogValue({
      title: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = useState({ title: '' });

  const handleCreate = async (title: string): Promise<void> => {
    try {
      await dispatch(createLabel(title, props.cardId));
      toast.success('Label added!');
      setDialogValue({
        title: '',
      });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleAddLabel = async (labelId: string): Promise<void> => {
    try {
      await dispatch(addLabelToCard(props.cardId, labelId));
      toast.success('Label added!');
      setValue(null);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCreate(dialogValue.title);
    handleClose();
  };

  return (
    <Box>
      <Autocomplete
        value={value}
        onChange={(_, newValue: any) => {
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              setDialogValue({
                title: newValue,
              });
              toggleOpen(true);
            });
          } else {
            handleAddLabel(newValue.id);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
              id: createResourceId(),
            });
          }

          return filtered;
        }}
        id="free-solo-dialog-demo"
        options={options}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.title;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        freeSolo
        renderInput={(params) => <TextField {...params} label="Labels" />}
      />
      <Dialog open={open} onClose={handleClose} fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new Label</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any Label? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              fullWidth
              value={dialogValue.title}
              onChange={(event) =>
                setDialogValue({
                  title: event.target.value,
                })
              }
              label="Label"
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default LabelAutoComplete;
