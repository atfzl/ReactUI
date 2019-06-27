import { findElementAtCursor$ } from '#/utils/tsNode';
import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import pasteElement from '../pasteElement';

const appendIntrinsicTag = (tagName: string) =>
  pipe(
    findElementAtCursor$,
    switchMap(cursorNode =>
      pasteElement({
        jsx: `<${tagName}># # # #</${tagName}>`,
        insertions: {},
        targetCursorNode: cursorNode,
      }),
    ),
  );

export default appendIntrinsicTag;
