import { TagCursor } from '#/common/models/file';
import { isInterinsicTag } from '#/common/utils';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import {
  DeclarationStatement,
  findAncestorNode,
  findElementAtCursor$,
  getTagName,
  isDeclarationStatement,
  isJsxLikeElement,
  traverseElement,
  traverseNodeReferences,
} from '#/utils/tsNode';
import { getDeclarationIdentifiersAtSourceFile } from '#/utils/tsNode/getDeclarationIdentifiers';
import incrementIdentifierNameFrom from '#/utils/tsNode/incrementIdentifierNameFrom';
import * as R from 'ramda';
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
            const insertionsMap = new Map<
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

                    // handle props

                    return traverseNodeReferences(
                      openingTag,
                      sourceFileDeclarationIdentifiers,
                    );
                  }
                }

                return EMPTY;
              }),
              map(({ node, definition }) => {
                return {
                  node,
                  nodeDeclaration: findAncestorNode<DeclarationStatement>(
                    isDeclarationStatement,
                  )(node)!,
                  definition,
                  definitionDeclaration: findAncestorNode<DeclarationStatement>(
                    isDeclarationStatement,
                  )(definition)!,
                };
              }),
              tap(x => {
                const newIdentifierName = incrementIdentifierName(
                  x.node.getText(),
                );

                if (
                  !findAncestorNode(isJsxLikeElement)(x.node) &&
                  x.nodeDeclaration
                ) {
                  if (!insertionsMap.has(x.nodeDeclaration)) {
                    insertionsMap.set(
                      x.nodeDeclaration,
                      new ReplacementBuilder(x.nodeDeclaration),
                    );
                  }

                  insertionsMap
                    .get(x.nodeDeclaration)!
                    .replaceNodeWithText(x.node, newIdentifierName);
                }

                if (!insertionsMap.has(x.definitionDeclaration)) {
                  insertionsMap.set(
                    x.definitionDeclaration,
                    new ReplacementBuilder(x.definitionDeclaration),
                  );
                }

                insertionsMap
                  .get(x.definitionDeclaration)!
                  .replaceNodeWithText(x.definition, newIdentifierName);
              }),
              toArray(),
              map(() => {
                const insertions = Array.from(insertionsMap.values())
                  .map(a => a.applyReplacements())
                  .reverse();

                return {
                  jsx: rb.applyReplacements(),
                  insertions: R.groupBy(
                    a => (a.startsWith('import') ? 'imports' : 'declarations'),
                    insertions,
                  ),
                };
              }),
            );
          },
        ),
      ),
    ),
  );

export default copyElement$;
