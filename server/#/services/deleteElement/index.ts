import { TagCursor } from '#/common/models/file';
import { catchThrowFault } from '#/operators/catchThrowError';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import { findNode$, isAtCursor } from '#/utils/tsNode';
import { createSourceFile$ } from '#/utils/tsSourceFile';
import * as R from 'ramda';
import { map, pluck, switchMap } from 'rxjs/operators';
import * as ts from 'typescript';

const deleteElement$ = (cursor: TagCursor) =>
  createSourceFile$(cursor.fileName).pipe(
    pluck('file'),
    switchMap(sourceFileNode =>
      findNode$<ts.JsxElement>(R.both(ts.isJsxElement, isAtCursor(cursor)))(
        sourceFileNode,
      ).pipe(
        catchThrowFault('Element not found at cursor', {
          cursorLocation: cursor,
        }),
        map(cursorNode => {
          const replacementBuilder = new ReplacementBuilder(sourceFileNode);
          replacementBuilder.deleteNode(cursorNode);

          if (
            !ts.isJsxElement(cursorNode.parent) &&
            !ts.isJsxFragment(cursorNode.parent)
          ) {
            replacementBuilder.insert(cursorNode.getStart(), 'null');
          }

          return replacementBuilder.applyReplacements();
        }),
      ),
    ),
  );

export default deleteElement$;
