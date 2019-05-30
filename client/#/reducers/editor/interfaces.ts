import { FiberNode } from '#/models/React';

export type NodeMap = Record<
  string,
  {
    fiberNode: FiberNode;
    nativeNode: HTMLElement;
    depth: number;
  }
>;

export type OverlayEventSource = 'canvas' | 'tree';
