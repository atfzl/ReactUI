import { TagCursor } from '../models/file';
import { StyleObject } from '../models/Style';
import { rendererToMainRequest } from '../utils/ipcCreator';

interface Payload {
  cursor: TagCursor;
  style: StyleObject;
}

export default rendererToMainRequest<Payload, void>('FlushStyles');
