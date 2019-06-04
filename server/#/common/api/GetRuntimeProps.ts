import { TagCursor } from '../models/file';
import { mainToRendererRequest } from '../utils/ipcCreator';

export const isReactElementIdentifier = '$$__REACTUI__IS_REACT_ELEMENT';

interface Payload extends TagCursor {}

type Result = Record<string, any>;

export default mainToRendererRequest<Payload, Result>('GetRuntimeProps');
