import { Workspace } from '#/models/Editor';
import { immerCase } from '#/utils';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actions from './actions';

export interface ReducerState {
  canvas: {
    doc?: Document;
    element?: HTMLDivElement;
  };
  workspace?: Workspace;
}

const InitialState: ReducerState = {
  canvas: {},
};

const reducer = reducerWithInitialState<ReducerState>(InitialState)
  .withHandling(
    immerCase(actions.setWorkspace, (state, payload) => {
      state.workspace = payload;
    }),
  )
  .withHandling(
    immerCase(actions.setCanvasInternals, (state, payload) => {
      state.canvas.doc = payload.doc;
      state.canvas.element = payload.element;
    }),
  )
  .build();

export default reducer;
