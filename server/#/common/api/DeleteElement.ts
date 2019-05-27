import { TagCursor } from '../models/file';
import { rendererToMainRequest } from '../utils/ipcCreator';

interface Payload extends TagCursor {}

export default rendererToMainRequest<Payload, void>('DeleteElement');
