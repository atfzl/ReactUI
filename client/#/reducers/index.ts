import { combineReducers } from 'redux';
import { combineEpics, Epic } from 'redux-observable';
import { ActionType } from 'typesafe-actions';
import {
  actions as actions1,
  epics as epics1,
  reducer as reducer1,
  ReducerState as ReducerState1,
} from './global';

export interface RootState {
  global: ReducerState1;
}

export const rootReducer = combineReducers<RootState>({
  global: reducer1,
});

export const rootEpic = combineEpics(epics1);

export type RootAction = ActionType<typeof actions1>;

export type Epic = Epic<RootAction, RootAction, RootState>;
