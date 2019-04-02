import { Fault } from '#/common/models/Fault';
import { TagCursor } from '#/common/models/file';
import { catchThrowFault } from '#/operators/catchThrowError';
import * as R from 'ramda';
import { Observable } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import * as ts from 'typescript';
import { createSourceFile$ } from '../tsSourceFile';

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

export const findNode$ = <T extends ts.Node>(
  predicate: (node: ts.Node) => boolean,
) => (rootNode: ts.Node): Observable<T> => {
  return new Observable(subscriber => {
    let resolvedNode;

    function _traverse(node: ts.Node) {
      if (predicate(node)) {
        resolvedNode = node as T;
        subscriber.next(resolvedNode);
        subscriber.complete();
        return;
      }

      ts.forEachChild(node, _traverse);
    }

    _traverse(rootNode);

    subscriber.error(new Fault('Node not found', { rootNode }));
  });
};

export const findNodeAtCursor$ = <T extends ts.Node>(
  predicate: (node: ts.Node) => boolean = () => true,
) => (cursor: TagCursor) =>
  createSourceFile$(cursor.fileName).pipe(
    pluck('file'),
    switchMap(findNode$<T>(R.both(isAtCursor(cursor), predicate))),
    catchThrowFault('Node not found at cursor', { cursor }),
  );

export const findElementAtCursor$ = findNodeAtCursor$<ts.JsxElement>(
  ts.isJsxElement,
);

export const findTemplateStringAtCursor$ = findNodeAtCursor$<
  ts.TaggedTemplateExpression
>(ts.isTaggedTemplateExpression);

export const isAtCursor = (cursor: TagCursor) => (node: ts.Node) => {
  const { lineNumber, columnNumber } = getInfo(node);

  return (
    lineNumber === cursor.lineNumber && columnNumber === cursor.columnNumber
  );
};
