import { TagCursor } from '#/common/models/file';
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
  instanceWrappers: Array<{
    element: HTMLElement | null | undefined;
    id: string;
    cursor: TagCursor;
  }>;
}

const InitialState: ReducerState = {
  canvas: {},
  selectedComponent: [0, 0],
  instanceWrappers: [],
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
  .withHandling(
    immerCase(actions.setInstanceWrapper, (state, payload) => {
      state.instanceWrappers[payload.index] = {
        element: payload.element,
        id: payload.id,
        cursor: payload.cursor,
      };
    }),
  )
  .build();

export default reducer;
