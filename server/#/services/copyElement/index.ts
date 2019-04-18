import { TagCursor } from '#/common/models/file';
import { findElementAtCursor$, isJsxLikeElement } from '#/utils/tsNode';
import { getDeclarationIdentifiersAtSourceFile } from '#/utils/tsNode/getDeclarationIdentifiers';
import incrementIdentifierNameFrom from '#/utils/tsNode/incrementIdentifierNameFrom';
import { EMPTY, forkJoin, from, of } from 'rxjs';
import { expand, filter, map, switchMap, toArray } from 'rxjs/operators';

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
            switchMap(identifierText => {
              const incrementIdentifierName = incrementIdentifierNameFrom(
                identifierText,
              );

              incrementIdentifierName('sourceCursorNode');

              return of(sourceCursorNode).pipe(
                expand(elementNode =>
                  from(elementNode.children || EMPTY).pipe(
                    filter(isJsxLikeElement),
                  ),
                ),
                map(n => n.getText()),
              );
            }),
          ),
        ),
      ),
    ),
  );

export default copyElement$;
