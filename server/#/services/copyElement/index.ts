import { TagCursor } from '#/common/models/file';
import { isInterinsicTag } from '#/common/utils';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import {
  DeclarationStatement,
  findAncestorNode,
  findAncestorNode$,
  findElementAtCursor$,
  getTagName,
  isDeclarationStatement,
  isJsxLikeElement,
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
            const insertions = new Map<
              DeclarationStatement,
              ReplacementBuilder
            >();

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
              concatMap(x => {
                const nodeDeclaration$ = findAncestorNode$<
                  DeclarationStatement
                >(isDeclarationStatement)(x.node);
                const definitionDeclaration$ = findAncestorNode$<
                  DeclarationStatement
                >(isDeclarationStatement)(x.definition);

                return forkJoin(nodeDeclaration$, definitionDeclaration$).pipe(
                  map(([nodeDeclaration, definitionDeclaration]) => ({
                    ...x,
                    nodeDeclaration,
                    definitionDeclaration,
                  })),
                );
              }),
              tap(x => {
                const newIdentifierName = incrementIdentifierName(
                  x.node.getText(),
                );

                if (
                  !findAncestorNode(isJsxLikeElement)(x.node) &&
                  x.nodeDeclaration
                ) {
                  if (!insertions.has(x.nodeDeclaration)) {
                    insertions.set(
                      x.nodeDeclaration,
                      new ReplacementBuilder(x.nodeDeclaration),
                    );
                  }

                  insertions
                    .get(x.nodeDeclaration)!
                    .replaceNodeWithText(x.node, newIdentifierName);
                }

                if (!insertions.has(x.definitionDeclaration)) {
                  insertions.set(
                    x.definitionDeclaration,
                    new ReplacementBuilder(x.definitionDeclaration),
                  );
                }

                insertions
                  .get(x.definitionDeclaration)!
                  .replaceNodeWithText(x.definition, newIdentifierName);
              }),
              toArray(),
              map(() => {
                return [
                  rb.applyReplacements(),
                  Array.from(insertions.values()).map(x =>
                    x.applyReplacements(),
                  ),
                ];
              }),
            );
          },
        ),
      ),
    ),
  );

export default copyElement$;
