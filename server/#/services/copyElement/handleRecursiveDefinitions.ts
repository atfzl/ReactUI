import { TagCursor } from '#/common/models/file';
import { isInterinsicTag } from '#/common/utils';
import { getPathRelativeToTarget } from '#/utils/file';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import {
  DeclarationStatement,
  findAncestorNode,
  getTagName,
  isJsxLikeElement,
} from '#/utils/tsNode';
import incrementIdentifierNameFrom from '#/utils/tsNode/incrementIdentifierNameFrom';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as ts from 'typescript';

const handleRecursiveDefinitions = (
  rb: ReplacementBuilder,
  sourceCursor: TagCursor,
  targetCursor: TagCursor,
  insertionsMap: Map<DeclarationStatement, ReplacementBuilder>,
  fileDeclarationIdentifiersText: string[],
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
  const newIdentifierName = incrementIdentifierNameFrom(
    fileDeclarationIdentifiersText,
  )(node.getText());

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
    } else {
      const openingTag = node;

      const parentNode = (isJsxLikeElement(openingTag.parent)
        ? openingTag.parent
        : openingTag.parent.parent) as ts.JsxElement | ts.JsxSelfClosingElement;

      const tags = getTagName(parentNode);

      const interinsicTag = isInterinsicTag(openingTag.getText());

      if (!interinsicTag) {
        tags.forEach(tag => {
          rb.replaceNodeWithText(tag, newIdentifierName);
        });
      }
    }
  }

  /**
   * handle definition
   */
  {
    insertionsMap.delete(definitionDeclaration);
    insertionsMap.set(
      definitionDeclaration,
      new ReplacementBuilder(definitionDeclaration),
    );

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
              `'${relativePathToTarget}'`,
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

        if (!findAncestorNode(ts.isImportDeclaration)(definition)) {
          fileDeclarationIdentifiersText.push(newIdentifierName);
        }
      }),
    );
  }
};

export default handleRecursiveDefinitions;
