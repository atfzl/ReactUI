import { rendererToMainRequest } from '../utils/ipcCreator';

interface Payload {
  _id: string;
}

interface Result {
  val: number;
}

export default rendererToMainRequest<Payload, Result>('DragDrop');
