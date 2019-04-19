import { TagCursor } from '#/common/models/file';
import { isInterinsicTag } from '#/common/utils';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import {
  findElementAtCursor$,
  getTagName,
  traverseElement,
  traverseNodeReferences,
} from '#/utils/tsNode';
import { getDeclarationIdentifiersAtSourceFile } from '#/utils/tsNode/getDeclarationIdentifiers';
import incrementIdentifierNameFrom from '#/utils/tsNode/incrementIdentifierNameFrom';
import { EMPTY, forkJoin } from 'rxjs';
import { concatMap, map, switchMap, tap, toArray } from 'rxjs/operators';
import * as ts from 'typescript';

const copyElement$ = (sourceCursor: TagCursor, targetCursor: TagCursor) =>
  forkJoin(
    findElementAtCursor$(sourceCursor),
    findElementAtCursor$(targetCursor),
  ).pipe(
    switchMap(([sourceCursorNode, targetCursorNode]) =>
      forkJoin(
        getDeclarationIdentifiersAtSourceFile(sourceCursorNode.getSourceFile()),
        getDeclarationIdentifiersAtSourceFile(targetCursorNode.getSourceFile()),
      ).pipe(
        switchMap(
          ([
            sourceFileDeclarationIdentifiers,
            targetFileDeclarationIdentifiers,
          ]) => {
            const incrementIdentifierName = incrementIdentifierNameFrom(
              targetFileDeclarationIdentifiers.map(x => x.getText()),
            );

            const rb = new ReplacementBuilder(sourceCursorNode);

            return traverseElement(sourceCursorNode).pipe(
              concatMap(elementNode => {
                if (
                  ts.isJsxElement(elementNode) ||
                  ts.isJsxSelfClosingElement(elementNode)
                ) {
                  const tags = getTagName(elementNode);
                  const openingTag = tags[0];

                  if (!isInterinsicTag(openingTag.getText())) {
                    tags.forEach(tag => {
                      rb.replaceNodeWithText(
                        tag,
                        incrementIdentifierName(tag.getText()),
                      );
                    });

                    return traverseNodeReferences(
                      openingTag,
                      sourceFileDeclarationIdentifiers,
                    );
                  }
                }

                return EMPTY;
              }),
              tap(x => {
                console.log(
                  x.node.parent.getText(),
                  x.definition.parent.getText(),
                );
              }),
              toArray(),
              map(() => {
                return rb.applyReplacements();
              }),
            );
          },
        ),
      ),
    ),
  );

export default copyElement$;
