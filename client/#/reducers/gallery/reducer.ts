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
  selectedComponent: [number, number]; // first index is component, second is instance
}

const InitialState: ReducerState = {
  canvas: {},
  selectedComponent: [0, 0],
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
  .withHandling(
    immerCase(actions.setSelectedComponent, (state, payload) => {
      state.selectedComponent = payload;
    }),
  )
  .build();

export default reducer;
