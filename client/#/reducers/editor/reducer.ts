import { EditorConstants } from '#/constants/Editor';
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
  zoomLevel: number;
}

const InitialState: ReducerState = {
  canvas: {},
  zoomLevel: EditorConstants.DEFAULT_ZOOM,
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
