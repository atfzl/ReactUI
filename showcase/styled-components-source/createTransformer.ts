import * as ts from 'typescript';
import { CustomStyledIdentifiers } from './models/Options';
import {
  isCallExpression,
  isIdentifier,
  isPropertyAccessExpression,
  isTaggedTemplateExpression,
  isVariableDeclaration,
} from './ts-is-kind';

/**
 *  Detects that a node represents a styled function
 * Recognizes the following patterns:
 *
 * styled.tag
 * Component.extend
 * styled(Component)
 * styledFunction.attrs(attributes)
 */
function isStyledFunction(
  node: ts.Node,
  identifiers: CustomStyledIdentifiers,
): boolean {
  if (isPropertyAccessExpression(node)) {
    if (isStyledObject(node.expression, identifiers)) {
      return true;
    }

    if (node.name.text === 'extend' && isValidComponent(node.expression)) {
      return true;
    }

    return false;
  }

  if (isCallExpression(node) && node.arguments.length === 1) {
    if (isStyledObject(node.expression, identifiers)) {
      return true;
    }

    if (isStyledAttrs(node.expression, identifiers)) {
      return true;
    }
  }

  return false;
}

function isStyledObjectIdentifier(
  name: string,
  { styled: styledIdentifiers = ['styled'] }: CustomStyledIdentifiers,
) {
  return styledIdentifiers.indexOf(name) >= 0;
}

function isStyledObject(node: ts.Node, identifiers: CustomStyledIdentifiers) {
  return (
    node &&
    isIdentifier(node) &&
    isStyledObjectIdentifier(node.text, identifiers)
  );
}

function isValidComponent(node: ts.Node) {
  return node && isIdentifier(node) && isValidComponentName(node.text);
}

function isValidComponentName(name: string) {
  return name[0] === name[0].toUpperCase();
}

function isStyledAttrsIdentifier(
  name: string,
  { attrs: attrsIdentifiers = ['attrs'] }: CustomStyledIdentifiers,
) {
  return attrsIdentifiers.indexOf(name) >= 0;
}

function isStyledAttrs(node: ts.Node, identifiers: CustomStyledIdentifiers) {
  return (
    node &&
    isPropertyAccessExpression(node) &&
    isStyledAttrsIdentifier(node.name.text, identifiers) &&
    isStyledFunction(
      (node as ts.PropertyAccessExpression).expression,
      identifiers,
    )
  );
}

export function createTransformer() {
  const identifiers = {};

  const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
    return node => {
      const visitor: ts.Visitor = n => {
        if (
          n.parent &&
          ((isTaggedTemplateExpression(n.parent) && n.parent.tag === n) ||
            isCallExpression(n.parent)) &&
          n.parent.parent &&
          isVariableDeclaration(n.parent.parent) &&
          isStyledFunction(n, identifiers)
        ) {
          const styledConfig = [];

          const file = n.getSourceFile();

          const { line, character } = file.getLineAndCharacterOfPosition(
            n.getStart(),
          );

          const fileName = file.fileName;
          /**
           * line numbers in editors are 1 indexed,
           * so adding 1 to line and column to be in sync with editors
           */
          const lineNumber = line + 1;
          const columnNumber = character + 1;

          styledConfig.push(
            ts.createPropertyAssignment(
              'componentId',
              ts.createLiteral([fileName, lineNumber, columnNumber].join(',')),
            ),
          );

          return ts.createCall(
            ts.createPropertyAccess(n as ts.Expression, 'withConfig'),
            undefined,
            [ts.createObjectLiteral(styledConfig)],
          );
        }

        ts.forEachChild(n, m => {
          if (!m.parent) {
            m.parent = n;
          }
        });

        return ts.visitEachChild(n, visitor, context);
      };

      return ts.visitNode(node, visitor);
    };
  };

  return transformer;
}

export default createTransformer;
