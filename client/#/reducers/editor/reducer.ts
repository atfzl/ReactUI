import { EditorConstants } from '#/constants/Editor';
import { Workspace } from '#/models/Editor';
import { FiberNode, Renderer } from '#/models/React';
import { immerCase } from '#/utils';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actions from './actions';
import { NodeMap } from './interfaces';

export interface ReducerState {
  canvas?: {
    doc: Document;
    element: HTMLDivElement;
  };
  workspace?: Workspace;
  zoomLevel: number;
  renderer?: Renderer;
  fiberRootNode?: FiberNode;
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
  .withHandling(
    immerCase(actions.onCommitFiberRoot, (state, payload) => {
      state.renderer = payload.renderer;
      state.nodeMap = payload.nodeMap;
      state.fiberRootNode = payload.fiberRootNode;
    }),
  )
  .build();

export default reducer;
