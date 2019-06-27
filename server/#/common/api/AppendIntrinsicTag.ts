import { TagCursor } from '../models/file';
import { rendererToMainRequest } from '../utils/ipcCreator';

interface Payload {
  cursor: TagCursor;
  tagName: string;
}

export default rendererToMainRequest<Payload, void>('AppendIntrinsicTag');
