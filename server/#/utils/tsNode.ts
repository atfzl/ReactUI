import { IJSXSource } from '#/common/models/file';
import * as ts from 'typescript';

export const getInfo = (node: ts.Node) => {
  const file = node.getSourceFile();

  const { line, character: column } = file.getLineAndCharacterOfPosition(
    node.getStart(),
  );

  const fileName = file.fileName;
  const lineNumber = line + 1;
  const columnNumber = column + 1;

  return {
    fileName,
    lineNumber,
    columnNumber,
  };
};

export const isAncestor = (a?: ts.Node, b?: ts.Node): boolean => {
  if (!b || !a) {
    return false;
  }

  if (b.parent === a) {
    return true;
  }

  return isAncestor(a, b.parent);
};

export const findNode = <T extends ts.Node>(
  rootNode: ts.Node,
  target?: IJSXSource,
  predicate?: (node: ts.Node) => boolean,
): T | undefined => {
  let resolvedNode;

  function _traverse(node: ts.Node) {
    const { lineNumber, columnNumber } = getInfo(node);

    if (
      (target &&
        (lineNumber === target.lineNumber &&
          columnNumber === target.columnNumber)) ||
      (predicate && predicate(node))
    ) {
      resolvedNode = node;
      return;
    }

    ts.forEachChild(node, _traverse);
  }

  _traverse(rootNode);

  return resolvedNode;
};

export const findAncestorNode = <T extends ts.Node>(
  rootNode: T,
  predicate: (node: ts.Node) => boolean,
): T | undefined => {
  let resolvedNode;

  let node = rootNode.parent;

  while (node) {
    if (predicate(node)) {
      resolvedNode = node as T;
      break;
    }

    node = node.parent;
  }

  return resolvedNode;
};

export const findAllNodes = <T extends ts.Node>(
  rootNode: ts.Node,
  predicate: (node: ts.Node) => boolean,
): T[] => {
  const resolvedNodes: T[] = [];

  function _traverse(node: ts.Node) {
    if (predicate(node)) {
      resolvedNodes.push(node as T);
    }

    ts.forEachChild(node, _traverse);
  }

  _traverse(rootNode);

  return resolvedNodes;
};
