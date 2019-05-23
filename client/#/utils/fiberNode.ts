import { FiberNode } from '#/models/React';

export const getTitle = (node: FiberNode) => {
  const d = node._debugSource;

  return d && [d.fileName, d.lineNumber, d.columnNumber, d.tagName].join(',');
};

export function walkTree(
  root: FiberNode,
  fn: (node: FiberNode, depth: number) => void,
) {
  let node = root;

  let depth = 0;

  while (true) {
    fn(node, depth);

    if (node.child) {
      node = node.child;
      depth += 1;
      continue;
    }
    if (node === root) {
      return;
    }
    while (!node.sibling) {
      if (!node.return || node.return === root) {
        return;
      }
      node = node.return;
      depth -= 1;
    }
    node = node.sibling;
  }
}
