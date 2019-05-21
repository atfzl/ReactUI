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
  .withHandling(
    immerCase(actions.increaseZoom, state => {
      // to avoid 0.1 + 0.2 === 0.3 false
      state.zoomLevel = +(state.zoomLevel + EditorConstants.STEP).toFixed(1);
    }),
  )
  .withHandling(
    immerCase(actions.decreaseZoom, state => {
      state.zoomLevel = +(state.zoomLevel - EditorConstants.STEP).toFixed(1);
    }),
  )
  .build();

export default reducer;
