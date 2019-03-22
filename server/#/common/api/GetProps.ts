import { mainToRendererRequest } from '../utils/ipcCreator';

interface Payload {
  id: string;
}

interface Result {
  times: number;
}

export default mainToRendererRequest<Payload, Result>('GetProps');
