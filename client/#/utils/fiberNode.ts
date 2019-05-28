import { TagCursor } from '#/common/models/file';
import { FiberNode } from '#/models/React';

export const getIdFromCursor = (cursor: TagCursor) =>
  [cursor.fileName, cursor.lineNumber, cursor.columnNumber, cursor.tagName]
    .filter(x => !!x)
    .join(',');

export const getTitle = (node: FiberNode) => {
  const cursor = node._debugSource;

  return cursor && getIdFromCursor(cursor);
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
