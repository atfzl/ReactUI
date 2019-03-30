import { Fault } from '#/common/models/Fault';
import { TagCursor } from '#/common/models/file';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import { findNodeByTag } from '#/utils/tsNode';
import { createSourceFileFromText } from '#/utils/tsSourceFile';
import * as R from 'ramda';
import { of, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import * as ts from 'typescript';

const deleteElement = R.curry((cursor: TagCursor, fileContent: string) => {
  return of(createSourceFileFromText(cursor.fileName, fileContent)).pipe(
    concatMap(sourceFileNode => {
      const elementNode = findNodeByTag<ts.JsxElement>(cursor)(sourceFileNode);

      if (!elementNode || !ts.isJsxElement(elementNode)) {
        return throwError(
          new Fault('Element not found at cursor', {
            cursorLocation: cursor,
          }),
        );
      }

      const replacementBuilder = new ReplacementBuilder(sourceFileNode);
      replacementBuilder.deleteNode(elementNode);

      if (
        !ts.isJsxElement(elementNode.parent) &&
        !ts.isJsxFragment(elementNode.parent)
      ) {
        replacementBuilder.insert(elementNode.getStart(), 'null');
      }

      return of(replacementBuilder.applyReplacements());
    }),
  );
});

export default deleteElement;
