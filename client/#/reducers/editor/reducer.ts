import { StyleObject } from '#/common/models/Style';
import { EditorConstants } from '#/constants/Editor';
import { Workspace } from '#/models/Editor';
import { FiberNode, Renderer } from '#/models/React';
import { immerCase, parseStyles } from '#/utils';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actions from './actions';
import { NodeMap, OverlayEventSource } from './interfaces';

export interface ReducerState {
  canvas?: {
    doc: Document;
    element: HTMLDivElement;
  };
  workspace?: Workspace;
  zoomLevel: number;
  renderer?: Renderer;
  rootFiberNode?: FiberNode;
  nodeMap: NodeMap;
  overlay: {
    selected?: string;
    selectSource?: OverlayEventSource;
    hovered?: string;
    hoverSource?: OverlayEventSource;
    copied?: string;
  };
  loading: boolean;
  selectedStyle: StyleObject;
}

const InitialState: ReducerState = {
  zoomLevel: EditorConstants.DEFAULT_ZOOM,
  nodeMap: {},
  overlay: {},
  loading: false,
  selectedStyle: [],
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
      state.rootFiberNode = payload.rootFiberNode;
    }),
  )
  .withHandling(
    immerCase(actions.setSelectedOverlay, (state, payload) => {
      state.overlay.selected = payload && payload.id;
      state.overlay.selectSource = payload && payload.source;

      if (payload) {
        const { fiberNode } = state.nodeMap[payload.id];

        if (fiberNode.type && fiberNode.type.componentStyle) {
          const { rules } = fiberNode.type.componentStyle;
          const style = rules.join('');

          state.selectedStyle = parseStyles(style);
        }
      } else {
        state.selectedStyle = [];
      }
    }),
  )
  .withHandling(
    immerCase(actions.setHoveredOverlay, (state, payload) => {
      state.overlay.hovered = payload && payload.id;
      state.overlay.hoverSource = payload && payload.source;
    }),
  )
  .withHandling(
    immerCase(actions.setCopiedOverlay, (state, payload) => {
      state.overlay.copied = payload;
    }),
  )
  .withHandling(
    immerCase(actions.setLoading, (state, payload) => {
      state.loading = !!payload;
    }),
  )
  .build();

export default reducer;
