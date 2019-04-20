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
import { concatMap, map, switchMap, toArray } from 'rxjs/operators';
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
              map(
                ({
                  node,
                  nodeDeclaration,
                  definition,
                  definitionDeclaration,
                }) => {
                  const newIdentifierName = incrementIdentifierName(
                    node.getText(),
                  );

                  /**
                   * handle node
                   */
                  {
                    if (
                      !findAncestorNode(isJsxLikeElement)(node) &&
                      nodeDeclaration
                    ) {
                      if (!insertionsMap.has(nodeDeclaration)) {
                        insertionsMap.set(
                          nodeDeclaration,
                          new ReplacementBuilder(nodeDeclaration),
                        );
                      }

                      insertionsMap
                        .get(nodeDeclaration)!
                        .replaceNodeWithText(node, newIdentifierName);
                    }
                  }

                  /**
                   * handle definition
                   */
                  {
                    if (!insertionsMap.has(definitionDeclaration)) {
                      insertionsMap.set(
                        definitionDeclaration,
                        new ReplacementBuilder(definitionDeclaration),
                      );
                    }

                    if (ts.isImportDeclaration(definitionDeclaration)) {
                      // insertionsMap
                      //   .get(definitionDeclaration)!
                      //   .replaceNodeWithText(
                      //     definitionDeclaration.moduleSpecifier,
                      //     getPathRelativeToTarget(
                      //       sourceCursor.fileName,
                      //       targetCursor.fileName,
                      //       definitionDeclaration.moduleSpecifier.getText(),
                      //     ),
                      //   );
                    }

                    if (
                      ts.isImportSpecifier(definition.parent) &&
                      definition.parent.name === definition &&
                      !definition.parent.propertyName
                    ) {
                      insertionsMap
                        .get(definitionDeclaration)!
                        .replaceNodeWithText(
                          definition,
                          `${definition.getText()} as ${newIdentifierName}`,
                        );
                    } else {
                      insertionsMap
                        .get(definitionDeclaration)!
                        .replaceNodeWithText(definition, newIdentifierName);
                    }
                  }
                },
              ),
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
