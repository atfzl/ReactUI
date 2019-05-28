import { mainToRendererRequest } from '../utils/ipcCreator';

export const isReactElementIdentifier = '$$__ELLIPSOID__IS_REACT_ELEMENT';

type Payload = string;

type Result =
  | {
      [isReactElementIdentifier]: boolean;
    }
  | Record<string, any>;

export default mainToRendererRequest<Payload, Result>('GetRuntimeProps');
