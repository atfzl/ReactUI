import { findAllNodes$ } from '#/utils/tsNode';
import * as R from 'ramda';
import { pipe } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import * as ts from 'typescript';

export const getDeclarationIdentifiersAtNode = (
  node: ts.VariableDeclaration | ts.FunctionDeclaration | ts.ImportDeclaration,
) => {
  if (ts.isVariableDeclaration(node)) {
    return [node.name];
  } else if (ts.isFunctionDeclaration(node)) {
    if (node.name) {
      return [node.name];
    }
  } else {
    if (node.importClause) {
      if (
        node.importClause.namedBindings &&
        ts.isNamespaceImport(node.importClause.namedBindings)
      ) {
        return [node.importClause.namedBindings.name];
      } else {
        if (node.importClause.name) {
          return [node.importClause.name];
        } else if (
          node.importClause.namedBindings &&
          ts.isNamedImports(node.importClause.namedBindings)
        ) {
          return node.importClause.namedBindings.elements.map(
            element => element.name,
          );
        }
      }
    }
  }

  return [];
};

export const getDeclarationIdentifiersAtSourceFile = pipe(
  findAllNodes$<
    ts.VariableDeclaration | ts.FunctionDeclaration | ts.ImportDeclaration
  >(
    R.anyPass([
      ts.isVariableDeclaration,
      ts.isFunctionDeclaration,
      ts.isImportDeclaration,
    ]),
  ),
  concatMap(getDeclarationIdentifiersAtNode),
);
