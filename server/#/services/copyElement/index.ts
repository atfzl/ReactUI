import { TagCursor } from '#/common/models/file';
import { findElementAtCursor$, isJsxLikeElement } from '#/utils/tsNode';
import { getDeclarationIdentifiersAtSourceFile } from '#/utils/tsNode/getDeclarationIdentifiers';
import incrementIdentifierNameFrom from '#/utils/tsNode/incrementIdentifierNameFrom';
import { EMPTY, forkJoin, from, of } from 'rxjs';
import {
  concatAll,
  expand,
  filter,
  map,
  switchMap,
  toArray,
} from 'rxjs/operators';

const copyElement$ = (sourceCursor: TagCursor, targetCursor: TagCursor) =>
  forkJoin(
    findElementAtCursor$(sourceCursor),
    findElementAtCursor$(targetCursor),
  ).pipe(
    switchMap(([sourceCursorNode, targetCursorNode]) =>
      getDeclarationIdentifiersAtSourceFile(
        targetCursorNode.getSourceFile(),
      ).pipe(
        toArray(),
        switchMap(fileDeclarationIdentifiers =>
          from(fileDeclarationIdentifiers).pipe(
            map(bindingName => bindingName.getText()),
            toArray(),
            switchMap(fileDeclarationIdentifiersText => {
              const incrementIdentifierName = incrementIdentifierNameFrom(
                fileDeclarationIdentifiersText,
              );

              incrementIdentifierName('sourceCursorNode');

              return of([sourceCursorNode]).pipe(
                expand(elementNodes =>
                  from(elementNodes).pipe(
                    map(elementNode => {
                      return from(elementNode.children || EMPTY).pipe(
                        filter(isJsxLikeElement),
                      );
                    }),
                  ),
                ),
                concatAll(),
                map(n => n.getText()),
              );
            }),
          ),
        ),
      ),
    ),
  );

export default copyElement$;
