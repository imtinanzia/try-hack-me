import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import type { Action, AnyAction } from '@reduxjs/toolkit';
import rootReducer from './root-reducer';

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = ThunkDispatch<RootState, null, AnyAction>;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
