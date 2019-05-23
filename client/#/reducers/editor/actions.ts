import { Workspace } from '#/models/Editor';
import { OnCommitFiberRootPayload } from '#/models/React';
import actionCreatorFactory from 'typescript-fsa';
import { NodeMap } from './interfaces';

const actionCreator = actionCreatorFactory('EDITOR');

const actions = {
  setWorkspace: actionCreator<Workspace>('setWorkspace'),
  setCanvasDomInternals: actionCreator<{
    doc: Document;
    element: HTMLDivElement;
  }>('setCanvasDomInternals'),
  increaseZoom: actionCreator('increaseZoom'),
  decreaseZoom: actionCreator('decreaseZoom'),
  onCommitFiberRoot: actionCreator<
    OnCommitFiberRootPayload & { nodeMap: NodeMap }
  >('onCommitFiberRoot'),
};

export default actions;
