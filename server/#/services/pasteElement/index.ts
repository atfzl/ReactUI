import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import { findAllNodes } from '#/utils/tsNode';
import * as _ from 'lodash';
import { of } from 'rxjs';
import * as ts from 'typescript';

const pasteElement = (opts: {
  jsx: string;
  insertions: { imports?: string[]; declarations?: string[] };
  targetCursorNode: ts.JsxElement | ts.JsxSelfClosingElement;
}) => {
  const { jsx, insertions, targetCursorNode } = opts;
  const targetFileNode = targetCursorNode.getSourceFile();

  const rb = new ReplacementBuilder(targetFileNode);

  if (ts.isJsxElement(targetCursorNode)) {
    rb.insert(targetCursorNode.closingElement.getStart(), jsx);
  } else {
    const lastSlashIndex = _.findLastIndex(
      targetCursorNode.getText(),
      x => x === '/',
    );

    rb.delete(
      targetCursorNode.getStart() + lastSlashIndex,
      targetCursorNode.getStart() + lastSlashIndex + 1,
    );
    rb.insert(
      targetCursorNode.getEnd(),
      `\n${jsx}\n</${targetCursorNode.tagName.getText()}>`,
    );
  }

  if (insertions.declarations) {
    const lastImportNode = findAllNodes(
      targetFileNode,
      ts.isImportDeclaration,
    ).sort((a, b) => b.end - a.end)[0];

    if (lastImportNode) {
      rb.insert(
        lastImportNode.getEnd(),
        insertions.declarations.join('\n') + '\n',
      );
    }
  }

  if (insertions.imports) {
    rb.insert(targetFileNode.getStart(), insertions.imports.join('\n') + '\n');
  }

  return of(rb.applyReplacements());
};

export default pasteElement;
