import { TagCursor } from '../models/file';
import { rendererToMainRequest } from '../utils/ipcCreator';

interface Payload {
  source: TagCursor;
  target: TagCursor;
}

export default rendererToMainRequest<Payload, void>('CopyElement');
