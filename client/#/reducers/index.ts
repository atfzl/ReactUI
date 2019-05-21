import { combineReducers } from 'redux';
import { combineEpics, Epic } from 'redux-observable';
import { ActionType } from 'typesafe-actions';
import {
  actions as actions2,
  epics as epics2,
  reducer as reducer2,
  ReducerState as ReducerState2,
} from './editor';
import {
  actions as actions1,
  epics as epics1,
  reducer as reducer1,
  ReducerState as ReducerState1,
} from './global';

export interface RootState {
  global: ReducerState1;
  editor: ReducerState2;
}

export const rootReducer = combineReducers<RootState>({
  global: reducer1,
  editor: reducer2,
});

export const rootEpic = combineEpics(epics1, epics2);

export type RootAction =
  | ActionType<typeof actions1>
  | ActionType<typeof actions2>;

export type Epic = Epic<RootAction, RootAction, RootState>;
