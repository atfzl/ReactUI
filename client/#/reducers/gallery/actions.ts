import { TagCursor } from '#/common/models/file';
import { Workspace } from '#/models/Editor';
import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('GALLERY');

const actions = {
  setWorkspace: actionCreator<Workspace>('setWorkspace'),
  setCanvasInternals: actionCreator<{ doc: Document; element: HTMLDivElement }>(
    'setCanvasInternals',
  ),
  setSelectedComponent: actionCreator<[number, number]>('setSelectedComponent'),
  setInstanceWrapper: actionCreator<{
    index: number;
    id: string;
    cursor: TagCursor;
    element: HTMLElement | null | undefined;
  }>('setInstanceWrapper'),
};

export default actions;
