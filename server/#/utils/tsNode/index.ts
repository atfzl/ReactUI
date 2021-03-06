import { Fault } from '#/common/models/Fault';
import { TagCursor } from '#/common/models/file';
import { catchThrowFault } from '#/operators/catchThrowError';
import * as R from 'ramda';
import { EMPTY, from, Observable, of } from 'rxjs';
import {
  concatAll,
  concatMap,
  expand,
  filter,
  map,
  pluck,
  switchMap,
  toArray,
} from 'rxjs/operators';
import * as ts from 'typescript';
import { createSourceFile$ } from '../tsSourceFile';

export const getCursor = (node: ts.Node): TagCursor => {
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

export const findAllNodes$ = <T extends ts.Node>(
  predicate: (node: ts.Node) => boolean,
) => (rootNode: ts.Node): Observable<T> => {
  return new Observable(subscriber => {
    function _traverse(node: ts.Node) {
      if (predicate(node)) {
        subscriber.next(node as T);
      }

      ts.forEachChild(node, _traverse);
    }

    _traverse(rootNode);

    subscriber.complete();
  });
};

export const findNode$ = <T extends ts.Node>(
  predicate: (node: ts.Node) => boolean,
) => (rootNode: ts.Node): Observable<T> => {
  return new Observable(subscriber => {
    function _traverse(node: ts.Node) {
      if (predicate(node)) {
        subscriber.next(node as T);
        subscriber.complete();
        return;
      }

      ts.forEachChild(node, _traverse);
    }

    _traverse(rootNode);

    subscriber.error(new Fault('Node not found', { rootNode }));
  });
};

export const findAncestorNode = <T extends ts.Node>(
  predicate: (node: ts.Node) => boolean,
) => (rootNode: ts.Node): T | undefined => {
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

export const findNodeAtCursor$ = <T extends ts.Node>(
  predicate: (node: ts.Node) => boolean = () => true,
) => (cursor: TagCursor, sourceNode?: ts.Node) =>
  (sourceNode
    ? of(sourceNode)
    : createSourceFile$(cursor.fileName).pipe(pluck('file'))
  ).pipe(
    switchMap(findNode$<T>(R.both(isAtCursor(cursor), predicate))),
    catchThrowFault('Node not found at cursor', { cursor }),
  );

export const findElementAtCursor$ = findNodeAtCursor$<
  ts.JsxElement | ts.JsxSelfClosingElement
>(R.anyPass([ts.isJsxElement, ts.isJsxSelfClosingElement]));

export const findTemplateStringAtCursor$ = findNodeAtCursor$<
  ts.TaggedTemplateExpression
>(ts.isTaggedTemplateExpression);

export const isAtCursor = (cursor: TagCursor) => (node: ts.Node) => {
  const { lineNumber, columnNumber } = getCursor(node);

  return (
    lineNumber === cursor.lineNumber && columnNumber === cursor.columnNumber
  );
};

export const isJsxLikeElement: (a: ts.Node) => boolean = R.unary(
  R.anyPass([ts.isJsxElement, ts.isJsxSelfClosingElement]),
);

export const getTagName = (node: ts.JsxElement | ts.JsxSelfClosingElement) => {
  if (ts.isJsxElement(node)) {
    return [node.openingElement.tagName, node.closingElement.tagName];
  }

  return [node.tagName];
};

export const getAttributes = (node: ts.JsxElement | ts.JsxSelfClosingElement) =>
  ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;

export const traverseElement = (
  element: ts.JsxElement | ts.JsxSelfClosingElement,
) =>
  of([{ element }]).pipe(
    expand(elementNodes =>
      from(elementNodes).pipe(
        map(({ element: childElement }) => {
          if (ts.isJsxElement(childElement)) {
            return from(childElement.children).pipe(
              map((child, index) => ({ element: child, index })),
            );
          }

          return EMPTY;
        }),
      ),
    ),
    concatAll(),
  );

export const traverseNodeReferences = (
  startingNode: ts.Node,
  declarationIdentifiers: ts.BindingName[],
) => {
  const tagDefinition = declarationIdentifiers.find(
    x => x.getText() === startingNode.getText(),
  )!;

  return of([{ node: startingNode, definition: tagDefinition }]).pipe(
    expand(identifiers => {
      return from(identifiers).pipe(
        concatMap(identifier =>
          findAllNodes$<ts.Identifier>(
            node => ts.isIdentifier(node) && node !== identifier.definition,
          )(identifier.definition.parent).pipe(
            map(a => ({
              definition: R.find(
                x => x.getText() === a.getText(),
                declarationIdentifiers,
              )!,
              node: a,
            })),
            filter(x => !!x.definition),
            toArray(),
          ),
        ),
      );
    }),
    concatAll(),
  );
};

export const isDeclaration = R.anyPass([
  ts.isVariableDeclaration,
  ts.isFunctionDeclaration,
  ts.isImportDeclaration,
]);

export const isDeclarationStatement = R.anyPass([
  ts.isVariableStatement,
  ts.isFunctionDeclaration,
  ts.isImportDeclaration,
]);

export type Declaration =
  | ts.VariableDeclaration
  | ts.FunctionDeclaration
  | ts.ImportDeclaration;

export type DeclarationStatement =
  | ts.VariableStatement
  | ts.FunctionDeclaration
  | ts.ImportDeclaration;
