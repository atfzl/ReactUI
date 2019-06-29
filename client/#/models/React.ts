export interface FiberNode {
  alternate: FiberNode;
  child?: FiberNode;
  effectTag: number;
  expirationTime: number;
  firstEffect: FiberNode;
  index: number;
  key: null;
  lastEffect: FiberNode;
  memoizedProps: Record<string, any>;
  memoizedState: Record<string, any>;
  mode: number;
  nextEffect: null;
  pendingProps: Record<string, any>;
  ref: null;
  return: FiberNode;
  sibling: FiberNode;
  stateNode: FiberRoot;
  tag: number;
  type: null | {
    componentStyle: {
      rules: string[];
      isStatic: boolean;
      componentId: string;
      lastClassName: string;
    };
  };
  updateQueue: null;
  _debugID: number;
  _debugIsCurrentlyTiming: boolean;
  _debugOwner: null;
  _debugSource?: {
    lineNumber: number;
    columnNumber: number;
    fileName: string;
    tagName: string;
  };
}

export interface FiberRoot {
  containerInfo: HTMLElement;
  context: object;
  current: FiberNode;
  finishedWork: null;
  firstBatch: null;
  hydrate: boolean;
  nextScheduledRoot: null;
  pendingChildren: null;
  pendingCommitExpirationTime: number;
  pendingContext: null;
  remainingExpirationTime: number;
}

export interface Renderer {
  bundleType: number;
  findFiberByHostInstance: (el: HTMLElement) => FiberNode;
  findHostInstanceByFiber: (node: FiberNode) => HTMLElement;
  rendererPackageName: 'react-dom';
  version: string;
}

export interface OnCommitFiberRootPayload {
  rendererId: string;
  renderer: Renderer;
  fiberRoot: FiberRoot;
}
