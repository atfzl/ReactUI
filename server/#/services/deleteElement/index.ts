import { TagCursor } from '#/common/models/file';
import { catchThrowFault } from '#/operators/catchThrowError';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import { findNode$, isAtCursor } from '#/utils/tsNode';
import { createSourceFileFromText } from '#/utils/tsSourceFile';
import * as R from 'ramda';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as ts from 'typescript';

const deleteElement = R.curry((cursor: TagCursor, fileContent: string) => {
  return of(createSourceFileFromText(cursor.fileName, fileContent)).pipe(
    switchMap(sourceFileNode =>
      findNode$<ts.JsxElement>(R.both(ts.isJsxElement, isAtCursor(cursor)))(
        sourceFileNode,
      ).pipe(
        catchThrowFault('Element not found at cursor', {
          cursorLocation: cursor,
        }),
        map(elementNode => {
          const replacementBuilder = new ReplacementBuilder(sourceFileNode);
          replacementBuilder.deleteNode(elementNode);

          if (
            !ts.isJsxElement(elementNode.parent) &&
            !ts.isJsxFragment(elementNode.parent)
          ) {
            replacementBuilder.insert(elementNode.getStart(), 'null');
          }

          return replacementBuilder.applyReplacements();
        }),
      ),
    ),
  );
});

export default deleteElement;
