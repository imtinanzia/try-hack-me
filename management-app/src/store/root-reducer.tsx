import { combineReducers } from '@reduxjs/toolkit';
import { kanbanReducer } from '../slices';

const rootReducer = combineReducers({
  kanban: kanbanReducer,
});

export default rootReducer;
