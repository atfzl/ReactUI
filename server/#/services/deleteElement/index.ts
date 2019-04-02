import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import { findElementAtCursor$ } from '#/utils/tsNode';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import * as ts from 'typescript';

const deleteElement$ = pipe(
  findElementAtCursor$,
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
