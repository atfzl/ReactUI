import { FiberNode, FiberRoot, Renderer } from '#/models/React';

export interface ReactInternals {
  renderer: Renderer;
  fiberRoot: FiberRoot;
}

export type NodeMap = Record<
  string,
  {
    fiberNode: FiberNode;
    nativeNode?: HTMLElement;
    depth: number;
  }
>;
