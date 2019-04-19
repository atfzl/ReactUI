import { TagCursor } from '#/common/models/file';
import { isInterinsicTag } from '#/common/utils';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import {
  findElementAtCursor$,
  getTagName,
  traverseElement,
} from '#/utils/tsNode';
import { getDeclarationIdentifiersAtSourceFile } from '#/utils/tsNode/getDeclarationIdentifiers';
import incrementIdentifierNameFrom from '#/utils/tsNode/incrementIdentifierNameFrom';
import { forkJoin } from 'rxjs';
import { map, switchMap, tap, toArray } from 'rxjs/operators';
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
        switchMap(targetFileDeclarationIdentifiers => {
          const incrementIdentifierName = incrementIdentifierNameFrom(
            targetFileDeclarationIdentifiers.map(x => x.getText()),
          );

          const rb = new ReplacementBuilder(sourceCursorNode);

          return traverseElement(sourceCursorNode).pipe(
            tap(elementNode => {
              if (
                ts.isJsxElement(elementNode) ||
                ts.isJsxSelfClosingElement(elementNode)
              ) {
                const tags = getTagName(elementNode);

                if (!isInterinsicTag(tags[0].getText())) {
                  tags.forEach(tag => {
                    rb.replaceNodeWithText(
                      tag,
                      incrementIdentifierName(tag.getText()),
                    );
                  });
                }
              }

              // handle PROPS
            }),
            toArray(),
            map(() => rb.applyReplacements()),
          );
        }),
      ),
    ),
  );

export default copyElement$;
