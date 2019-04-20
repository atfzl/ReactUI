import { TagCursor } from '#/common/models/file';
import { getPathRelativeToTarget } from '#/utils/file';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import {
  DeclarationStatement,
  findAncestorNode,
  isJsxLikeElement,
} from '#/utils/tsNode';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as ts from 'typescript';

const handleRecursiveDefinitions = (
  sourceCursor: TagCursor,
  targetCursor: TagCursor,
  insertionsMap: Map<DeclarationStatement, ReplacementBuilder>,
  incrementIdentifierName: (s: string) => string,
) => ({
  node,
  nodeDeclaration,
  definition,
  definitionDeclaration,
}: {
  node: ts.Identifier;
  nodeDeclaration: DeclarationStatement;
  definition: ts.BindingName;
  definitionDeclaration: DeclarationStatement;
}) => {
  const newIdentifierName = incrementIdentifierName(node.getText());

  /**
   * handle node
   */
  {
    if (!findAncestorNode(isJsxLikeElement)(node) && nodeDeclaration) {
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

    let pip$ = of('');

    if (
      ts.isImportDeclaration(definitionDeclaration) &&
      (definitionDeclaration.moduleSpecifier as ts.StringLiteral).text.startsWith(
        '.',
      )
    ) {
      pip$ = getPathRelativeToTarget(
        sourceCursor.fileName,
        targetCursor.fileName,
        (definitionDeclaration.moduleSpecifier as ts.StringLiteral).text,
      ).pipe(
        tap(relativePathToTarget => {
          insertionsMap
            .get(definitionDeclaration)!
            .replaceNodeWithText(
              definitionDeclaration.moduleSpecifier,
              relativePathToTarget,
            );
        }),
      );
    }

    return pip$.pipe(
      tap(() => {
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
      }),
    );
  }
};

export default handleRecursiveDefinitions;
