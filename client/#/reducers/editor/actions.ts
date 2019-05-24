import { Workspace } from '#/models/Editor';
import { FiberNode, Renderer } from '#/models/React';
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
  onCommitFiberRoot: actionCreator<{
    renderer: Renderer;
    rootFiberNode: FiberNode;
    nodeMap: NodeMap;
  }>('onCommitFiberRoot'),
  setSelectedOverlay: actionCreator<string | undefined>('setSelectedOverlay'),
  setHoveredOverlay: actionCreator<string | undefined>('setHoveredOverlay'),
};

export default actions;
