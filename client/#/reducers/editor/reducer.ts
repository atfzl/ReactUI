import { EditorConstants } from '#/constants/Editor';
import { Workspace } from '#/models/Editor';
import { immerCase } from '#/utils';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actions from './actions';
import { NodeMap, ReactInternals } from './interfaces';

export interface ReducerState {
  canvas?: {
    doc: Document;
    element: HTMLDivElement;
  };
  workspace?: Workspace;
  zoomLevel: number;
  reactInternals?: ReactInternals;
  nodeMap: NodeMap;
}

const InitialState: ReducerState = {
  zoomLevel: EditorConstants.DEFAULT_ZOOM,
  nodeMap: {},
};

const reducer = reducerWithInitialState<ReducerState>(InitialState)
  .withHandling(
    immerCase(actions.setWorkspace, (state, payload) => {
      state.workspace = payload;
    }),
  )
  .withHandling(
    immerCase(actions.setCanvasDomInternals, (state, payload) => {
      state.canvas = {
        doc: payload.doc,
        element: payload.element,
      };
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
  .case(actions.onCommitFiberRoot, (state, payload) => {
    return {
      ...state,
      reactInternals: {
        renderer: payload.renderer,
        fiberRoot: payload.fiberRoot,
      },
      nodeMap: payload.nodeMap,
    };
  })
  .build();

export default reducer;
