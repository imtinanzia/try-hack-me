import { PRIORITY } from '../constants';

const priorityDecider = (priority: string): any => {
  switch (priority.toUpperCase()) {
    case PRIORITY.LOW:
      return 'success';
    case PRIORITY.MEDIUM:
      return 'warning';
    case PRIORITY.HIGH:
      return 'error';
    default:
      return 'success';
  }
};

export default priorityDecider;
