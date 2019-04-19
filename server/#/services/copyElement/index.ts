import { TagCursor } from '#/common/models/file';
import { isInterinsicTag } from '#/common/utils';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import {
  findElementAtCursor$,
  getTagName,
  isJsxLikeElement,
} from '#/utils/tsNode';
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
import * as ts from 'typescript';

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
        switchMap(targetFileDeclarationIdentifiers =>
          from(targetFileDeclarationIdentifiers).pipe(
            map(bindingName => bindingName.getText()),
            toArray(),
            switchMap(targetFileDeclarationIdentifiersText => {
              const incrementIdentifierName = incrementIdentifierNameFrom(
                targetFileDeclarationIdentifiersText,
              );

              const rb = new ReplacementBuilder(sourceCursorNode);

              return of([sourceCursorNode]).pipe(
                expand(elementNodes =>
                  from(elementNodes).pipe(
                    map(elementNode => {
                      const tags = getTagName(elementNode);

                      tags.forEach(tag => {
                        if (!isInterinsicTag(tag.getText())) {
                          rb.replaceNodeWithText(
                            tag,
                            incrementIdentifierName(tag.getText()),
                          );
                        }
                      });

                      // tag reference recursive

                      // handle PROPS

                      // continue RECURSION

                      if (ts.isJsxElement(elementNode)) {
                        return from(elementNode.children).pipe(
                          filter(isJsxLikeElement),
                        );
                      }

                      return EMPTY;
                    }),
                  ),
                ),
                concatAll(),
                toArray(),
                map(() => rb.applyReplacements()),
              );
            }),
          ),
        ),
      ),
    ),
  );

export default copyElement$;
