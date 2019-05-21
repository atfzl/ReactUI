import { Workspace } from '#/models/Editor';
import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('EDITOR');

const actions = {
  setWorkspace: actionCreator<Workspace>('setWorkspace'),
  setCanvasInternals: actionCreator<{ doc: Document; element: HTMLDivElement }>(
    'setCanvasInternals',
  ),
};

export default actions;
