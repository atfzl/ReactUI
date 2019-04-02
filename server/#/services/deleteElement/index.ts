import { TagCursor } from '#/common/models/file';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import { findNodeAtCursor$ } from '#/utils/tsNode';
import { map } from 'rxjs/operators';
import * as ts from 'typescript';

const deleteElement$ = (cursor: TagCursor) =>
  findNodeAtCursor$<ts.JsxElement>(cursor, ts.isJsxElement).pipe(
    map(cursorNode => {
      const replacementBuilder = new ReplacementBuilder(
        cursorNode.getSourceFile(),
      );
      replacementBuilder.deleteNode(cursorNode);

      if (
        !ts.isJsxElement(cursorNode.parent) &&
        !ts.isJsxFragment(cursorNode.parent)
      ) {
        replacementBuilder.insert(cursorNode.getStart(), 'null');
      }

      return replacementBuilder.applyReplacements();
    }),
  );

export default deleteElement$;
